/* top.js */
/**
 * A plugin for monitoring everything.
 */
var fs = require('fs');

var Plugin = {
    name: 'top',
    command: '',
    type: 'poll'
};

this.name = Plugin.name;
this.type = Plugin.type;

Plugin.format = function (data, system) { 
	/* Operating system differentiation */
    switch (system) {
    case 'darwin':
        return Plugin.formatDarwin(data);
        break;
    case 'linux':
        return Plugin.formatLinux(data);
        break;
    default:
        self.logger.write(self.constants.levels.WARNING, 'Unaccounted for system');
        return undefined;
        break;
    }
};

Plugin.formatLinux = function (data) {
    var splitBuffer = [];
    splitBuffer = data.split('\n');

    var processes = {
        total: '',
        running: '',
        stuck: '',
        sleeping: '',
        threads: ''
    };

    var load = {
        one: '',
        five: '',
        fifteen: ''
    };

    var cpu = {
        user: '',
        sys: '',
        idle: ''
    };

    var libs = {
        resident: '',
        data: '',
        linkedit: ''
    };

    var regions = {
        total: '',
        resident: '',
        private: '',
        shared: ''
    };

    var mem = {
        wired: '',
        active: '',
        inactive: '',
        used: '',
        free: ''
    };

    var vm = {
        vsize: '',
        framework_vsize: '',
        pageins: '',
        pageouts: ''
    };

    var network = {
        packets: '',
        packets_in: '',
        packets_out: ''
    };

    var disks = {
        read: '',
        written: ''
    };

    for (i = 0; i < splitBuffer.length; i++) {
        var line = splitBuffer[i];
        var lineArray = line.split(/\s+/);

        var count = 0;
        switch (i) {
        case 0:
            lineArray.forEach(function (segment) {
                console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
                /*
                switch (count) {
                case 0:
                    break;
                case 1:
                    processes['total'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    processes['running'] = segment;
                    break;
                case 4:
                    break;
                case 5:
                    processes['stuck'] = segment;
                    break;
                case 6:
                    break;
                case 7:
                    processes['sleeping'] = segment;
                    break;
                case 8:
                    break;
                case 9:
                    processes['threads'] = segment;
                    break;
                }
                */
                count++;
            });
            break;
        case 2:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
            	switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    load['one'] = segment.replace(',', '');
                    break;
                case 3:
                    load['five'] = segment.replace(',', '');
                    break;
                case 4:
                    load['fifteen'] = segment.replace(',', '');
                    break;
                }
                */
                count++;
            });
            break;
        case 3:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    cpu['user'] = segment.replace('%', '');
                    break;
                case 3:
                    break;
                case 4:
                    cpu['sys'] = segment.replace('&', '');
                    break;
                case 5:
                    break;
                case 6:
                    cpu['idle'] = segment.replace('%', '');
                    break;
                }
                */
                count++;
            });
            break;
        case 4:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    libs['resident'] = segment.replace('M', '');
                    break;
                case 2:
                    break;
                case 3:
                    libs['data'] = segment.replace('B', '');
                    break;
                case 4:
                    break;
                case 5:
                    libs['linkedit'] = segment.replace('M', '');
                    break;
                }
                */
                count++;
            });
            break;
        case 5:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    regions['total'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    regions['resident'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    regions['private'] = segment.replace('M', '');
                    break;
                case 6:
                    break;
                case 7:
                    regions['shared'] = segment.replace('M', '');
                    break;
                }
                */
                count++;
            });
            break;
        case 6:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    mem['wired'] = segment.replace('M', '');
                    break;
                case 2:
                    break;
                case 3:
                    mem['active'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    mem['inactive'] = segment.replace('M', '');
                    break;
                case 6:
                    break;
                case 7:
                    mem['used'] = segment.replace('M', '');
                    break;
                case 8:
                    break;
                case 9:
                    mem['free'] = segment.replace('M', '');
                    break;
                }
                */
                count++;
            });
            break;
        case 7:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
            	switch (count) {
                case 0:
                    break;
                case 1:
                    vm['vsize'] = segment.replace('G', '');
                    break;
                case 2:
                    break;
                case 3:
                    vm['framework_vsize'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    vm['pageins'] = segment;
                    break;
                case 7:
                    break;
                case 8:
                    vm['pageouts'] = segment;
                    break;
                }
                */
                count++;
            });
            break;
        case 8:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    network['in'] = segment;
                    break;
                case 3:
                    break;
                case 4:
                    network['out'] = segment;
                    break;
                }
                */
                count++;
            });
            break;
        case 9:
            lineArray.forEach(function (segment) {
            	console.log('i: ' + i + ', segement: ' + segment + ', count: ' + count);
            	/*
                switch (count) {
                case 0:
                    break;
                case 1:
                    disks['read'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    disks['written'] = segment;
                    break;
                }
                */
                count++;
            });
            break;
        };
    }

    var data = {

    };

    data['processes'] = processes;
    data['load'] = load;
    data['cpu'] = cpu;
    data['libs'] = libs;
    data['regions'] = regions;
    data['mem'] = mem;
    data['vm'] = vm;
    data['network'] = network;
    data['disks'] = disks;

    return JSON.stringify(data);
};

