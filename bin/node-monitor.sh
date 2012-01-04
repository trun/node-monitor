#!/bin/bash

GIT_PROJECT=git://github.com/franklovecchio/node-monitor.git

case "$1" in
     'start')
		echo "Starting node-monitor"

        #cd ~/node-monitor/run
		#node client.js > /dev/null 2>&1 &
        #node client.js ec2=true debug=false console=false cloudwatch=true &

        start node-monitor
		
		;;
	'stop')
		echo "Stopping node-monitor"
		
		NODE_MONITOR=`ps -ef | grep -v grep | grep client.js | awk '{print $2'}`
		kill -9 $NODE_MONITOR
		for PID in `ps -ef | grep -v grep | grep "tail -F" | awk '{print $2}'`; do
        	echo "Killing: " + $PID
        	kill -9	$PID
		done
		
		;;
	'update')
		echo "Updating node-monitor"
		cd ~/
		cp ~/.node-monitor/* ~/node-monitor/plugins/
		rm -r ~/node-monitor
		git clone $GIT_PROJECT
        cp ~/node-monitor/plugins/*_config ~/.node-monitor/
        rm ~/.node-monitor/*
		cd ~/node-monitor/bin
		wget http://s3.amazonaws.com/ec2metadata/ec2-metadata
		chmod a+x ~/node-monitor/bin/ec2-metadata
		cd ~/node-monitor && npm link
		
		;;
	'install-debian')
	    yes | apt-get update 
	    apt-get -y install libssl-dev git-core scons pkg-config build-essential curl gcc g++ python3.2
		cd ~/
		mkdir ~/.node-monitor
		wget http://nodejs.org/dist/v0.6.6/node-v0.6.6.tar.gz && tar -xzf node-v0.6.6.tar.gz
		cd ~/node-v0.6.6
		./configure
		make
		make install
		export PATH=$PATH:/opt/node/bin
		curl http://npmjs.org/install.sh | sudo sh
		cd ~/
		add-apt-repository ppa:chris-lea/zeromq
		apt-get -y install libzmq-dev
		git clone $GIT_PROJECT
		cd ~/node-monitor/bin
		wget http://s3.amazonaws.com/ec2metadata/ec2-metadata
		chmod a+x ~/node-monitor/bin/ec2-metadata
		cd ~/node-monitor
		npm link

		;;
	'install-centos')
		yes | yum install gcc gcc-c++ autoconf automake openssl-devel nginx unzip gcc-c++ screen git-core monit
		cd /monitoring
		git clone https://github.com/joyent/node.git && cd /monitoring/node
		git checkout v0.4.8
		./configure
		make
		make install
		cd /monitoring
		sed -i "s/Defaults    secure_path = \/sbin:\/bin:\/usr\/sbin:\/usr\/bin/Defaults    secure_path = \/sbin:\/bin:\/usr\/sbin:\/usr\/bin:\/usr\/local\/bin/g" /etc/sudoers
		curl http://npmjs.org/install.sh | sudo sh
		npm install iconv forever ec2 knox
		
		;;
	'')
		echo "Usage: $0 [start|stop|update|install-debian|install-centos]"
		;;
	'?')
		echo "Usage: $0 [start|stop|update|install-debian|install-centos]"
		;;
esac
