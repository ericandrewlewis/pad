
# Install nodejs
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y nodejs mongodb-org
sudo service mongod start
