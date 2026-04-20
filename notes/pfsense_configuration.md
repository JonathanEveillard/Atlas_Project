# PfSense Network Configuration

## Preconfiguration

Before we configure our PfSense Router we need to make sure we have everything set. Make sure you have the following:
- Switch with 8 ports available minimum | `TP Link` Recommended Brand
- Multiple Ethernet Cables | `Bestbuy` or `Amazon` Recommended

## Configuration

### Setting up your Network Interface Controllers (NIC)

If you are using a bare metal device for your PfSense make sure you check the Port labeling Documentation in order to properply assign the interfaces directly to PfSense.

To assign the interfaces to your PfSense, you can do as recommended below:

- Press 2 | Set Interfaces IP
- It will ask which interface you want to configure. Type 2 for LAN.
- Enter the new LAN IPv4 address with a different subnet from your WAN: Choose a different private IP range. A good, memorable choice is 10.0.1.1. Type this in and press Enter.
- Enter the new LAN IPv4 subnet bit count: This determines the size of your network. For most home networks, 24 (which gives you 254 usable IPs) is the correct choice. Type 24 and press Enter.
- Upstream gateway: It will ask for an upstream gateway. Since this is our LAN, there is none. Just press Enter.
- IPv6: It will ask about IPv6. We are not configuring that now. Press Enter.
- DHCP Server: It will ask if you want to enable the DHCP server on LAN. Type y and press Enter.
- Start of DHCP Range: Enter the starting IP address for devices on your network. A good choice is 10.0.1.100.
- End of DHCP Range: Enter the ending IP address. A good choice is 10.0.1.200. This gives you 101 available addresses for dynamic clients, leaving plenty of room for static assignments.
- Revert to HTTP: It will ask if you want to revert the web GUI protocol to HTTP. Type y. This can make the first connection easier.

Your PfSense WebUI should now be accessible at 10.0.1.x

### Setting up WPA2-Entreprise Network Authentication (OPTIONAL)

WPA2-Entreprise is essentially just forcing users to input credentials before being able to access a network. It is recommended to just use WPA-Personal if you network is for single use. WPA2-Entrepise imporves security all around in general.

To set it up you can do as recommended below:
- Navigate to System < Package Manager
- Search for freeradius and install it
