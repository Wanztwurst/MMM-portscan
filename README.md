# MMM-portscan
MMM-portscan is a module for the smart mirror platform MagicMirror. It shows you whether specific ports on a set of hosts are open/closed. This way you can check your server status while brushing your teeth.

MagicMirror for RaspberryPi: https://github.com/MichMich/MagicMirror

![MMM-portscan](.github/screenshot.png)


## Installation

1. Install MagicMirror on your RaspberryPi (if not already installed)
2. Clone this repository in the modules folder of MagicMirror, most probably it will look like this: ~/MagicMirror/modules/MMM-portscan/
3. Add the module to the MM-config, most probably located here: ~/MagicMirror/config/config.js (example entry below)
4. Restart you MagicMirror software

#### Example entry for config.js
```javascript
{
    module: 'MMM-portscan',
    position: 'bottom_right',
    
    config: {
      updateInterval: 60,      // in seconds
      textalign: 'right',      // left, right, center
      color_open: '#00ff00',   // hex value or empty
      color_closed: '#ff0000', // hex value or empty

      hosts: [
        {
          hostname: '127.0.0.1',
          ports: [
            {port: 80, displayedName: 'http'},
            {port: 443, displayedName: 'https'},
            {port: 8080},
            {port: 42}
          ]
        },
        {
          hostname: 'github.com',
          displayedName: 'GitHub',
          ports: [
                {port: 80},
                {port: 443},
                {port: 22, displayedName: 'ssh'}
          ]
        }
    ]
    }
 }
 ```
 Each machine gets an object containing the hostname or ip and the ports to check.
 Don't forget the commas to separate entries.
 
 #### Possible values for config
 - updateInterval: in seconds
 - textalign: left, center, right
 - color_open: any hex value (e.g. #ff0000, #b3a2c1), color for open port numbers - leave empty for default color
 - color_closed: any hex value (e.g. #ff0000, #b3a2c1), color for closed port numbers - leave empty for default color
 - displayedName: hosts and ports can have a different name to display (instead of the hostname/ip)