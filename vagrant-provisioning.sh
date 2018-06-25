#!/usr/bin/env bash

NODE_VERSION=10

# Installing nvm and nodejs
echo "Installing nvm..."
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile

# Set node version
echo "Using nodejs version: $NODE_VERSION"
nvm install $NODE_VERSION
nvm alias default $NODE_VERSION

# Install global packages
# npm install -g gulp

echo "Mounting virtual directories to avoid symlink error to /home/vagrant/"

# Migrate folders to home folder to avoid simlink errors
# declare -a folders=("node_modules" "data" "tmp")
declare -a folders=("node_modules" )

## now loop through the above array
for i in "${folders[@]}"
do
  # Remove folder if already present
  rm -rf /vagrant/$i
  mkdir /vagrant/$i
  if [ ! -d /home/vagrant/$i ]; then
    # Control will enter here if directory doesn't exists.
    mkdir /home/vagrant/$i
  fi
  echo "$i. Mounting $i virtual directory..."
  sudo mount --bind /home/vagrant/$i /vagrant/$i/
done


# echo "2. Mounting history virtual directory..."
# sudo mount --bind /home/vagrant/history /vagrant/history/

# Installing dependencies
cd /vagrant

## Install global packages
npm install -g ganache-cli

# npm install --only=production

echo "Provisioning finished"
