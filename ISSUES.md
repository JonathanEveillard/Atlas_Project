# Record of certain Dated Issues Encountered 

## Tuesday June 16 2026 @ 1:00am 

> Networking Issue

### Description

I created a new proxmox virtual machine aiming to create AD 2025 Server to aid in Proxmox User Management. I then encountered a network issue where the AD VM itself wasn't picking up any NIC from the host.

### Solution

I switched the network Interface from `VirtIO` to `VMWare Vmxnet3`. According to an [Article](https://www.experts-exchange.com/videos/79736/HOW-TO-Install-and-Use-the-fully-virtualized-VMXNET3-network-interface-driver-in-Windows-11-and-Windows-Server-2022.html) by Andrew Hancock, i was able to conclude that Microsoft started shipping vmxnet3 driver in box on the Windows Server Installation media with server 2022 which carried over to the 2025 version. This being said, the direct support interface is `Vmxnet 3`.
