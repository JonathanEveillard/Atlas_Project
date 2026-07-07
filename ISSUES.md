# Record of certain Dated Issues Encountered 

## Tuesday June 16 2026 @ 1:00am 

> Networking Issue

### Description

I created a new proxmox virtual machine aiming to create AD 2025 Server to aid in Proxmox User Management. I then encountered a network issue where the AD VM itself wasn't picking up any NIC from the host.

### Solution

I switched the network Interface from `VirtIO` to `VMWare Vmxnet3`. According to an [Article](https://www.experts-exchange.com/videos/79736/HOW-TO-Install-and-Use-the-fully-virtualized-VMXNET3-network-interface-driver-in-Windows-11-and-Windows-Server-2022.html) by Andrew Hancock, i was able to conclude that Microsoft started shipping vmxnet3 driver in box on the Windows Server Installation media with server 2022 which carried over to the 2025 version. This being said, the direct support interface is `Vmxnet 3`.



---

## **Record of Dated Issues Encountered**

---

### **Saturday June 20 2026 @ 11:03pm**

### **Home DNS Resolution + AdGuard Deployment Issue**

---
> Networking Issue
## **Description**

I deployed a new DNS stack on a Proxmox LXC container running AdGuard Home on IP [IP Here - Kept Hidden]. The goal was to centralize DNS resolution for the home network and enable local domain resolution for services such as `gitlab.[Hidden Endpoint]`.

After deployment, DNS resolution became inconsistent across devices (MacOS and mobile). The system intermittently resolved:

* AdGuard DNS (`Hidden IP`)
* ISP DNS (`Hidden`)
* IPv6 resolver DNS (`Hidden IPv6`)
* Tailscale DNS (`Hidden`)

This caused:

* `gitlab.[Hidden]` failing with `ERR_NAME_NOT_RESOLVED`
* Intermittent DNS resolution depending on interface used
* macOS showing multiple DNS resolvers simultaneously via `scutil --dns`
* Split DNS behavior between LAN and VPN (Tailscale)

Additional issues included:

* `.[Hidden]` domain conflict with mDNS/Bonjour behavior on macOS
* IPv6 DNS from ISP bypassing AdGuard filtering
* DHCP and interface-level DNS overrides causing inconsistent resolver priority

---

## **Solution**

### **1. Standardized DNS to AdGuard**

All DHCP DNS settings on pfSense were modified to only point to:

```
[Hidden IP] (AdGuard Home)
```

WAN DNS override was confirmed disabled to prevent ISP DNS injection.

---

### **2. Eliminated DNS leaks via IPv6 & Checked available IPs**

macOS was found to still be receiving IPv6 DNS resolvers from the ISP.

To resolve this:

* IPv6 DNS was disabled on the client interface (`networksetup -setv6off Wi-Fi`)
* This prevented fallback to external IPv6 resolvers (`Hidden`)
* Found available Ip's `nmap -sn [IP Addr]/24` to later set static ip

---

### **3. Removed DNS conflicts from Tailscale**

Tailscale DNS injection was identified as a secondary resolver source.

DNS override and split DNS features were disabled to prevent:

* `[Hidden Ipv4]`
* `[Hidden IPv6]`

from being inserted into the resolver chain.


### **4. DNS validation and cleanup**

After changes:

* DHCP leases were renewed
* DNS resolver table verified using `scutil --dns`

Final expected state confirmed:

```
[Hidden IPv4] only (AdGuard Home)
```

### **Wednesday July 1 2026 @ 4:00am**
> Wrong data Migration tool (cp/scp vs rSync)

### ***Description***
Backed up gitlab easily with cp/scp via ip but failed with nextcloud as cp/scp doesn't provide a reliable way of transfering large contents (slow, no resume, no verification, and silent mismatch issues when transfering data).

### ***Solution***
rSync is by far the best solution for now since it offers a fast, versatile command line utility for copying and synchronizing large files and directories locally and remotely.

### **Wednesday July 1 2026 @ 4:43am**
> Incorrect File System Format

### ***Description***
In the process of backing up nextcloud, some files were not backed up properply due to improper permissions and ownership.

### ***Solution***
I formated my external drive (backup) to ext4 to support unix ownership.

---

### **Saturady July 4 2026 @ 3:50pm**
> Warning: REMOTE HOST IDENTIFICATION HAS BEEN CHANGED!

### ***Description***
While creating vm template for cloud-init via proxmox and setting up terraform for
k3s-cluster provisioning i got an unexpected ssh error that would not allow me to 
connect to the selected vm. 


### ***Solution***
Because terraform apply/destroy, it would save previous host key into `known_hosts`, meaning that the following build was never recognized properly. Hence the only quick and easy solution was to force the computer to erase the host key from it's memory with `ssh-keygen -f '/root/.ssh/known_hosts' -R '10.0.x.x'`

### **Saturady July 5 2026 @ 1:40am**
> Duplicate Resource Blocks | Terraform x Proxmox Issue

### ***Description***
Multiple Vm were utilizing the identical resource definition `proxmox_virtual_environment_vm "k3s_worker"`. This caused a compile error because terraform requires unique resource definitions.


### ***Solution***
Refactored the naming scheme to use explicit tracking indices: `k3s_worker_1` and `k3s_worker_2`.

### **Saturady July 5 2026 @ 1:30am**
> Provider mistmatch | Terraform x Proxmox Issue

### ***Description***
I switch proxmox providers for easier handling, switching from `Telmate/proxmox` plugin to a modern `bpg/proxmox` which has different ways of receiving specific proxmox node (`pve` or `pve2`).

### ***Solution***
Changed `target_name = "pve"` to `node_name = "pve"` across all three resource definitions to align with the bpg provider specs.

### **Saturady July 5 2026 @ 1:10am**
> Disk Controller Boot loop | Terraform x Proxmox Issue

### ***Description***
Once the disk was attached, the cloned VM under `pve2` dropped into an initramfs recovery prompt. The guest Ubuntu Linux kernel lacked the native SCSI controller drivers inside its initial ramdisk to mount the storage block when forced onto a generic SCSI address space.

### ***Solution***
Updated `main.tf` to provision the disk layout using the native virtio0 interface instead of `scsi0` and ensured the template profile was set to use the standard `virtio-scsi-pci` controller hardware.

### **Saturady July 5 2026 @ 1:20am**
> Unused Storage| Terraform x Proxmox Issue

### ***Description***
On `pve2`, the manually imported Ubuntu Cloud Image template `9001` held its storage volume as an detached block `unused0` instead of being actively linked to a drive controller `scsi0`. When Terraform attempted a standard clone, it created a shell configuration missing a bootable root filesystem.

### ***Solution***
Temporarily flipped the template status file via CLI, mapped the volume explicitly to `scsi0 using qm set 9001 --scsi0 local-lvm:vm-9001-disk-0`, and converted it back to a base template.

### **Saturady July 5 2026 @ 1:00am**
> Missing Virtual NIC | Terraform x Proxmox Issue

### ***Description***
While initialization blocks were defined for Cloud-Init networking, no physical network card `network_device` was explicitly defined inside the VM resource scope. Without a network interface map, Cloud-Init could not bind the static IPs to a bridge interface.

### ***Solution***
Appended a dedicated `network_device { bridge = "vmbr0" }` block to each node definition.


### **Saturady July 5 2026 @ 11:35am**
> Ansible k3s cluster refused remote connection

### ***Description***
The ansible playbook `site.yml`, containing the config of the k3s details, was receiving a refused connection error message whereas it was attempting to ssh into the single nodes as the default username `root@10.0.x.x`.

### ***Solution***
Specified `remote_user: Example_NotReal_Username` inside of my ansible playbook.

### **Sunday July 6 2026 @ 9:00pm**
> wait_for Timeout | Ansible x K3s Issue

### ***Description***
The `k3s_server` role task "Wait for control plane to be ready" timed out waiting on `api_endpoint:api_port`. The inventory variable `api_endpoint` was set to the Ansible inventory alias (`master_s0`) instead of a resolvable address, so `wait_for` could never open a TCP connection — even though the k3s service itself was healthy.

### ***Solution***
Set `api_endpoint` in `inventory.yml` to the actual reachable IP of the control-plane node (matching `ansible_host` for the server group), rather than the inventory hostname string.

---

### **Sunday July 6 2026 @ 11:20pm**
> Single-Node Misconfiguration | Ansible x K3s Issue

### ***Description***
All three inventory hosts (`master_s0`, `workload_s1`, `observability_s2`) had `ansible_connection: local` set. This caused every Ansible task — including k3s server and agent installs — to execute on the Proxmox host (`pve`) itself rather than on the intended separate VMs, regardless of which inventory entry was being targeted. Confirmed via `journalctl -u k3s`, which showed `hostname-override=pve` on every install attempt.

### ***Solution***
Removed `ansible_connection: local` from all hosts so Ansible defaults to SSH. Confirmed each VM's real IP via `ip -4 a`, updated `ansible_host` values accordingly, and verified connectivity with `ansible k3s_cluster -i inventory.yml -m ping` before re-running the playbook.

---

### **Sunday July 6 2026 @ 11:45pm**
> Root Login Disabled | Ansible x K3s Issue

### ***Description***
SSH connections to the cloud-init-provisioned Ubuntu VMs failed fact-gathering with `Please login as the user "[Selected Username]" rather than the user "root"`, since root SSH login is disabled by default on the Ubuntu cloud image.

### ***Solution***
Set `ansible_user: [Selected Username]` and kept `ansible_become: true` in `inventory.yml`, allowing Ansible to connect as the `[Selected Username]` user and escalate via sudo for install steps instead of connecting directly as root.

---

### **Monday July 7 2026 @ 1:20am**
> Broken /tmp Permissions | Ansible x K3s Issue

### ***Description***
The `prereq` role's "Install Dependent Ubuntu Packages" task failed with `Failed to update apt cache after 5 retries`. Manual `apt update` on the VM revealed the real cause: `Couldn't create temporary file /tmp/apt.conf.XXXXXX for passing config to apt-key`. `/tmp` was found with mode `755`, owned by `[Selected Username]:[Selected Username]`, instead of the standard `1777` root-owned sticky-bit directory every Linux system expects.

### ***Solution***
Ran `sudo chmod 1777 /tmp` and `sudo chown root:root /tmp` on all three VMs. Added a `pre_tasks` block to the "Cluster prep" play in `site.yml` to enforce correct `/tmp` permissions/ownership automatically on every run, before any role logic depends on it.

---

### **Monday July 7 2026 @ 1:30am**
> Stale k3s Install / Version Drift | Ansible x K3s Issue

### ***Description***
The `k3s_server` role's "Run K3s install script" task failed with `No such file or directory: /usr/local/bin/k3s-install.sh`. Investigation showed k3s was already installed on the node (`v1.36.2+k3s1`) — a different version than the one specified in inventory (`k3s_version: v1.33.4+k3s1`) — likely from an earlier partial or manual run. The install script itself was missing, so the role's "always run install script" step had nothing to execute.

### ***Solution***
Ran `/usr/local/bin/k3s-uninstall.sh` on the affected node to remove the stale install, then re-ran the playbook for a clean install matching the pinned `k3s_version`. Added a `pre_tasks` check in `site.yml` that detects an existing k3s binary, compares its version against `k3s_version`, and warns (rather than auto-removing) if they differ, so version drift is caught before future runs instead of failing deep inside the role.

---

### **Monday July 7 2026 @ 1:50am**
> ansible.cfg Not Loaded | Provisioning Script Issue

### ***Description***
The provisioning wrapper script called `ansible-playbook` with absolute paths (and a malformed playbook argument pointing at a directory instead of `site.yml`). Because `ansible-playbook` was not run from within `current_config/`, it never picked up the local `ansible.cfg`, which defines `roles_path` relative to that directory. This caused `the role 'prereq' was not found` even though the role existed and had worked previously when run manually from the correct directory.

### ***Solution***
Updated the provisioning script to `cd /root/setup/k3s-cluster/ansible/current_config` before invoking `ansible-playbook playbooks/site.yml -i inventory.yml`, using paths relative to that directory so `ansible.cfg` (and its `roles_path`) loads correctly on every run, including from cron or other working directories.

## **Outcome**

* AdGuard Home successfully became the single DNS authority
* Split DNS behavior eliminated across LAN and VPN
* Local service resolution stabilized (GitLab and internal services)
* IPv6 and VPN DNS leakage removed as root causes
* DNS architecture standardized for future services

---

## **Final Architecture Achieved**

```
Clients (LAN + VPN)
        ↓
[Hidden IPv4] (AdGuard Home)
        ↓
pfSense Gateway
        ↓
Internet DNS
```

