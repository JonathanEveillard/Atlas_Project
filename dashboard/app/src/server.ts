import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';


//  Packages Needed for my API calls
import {readdir} from 'node:fs/promises';
import Dockerode from 'dockerode'; 

const browserDistFolder = join(import.meta.dirname, '../browser');

// env vars
const SERVICES_PATH = process.env['SERVICES_PATH'] ?? '/home/admin1/services';
const NPM_URL = process.env['NPM_URL'] ?? 'http://localhost:81';
const NPM_EMAIL = process.env['NPM_EMAIL'] ?? '';
const NPM_PASSWORD = process.env['NPM_PASSWORD'] ?? '';
const SERVICE_NAME = process.env['SERVICE_NAME'] ?? 'atlas';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);


async function getNpmProxyHost(){
  // Post token from registry
  const tokenRes = await fetch(`${NPM_URL}/api/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identity: NPM_EMAIL,
      secret: NPM_PASSWORD
    }),
  });

  // Extract token from response
  const { token } = await tokenRes.json() as { token: string };

  // Use token to get registry host
  const hostRes = await fetch(`${NPM_URL}/api/nginx/proxy-hosts`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Return the registry host
  return hostRes.json() as Promise<{ domain_names: string[] }[]>;
}

// Handle incoming services
app.get('/api/services', async (_req,res) =>{
  try{
    const files = await readdir(SERVICES_PATH);
    const serviceNames = files

    // Finds corresponding services by trimming -compose.yml 
    .filter(f=> f.endsWith('-compose.yml'))
    .map(f => f.replace('-compose.yml', ''));

    // Create connection to Docker
    const docker = new Dockerode({
      socketPath: '/var/run/docker.sock'
    });

    const containers = await docker.listContainers({all:true});

    let proxyHosts: { domain_names: string[] }[] = [];
    try {
      proxyHosts = await getNpmProxyHost();
    } catch {
      
    }


    const services = serviceNames.map(name => {
      // Find matching Docker container
      const container = containers.find(c =>
        c.Names.some(n => n.toLowerCase().includes(name))
      );

      // Find matching NPM proxy host
      const npmHost = proxyHosts.find(h =>
        h.domain_names.some(d => d.toLowerCase().includes(name))
      );

      // Determine status from Docker
      let status: 'running' | 'stopped' | 'error' | 'current' = 'stopped';
      if (name === SERVICE_NAME) {
        status = 'current';
      } else if (container) {
        if (container.State === 'running') status = 'running';
        else if (container.State === 'exited' || container.State === 'dead') status = 'stopped';
        else status = 'error';
      }

    return {
      name,
      status,
      url: npmHost?.domain_names[0] ?? null,
    };
  });

  res.json(services);

  }catch(error){
    res.status(500).json({
      error: 'Failed to fetch services'
    });
  }
})

app.use((req, _res, next) => {
  req.headers['host'] = 'localhost';
  next();
});

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
