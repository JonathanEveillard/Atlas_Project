# Atlas  Self Hosted Private Cloud

![Atlas](./logo/Atlas.png)

Infrastructure as code homelab: two node Proxmox cluster running a full self hosted platform stack, provisioned and managed declaratively.

## Architecture
- **pve**, desktop class compute node
- **pve2**, Mac Mini handles Infra/Networking/Monitoring
- **Firewall**, Bare metal pfSense at network edge + Tailscale for remote access + NFS backup target on external 1TB Drive

## Stack
**Porvisioning & Config**
- Terraform
- Ansible
- Proxmox LXC

**Orchestration**
- K3s (k3s-server, control-plane, k3s- workload, k3s-observability)
- Helm
- ArgoCD + Jenkins (GitOps)

**Observability**
- Prometheus
- Grafana + Loki (Kube prometheus stack via Helm, pinned to Observability Node)

**Data & Persistence**
Dedicated LXC handling Database Engines: 
- MySQL
- PostgreSQL
- MongoDB

**Identity & Access**
- LLDAP (Proxmox user directory + Keycloak backend)
- Keycloak (SSO across services)
- Vault (secrets, TOTP-based 2FA via AWS auth mount)

**Netowrking**
- Traefik(internal)
- Adguatd Home(DNS)
- Cert Manager

**Backup**
Proxmox Backup Server + Restic, replicated to NFS

**QA / Policy**
- Checkov
- Trivy
- Uptime Kuma

**AI/ML** (In Progress)
Dedicated Linux VM with RTX 3060 PCIe passthrough (outside K3s): 
- Ollama + Open WebUI
- MLflow
- JupyterHub
- Unsloth
- Axolotl
- DVC
- Langfuse

**Computer Graphics & Computer Vision Development** (Will be used for later projects)
Dedicated Windows VM with RTX 3060 PCIe passthrough (outside K3s): 
- KodeLife
- WSL (Debian, Alpine)

**Apps & Services**
- Nextcloud
- Outline for self built unreleased software

**Security**
Dedicated Vm with Wazuh

## Next Addtion
- **Atlas Dash**, Internal Developper Portal (Go + Vite/React), with Selenium/Playwright, PostHog, OpenAPI Swagger, Gatus, Lighthouse CI
- Role Based deployements public templates (Developper, Cybersecurity, Networking, Ops, Hobbyist) via single curl install script
- DMZ segment: public Traefik, Gatus Status Page, Static Portfolio

## Repo Structure

```
.
├── terraform/       # infra provisioning
├── ansible/         # config management / playbooks
├── k8s/             # manifests, Helm values
├── argocd/          # GitOps app definitions
└── docs/            # architecture notes
```

## What I Learned

- Bare metal firewall configuration requires understanding
  physical network topology before touching any software
  — spent significant time mapping pfSense interfaces
  to physical ports before any rules were configured
- Self hosting GitLab revealed operational complexity
  that GitHub abstracts away, runner registration,
  executor configuration, resource limits, and external
  URL configuration all require explicit decisions
- NFS setup across two Proxmox nodes exposed networking
  fundamentals, NFS relies on stable IP addressing,
  which required static IP configuration on both nodes
  before NFS mounts would survive reboots
- Two node cluster design forced thinking about failure
  modes, what happens to DNS if PVE2 goes down, what
  happens to services if PVE1 goes down

