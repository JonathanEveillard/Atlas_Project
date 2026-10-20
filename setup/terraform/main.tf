# Proxmox VM provisioning using BPG provider
# Values are to be changed in terraform.tfvars

terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.117.0"
    }
  }
}

provider "proxmox" {
  endpoint    = var.proxmox_endpoint
  api_token   = var.proxmox_api_token
  insecure    = true
}

# Init VM object
locals {
  vms = {
    control = { name = var.control_vm, node = var.node1_name, template = var.node1_template_id, ip = var.ip1_address }
    worker1 = { name = var.worker_vm1, node = var.node1_name, template = var.node1_template_id, ip = var.ip2_address }
    worker2 = { name = var.worker_vm2, node = var.node2_name, template = var.node2_template_id, ip = var.ip3_address }
  }
}

#Iterate through VM object (control, worker 1, worker 2)
resource "proxmox_virtual_environment_vm" "vm" {
  for_each = local.vms

  name      = each.value.name
  node_name = each.value.node

  clone {
    vm_id     = each.value.template
    node_name = each.value.node
    full      = true
  }

  cpu {
    cores = var.cores
  }

  memory {
    dedicated = var.memory
  }

  disk {
    datastore_id = var.datastore_id
    interface    = "scsi0"
    size         = var.disk_size 
  }

  network_device {
    bridge = var.bridge
  }

  initialization {
    datastore_id = var.datastore_id

    ip_config {
      ipv4 {
        address = each.value.ip 
        gateway = var.gateway_address
      }
    }

    user_account {
      username = "ubuntu"
      keys     = var.ssh_keys
    }
  }
}