Plugin.formatDarwin = function (data) {
    var splitBuffer = [];
    splitBuffer = data.split('\n');

    var processes = {
        total: '',
        running: '',
        stuck: '',
        sleeping: '',
        threads: ''
    };

    var load = {
        one: '',
        five: '',
        fifteen: ''
    };

    var cpu = {
        user: '',
        sys: '',
        idle: ''
    };

    var libs = {
        resident: '',
        data: '',
        linkedit: ''
    };

    var regions = {
        total: '',
        resident: '',
        private: '',
        shared: ''
    };

    var mem = {
        wired: '',
        active: '',
        inactive: '',
        used: '',
        free: ''
    };

    var vm = {
        vsize: '',
        framework_vsize: '',
        pageins: '',
        pageouts: ''
    };

    var network = {
        packets: '',
        packets_in: '',
        packets_out: ''
    };

    var disks = {
        read: '',
        written: ''
    };

    for (i = 0; i < splitBuffer.length; i++) {
        var line = splitBuffer[i];
        var lineArray = line.split(/\s+/);

        var count = 0;
        switch (i) {
        case 0:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    processes['total'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    processes['running'] = segment;
                    break;
                case 4:
                    break;
                case 5:
                    processes['stuck'] = segment;
                    break;
                case 6:
                    break;
                case 7:
                    processes['sleeping'] = segment;
                    break;
                case 8:
                    break;
                case 9:
                    processes['threads'] = segment;
                    break;
                }
                count++;
            });
            break;
        case 2:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    load['one'] = segment.replace(',', '');
                    break;
                case 3:
                    load['five'] = segment.replace(',', '');
                    break;
                case 4:
                    load['fifteen'] = segment.replace(',', '');
                    break;
                }
                count++;
            });
            break;
        case 3:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    cpu['user'] = segment.replace('%', '');
                    break;
                case 3:
                    break;
                case 4:
                    cpu['sys'] = segment.replace('&', '');
                    break;
                case 5:
                    break;
                case 6:
                    cpu['idle'] = segment.replace('%', '');
                    break;
                }
                count++;
            });
            break;
        case 4:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    libs['resident'] = segment.replace('M', '');
                    break;
                case 2:
                    break;
                case 3:
                    libs['data'] = segment.replace('B', '');
                    break;
                case 4:
                    break;
                case 5:
                    libs['linkedit'] = segment.replace('M', '');
                    break;
                }
                count++;
            });
            break;
        case 5:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    regions['total'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    regions['resident'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    regions['private'] = segment.replace('M', '');
                    break;
                case 6:
                    break;
                case 7:
                    regions['shared'] = segment.replace('M', '');
                    break;
                }
                count++;
            });
            break;
        case 6:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    mem['wired'] = segment.replace('M', '');
                    break;
                case 2:
                    break;
                case 3:
                    mem['active'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    mem['inactive'] = segment.replace('M', '');
                    break;
                case 6:
                    break;
                case 7:
                    mem['used'] = segment.replace('M', '');
                    break;
                case 8:
                    break;
                case 9:
                    mem['free'] = segment.replace('M', '');
                    break;
                }
                count++;
            });
            break;
        case 7:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    vm['vsize'] = segment.replace('G', '');
                    break;
                case 2:
                    break;
                case 3:
                    vm['framework_vsize'] = segment.replace('M', '');
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    vm['pageins'] = segment;
                    break;
                case 7:
                    break;
                case 8:
                    vm['pageouts'] = segment;
                    break;
                }
                count++;
            });
            break;
        case 8:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    network['in'] = segment;
                    break;
                case 3:
                    break;
                case 4:
                    network['out'] = segment;
                    break;
                }
                count++;
            });
            break;
        case 9:
            lineArray.forEach(function (segment) {
                switch (count) {
                case 0:
                    break;
                case 1:
                    disks['read'] = segment;
                    break;
                case 2:
                    break;
                case 3:
                    disks['written'] = segment;
                    break;
                }
                count++;
            });
            break;
        };
    }

    var data = {

    };

    data['processes'] = processes;
    data['load'] = load;
    data['cpu'] = cpu;
    data['libs'] = libs;
    data['regions'] = regions;
    data['mem'] = mem;
    data['vm'] = vm;
    data['network'] = network;
    data['disks'] = disks;

    return JSON.stringify(data);
};

this.poll = function (constants, utilities, logger, callback) {
    self = this;
    self.constants = constants;
    self.utilities = utilities;
    self.logger = logger;

    /* Operating system differentiation */
    var system = process.platform.toString();
    switch (system) {
    case 'darwin':
        Plugin.command = 'top -l 1';
        break;
    case 'linux':
        Plugin.command = 'top -b -n 1';
        break;
    default:
        self.logger.write(self.constants.levels.WARNING, 'Unaccounted for system');
        break;
    }

    var exec = require('child_process').exec,
        child;
    child = exec(Plugin.command, function (error, stdout, stderr) {
    	var data = Plugin.format(stdout.toString(), system);
        self.logger.write(self.constants.levels.INFO, 'Top returned: ' + data);
     
        callback(Plugin.name, 'Top-TotalProcesses', 'Count', JSON.parse(data)['processes']['total'], data);
        callback(Plugin.name, 'Top-RunningProcesses', 'Count', JSON.parse(data)['processes']['running'], data);
        callback(Plugin.name, 'Top-StuckProcesses', 'Count', JSON.parse(data)['processes']['stuck'], data);
        callback(Plugin.name, 'Top-CPU', 'Percent', JSON.parse(data)['cpu']['user'], data);
        callback(Plugin.name, 'Top-FreeMemory', 'Megabytes', JSON.parse(data)['mem']['free'], data);
    });
};