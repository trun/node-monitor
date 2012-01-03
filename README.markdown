# node-monitor
=====

This is an EC2 monitoring application using node.js and the Amazon CloudWatch API.

### Prerequisites
	
Set ulimits HIGH (4000 at least)

### Setup

Clone the repository.

    cd ~/
    git clone git://github.com/franklovecchio/node-monitor.git
    
Copy the script out of the the directory into a usable location.   
    
    cp ~/node-monitor/bin/node-monitor.sh ~/node-monitor.sh
    chmod a+x ~/node-monitor.sh
    
To install all the necessary packages (including node.js and npm):
    
	sudo ~/node-monitor.sh install-debian-with-deps # Debian
	sudo ~/node.monitor.sh install-centos-with-deps # CentOS
	
To do a light install:
 
    sudo ~/node-monitor.sh install-debian # Debian
	sudo ~/node.monitor.sh install-centos # CentOS

Start the monitor in production mode:
	
	sudo ~/node-monitor.sh start
	
### Plugins

* df.sh 

To monitor disk size, you need to specify disks in the `df_config` file:

     /dev/disk0s2
     /dev/sdb

* filesize.js

 To monitor file sizes (like logs), and empty when they hit a maximum, you need to specify files and their max size (in KB) in the `filesize_config` file:
 
     /Users/franklovecchio/Documents/my.log=1024

* free.js

* health.js

* lsof.js

* services.js

To monitor running services, you can specify a service name only for a `ps -ef` command, or a service name and a port for an `lsof` command:

    cassandra
    redis=6379

* top.js

* uptime.js

* who.js


There are 2 types of plugins, `poll` and `step`.  Plugins are modules which have access to a global set of passed modules, and return asynchronously CloudWatch data.  A plugin might look like:

     /* lsof.js */

     /**
      * A plugin for monitoring open files.
      */
     var fs = require('fs');

     var Plugin = {
       name: 'lsof',
       command: 'lsof | wc -l',
       type: 'poll'
     };

     this.name = Plugin.name;
     this.type = Plugin.type;

     Plugin.format = function (data) {
       data = data.replace(/^(\s*)((\S+\s*?)*)(\s*)$/, '$2');
       data = data.replace('%', '');
       return data;
     };

     this.poll = function (constants, utilities, logger, callback) {
       self = this;
       self.constants = constants;
       self.utilities = utilities;
       self.logger = logger;

       var exec = require('child_process').exec, child;
       child = exec(Plugin.command, function (error, stdout, stderr) {
         callback(Plugin.name, 'OpenFiles', 'Count', Plugin.format(stdout.toString()), Plugin.format(stdout.toString()));
       });
     };


### Coding on the Shoulders of Giants

[NodeMonitor](https://github.com/meltingice/NodeMonitor)

[Node-Activity-Monitor-Without-A-Websocket](https://github.com/robrighter/Node-Activity-Monitor-Without-A-Websocket)

[node-monitor](https://github.com/lorenwest/node-monitor)

[node-websocket-activity-monitor](https://github.com/makoto/node-websocket-activity-monitor)

[keep-a-nodejs-server-up-with-forever](http://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever)

[taking-baby-steps-with-node-js-some-node-js-goodies](http://elegantcode.com/2011/04/12/taking-baby-steps-with-node-js-some-node-js-goodies/)

[1420-node-js-calculating-total-filesize-of-3-files](http://refactormycode.com/codes/1420-node-js-calculating-total-filesize-of-3-files)

[get-program-execution-time-in-the-shell](http://stackoverflow.com/questions/385408/get-program-execution-time-in-the-shell)

[nodejs-too-many-open-files.html](http://www.neeraj.name/2010/03/30/nodejs-too-many-open-files.html)

[node-js-return-result-of-file](http://stackoverflow.com/questions/3877915/node-js-return-result-of-file)

[things-i-learned-from-my-node.js-experiment](http://jeffkreeftmeijer.com/2010/things-i-learned-from-my-node.js-experiment)

[long-polling-example-with-nodejs](http://www.contentwithstyle.co.uk/content/long-polling-example-with-nodejs)

[log-collection-server-with-node-js](http://lethain.com/log-collection-server-with-node-js)

[experimenting-with-node-js](http://jeffkreeftmeijer.com/2010/experimenting-with-node-js)

[nodejs-events-and-recursion-readdir](http://utahjs.com/2010/09/16/nodejs-events-and-recursion-readdir/)