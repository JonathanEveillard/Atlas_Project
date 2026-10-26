#!/bin/bash

while true; do
	
	read -p"Enter your setup method: create [0] / destroy [1] or 'q' to exit: " input
	case "$input" in
		0) 
			echo "Creating your k3s Infrastructure..."
			cd terraform && terraform apply -auto-approve && cd ..
			cd ansible && ansible-playbook -i inventory.ini site.yml
			echo "k3s Infrastructure up and running"
			break;
			;;
		1)
			echo "Destroying your k3s Infrastructure..."
			cd terraform && terraform destroy -auto-approve
			break;
			;;
		q | Q)
			echo "Quitting program..."
			exit 0
			;;
		*)
			echo "Invalid input, enter 0,1 or 'q'."
			;;
	esac
done
