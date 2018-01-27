/* Magic Mirror
 * Module: MMM-portscan
 * https://github.com/Wanztwurst/MMM-portscan
 * License: GPLv3
 */
Module.register('MMM-portscan', {
    defaults: {
        updateInterval: 10, // in seconds
        textalign: 'left',
        color_open: '#00ff00',
        color_closed: '#ff0000',

        hosts: [
            {
                hostname: '127.0.0.1',
                ports: [
                    {port: 80, displayedName: 'http'},
                    {port: 42}
                ]
            },
            {
                hostname: 'github.com',
                displayedName: 'GitHub',
                ports: [
                    {port: 80},
                    {port: 22, displayedName: 'ssh'}
                ]
            }
        ]
    },

    payload: {},

    start: function () {
        // Log.info('Starting module: ' + this.name);
        Log.info(this.config);
        this.payload = this.config.hosts;

        this.update();
        setInterval(
            this.update.bind(this),
            this.config.updateInterval * 1000
        );
    },

    update: function () {
        this.sendSocketNotification('PORTSCAN_REQUEST', this.payload);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'PORTSCAN_RESPONSE') {
            //Log.info(payload);

            if (payload) {
                this.payload = payload;
                this.updateDom();
            }
        }
    },

    getStyles: function() {
        return ["portscan.css"];
    },

    getDom: function () {
        var self = this;
        var wrapper = document.createElement("div");

        this.payload.forEach(function(host) {
            var hostDiv = document.createElement("div");
            //console.log(self.config);
            hostDiv.style.textAlign = self.config.textalign;

            // name
            var nameDiv = document.createElement("div");
            nameDiv.innerHTML = host.displayedName !== undefined ? host.displayedName : host.hostname;;
            nameDiv.className = "bright";
            hostDiv.appendChild(nameDiv);

            // ports
            host.ports.forEach(function(port) {
                var portDiv = document.createElement("div");
                var classes = "small ";

                if(port.isOpen === false) {
                    classes += "port-closed";
                    portDiv.style.color = self.config.color_closed;
                } else if(port.isOpen === true) {
                    classes += "port-open";
                    portDiv.style.color = self.config.color_open;
                }

                portDiv.className = classes;

                portDiv.innerHTML = port.displayedName !== undefined ? port.displayedName : port.port;
                hostDiv.appendChild(portDiv);
            });

            // add host to wrapping container
            wrapper.appendChild(hostDiv);
        });

        return wrapper;
    }
});
