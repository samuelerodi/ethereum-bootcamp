#!/usr/bin/env bash
cd /vagrant

# Migrate folders to home folder to avoid simlink errors
declare -a folders=("node_modules" )

## now loop through the above array
for i in "${folders[@]}"
do
  if [ ! -d /home/vagrant/$i ]; then
    # Control will enter here if directory doesn't exists.
    echo "WARNING: $i not found. Creating directory..."
    mkdir /home/vagrant/$i
  fi
  echo "$i. Mounting $i virtual directory..."
  sudo mount --bind /home/vagrant/$i /vagrant/$i/
done

# Prepare node_modules directory
# if [ ! -d /vagrant/node_modules ]; then
#   # Control will enter here if $DIRECTORY doesn't exists.
#   echo "WARNING: node_modules not found. Creating directory..."
#   mkdir /vagrant/node_modules
# fi
# if [ ! -d /home/vagrant/node_modules ]; then
#   # Control will enter here if $DIRECTORY doesn't exists.
#   echo "WARNING: node_modules not found. You might need to run npm i"
#   mkdir /home/vagrant/node_modules
# fi

# ganache-cli  -m "replace submit lizard brother mesh olive rubber kite call wonder myself witness"  --host=0.0.0.0

echo "Server started. Log in under /vagrant directory and run"
