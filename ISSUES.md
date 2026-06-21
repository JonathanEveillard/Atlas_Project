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

---

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

