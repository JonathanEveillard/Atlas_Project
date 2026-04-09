# General Notes 

This section includes code snippets, overall tips and tricks and others.

## PfSense

### Accessing PfSense from bare metal Terminal
`/etc/rc.initial` or `/usr/local/sbin/pfSense-shell`

## Mistakes encountered

### Accessing PfSense from LAN

Potential Issues are:
- Wrong Port Labeling
- Wrong Subnetting

PfSense is usually preconfigured and ready to go. This being said, you shouldn't run into any issues on the get gobut it may happen like it did to myself. Keepings this brief i will explain why this occurs and how you can fix it.

Your LAN (Local Area Network) and WAN (Wide Area Network) are meant to be used seperately. 
- WAN | Meant to be used for internet access
- LAN | Meant to be used for internal access

--- 
Unfortunately some bare metal devices do have NIC (Network Interface Controller) Port specific Numbering and Labeling. For example [Protectli](https://kb.protectli.com/kb/vault-nic-port-information-numbering-and-labeling/) The Vault has it's own numbering which may not match your pfsense labeling at all. This misunderstanding can lead your system to label your WAN as LAN and vice versa. To fix this you can do as shown on your pfsense:
- Press 1 | Assign Interfaces
- Shows igb0 - igb(n) or network interfaces available
- Ensure you read labeling from your official bare metal documentation and assign your interfaces there
- (Optional) if your lazy just switch the ports physically, BEWARE! You will get into more issues later on.

--- 

On another hand, subnetting is very important as well. sIf you've changed your `LAN` to be something along the lines of `10.0.0.x` while you `WAN` was already set to `10.0.0.x` your network wont be able to differentiate where the network packets are coming from. This causes a confusion for your system. To fix this issue, you can do as shown on your pfsense, solution partially solved by [`CyberSec Guru`](https://thecybersecguru.com/self-hosting/pfsense-configuration-guide-initial-setup/):
- Press 2 | Set Interfaces IP
- It will ask which interface you want to configure. Type 2 for LAN.
- Enter the new LAN IPv4 address with a different subnet from your WAN: Choose a different private IP range. A good, memorable choice is 10.0.1.1. Type this in and press Enter.
- Enter the new LAN IPv4 subnet bit count: This determines the size of your network. For most home networks, 24 (which gives you 254 usable IPs) is the correct choice. Type 24 and press Enter.
- Upstream gateway: It will ask for an upstream gateway. Since this is our LAN, there is none. Just press Enter.
- IPv6: It will ask about IPv6. We are not configuring that now. Press Enter.
- DHCP Server: It will ask if you want to enable the DHCP server on LAN. Type y and press Enter.
- Start of DHCP Range: Enter the starting IP address for devices on your network. A good choice is 10.0.0.100.
- End of DHCP Range: Enter the ending IP address. A good choice is 10.0.0.200. This gives you 101 available addresses for dynamic clients, leaving plenty of room for static assignments.
- Revert to HTTP: It will ask if you want to revert the web GUI protocol to HTTP. Type y. This can make the first connection easier.

Your PfSense WebUI should now be accessible at 10.0.1.x
