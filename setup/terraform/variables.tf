variable "proxmox_endpoint" {
  type = string
}

variable "proxmox_api_token" {
  type      = string
  sensitive = true
}

# VM names
variable "control_vm" {
  type = string
}

variable "worker_vm1" {
  type = string
}

variable "worker_vm2" {
  type = string
}

# Nodes
variable "node1_name" {
  type    = string
  default = "pve"
}

variable "node2_name" {
  type = string
}

# Templates (one per node)
variable "node1_template_id" {
  type    = number
  default = 9000
}

variable "node2_template_id" {
  type    = number
  default = 9001
}

# Resources
variable "cores" {
  type    = number
  default = 2
}

variable "memory" {
  type    = number
  default = 2048
}

variable "disk_size" {
  type        = number
  description = "Disk size in GB, must be >= template disk"
  default     = 20
}

variable "datastore_id" {
  type    = string
  default = "local-lvm"
}

variable "bridge" {
  type    = string
  default = "vmbr0"
}

variable "ip1_address" {
  type = string
}

variable "ip2_address" {
  type = string
}

variable "ip3_address" {
  type = string
}

variable "gateway_address" {
  type = string
}

variable "ssh_keys" {
  type      = list(string)
  sensitive = true
}