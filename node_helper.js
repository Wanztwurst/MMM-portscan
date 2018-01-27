/* Magic Mirror
 * Module: MMM-portscan
 * https://github.com/Wanztwurst/MMM-portscan
 * License: GPLv3
 */
var NodeHelper = require("node_helper");
var net = require("net");

var payload;

module.exports = NodeHelper.create({

    start: function () {
        console.log(this.name + ' helper started ...');
    },

    /**
     *
     * @param notification
     * @param payload :: array of {name: '123.123.123.123', ports: [{port: 80}, {port: 22}]}
     */
    socketNotificationReceived: function (notification, payload) {
        this.payload = payload;
        var self = this;

        if (notification === 'PORTSCAN_REQUEST') {
            this.processPayload(payload);

            // wait for async port checks, the return
            setTimeout(function() {
                self.sendSocketNotification('PORTSCAN_RESPONSE', self.payload);
            }, 1000);
        }
    },

    processPayload: function () {
        // start async scan for all hosts and ports
        for (var i = 0; i < this.payload.length; i++) {

            for (var j = 0; j < this.payload[i].ports.length; j++) {
                this.payload[i].ports[j].isOpen = this.scanHost(i, j);
            }
        }
    },

    /**
     *
     * @param host_i : int :: index of host in payload[host_i] to process
     * @param port_i : int :: index of port in payload[host_i].ports[port_i]
     * @returns boolean : true if open, false if closed or host not found
     */
    scanHost: function (host_i, port_i) {
        var host = this.payload[host_i].hostname;
        var port = this.payload[host_i].ports[port_i].port;
        var self = this;

        var timeout = 900;
        var connectionRefused = false;

        var socket = new net.Socket();
        var status = null;
        var error = null;

        // conntected = open
        socket.on('connect', function () {
            status = 'open';
            socket.destroy();
        });

        // no response, timeout = probably closed
        socket.setTimeout(timeout);
        socket.on('timeout', function () {
            status = 'timeout'; // = closed
            socket.destroy();
        });

        // some error = probably closed
        socket.on('error', function (exception) {
            if (exception.code !== 'ECONNREFUSED') {
                error = exception;
            } else {
                connectionRefused = true;
            }
            status = 'closed';
        });

        // done, check if successfull - write to corresponding payload entry
        socket.on('close', function (exception) {
            self.payload[host_i].ports[port_i].isOpen = status === 'open';
        });

        socket.connect(port, host);
    }
});
