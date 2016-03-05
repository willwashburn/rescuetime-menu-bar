"use strict";

var AutoLaunch = require('auto-launch')
var menubar = require('menubar')
var parse = require('parse-seconds')

// The build process uses ./key, else get it from the env
var RescueTimeKey = require('./key').key || process.env.RESCUETIME_API_KEY

var Rescuetime = require('rescuetime.js').create(RescueTimeKey)

var appLauncher = new AutoLaunch({
    name: 'RescueTimeMenuBar'
});

appLauncher.isEnabled(function (enabled) {
    if (enabled) return;

    appLauncher.enable(function (err) {

    });

});

var mb = menubar(
    {
        "preload-window": false,
        width:            1,
        height:           1
    }
)

mb.on('ready', function ready() {

    // Calls the rescuetime API and updates the tray title
    updateTrayTitle();

    var interval = setInterval(function () {

        // We do this every few minutes so it's up to date
        updateTrayTitle();

    }, 60 *2 * 1000);

    mb.tray.setHighlightMode(false);

})


function updateTrayTitle() {

    console.log('Updating tray title with Rescuetime info');

    try {
        Rescuetime.totalProductiveTimeInSeconds()
            .then(function (seconds) {

                var time = parse(seconds);

                var title = '';

                if (time.hours != 0) {
                    title = time.hours.toString() + 'h ';
                }

                title = title + time.minutes.toString() + 'm'

                mb.tray.setTitle(title);
            });
    } catch (exception) {
        console.log(exception)
    }
}
