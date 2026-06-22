### ATLAS CLOUD DASHBOARD
Visual UI for managing MOST tools, services and overall cloud environment. 
RELEASE DATE: TBD


### Docker Compose To Use
`
services:
  dashboard:
    image: jonathaneveillard/atlas-dashboard:latest   
    ports:
      - "4000:4000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /home/admin1/services:/home/admin1/services:ro
    env_file:
      - .env
    restart: unless-stopped
`