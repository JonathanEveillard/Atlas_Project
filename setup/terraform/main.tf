# Proxmox VM provisioning using BPG provider
# Values are to be changed in terraform.tfvars
terraform {
  required_providers {
    proxmox = {
      source = "bpg/proxmox"
      version = "~> 0.117.0"
    }
  }
}

provider "proxmox" {
  endpoint = var.proxmox_endpoint
  api_token = var.proxmox_api_token
  insecure = true
}

resource "proxmox_virtual_environment_vm" "vm1" {
  name = var.vm_name
  node_name = var.node_name

  clone {
    vm_id = var.template_id 
  }

  cpu {
    cores = var.cores
  }

  memory {
    dedicated = var.memory
  }

  disk {
    datastore_id = var.datastore_id
    interface = "scsi0"
  }

  network_device {
    bridge = var.bridge
  }
}
