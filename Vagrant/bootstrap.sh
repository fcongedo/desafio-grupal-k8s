#!/bin/bash

# update apt packages
sudo apt-get update -y

# Docker Install
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh

# Use Docker without sudo
sudo groupadd docker
sudo usermod -aG docker vagrant
newgrp docker

#Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
	
#Install minikube	
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
