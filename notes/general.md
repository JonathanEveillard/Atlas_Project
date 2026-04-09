# General Notes 

This section includes code snippets, overall tips and tricks and others.

## PfSense

### Accessing PfSense from bare metal Terminal
`/etc/rc.initial` or `/usr/local/sbin/pfSense-shell`

## Mistakes encountered

### Accessing PfSense from LAN

PfSense is usually preconfigured and ready to go. This being said, you shouldn't run in any issues on the get gobut it may happen like it did to myself. Keepings this brief i will explain why this occurs and how you can fix it.

Your LAN (Local Area Network) and WAN (Wide Area Network) are meant to be used seperately. 
- WAN | Meant to be used for internet access
- LAN | Meant to be used for internal access

Unfortunately some bare metal devices do have NIC (Network Interface Controller) Port specific Numbering and Labeling. For example (Protectli)[https://kb.protectli.com/kb/vault-nic-port-information-numbering-and-labeling/] The Vault has it's own numbering which may not match your pfsense labeling at all.



