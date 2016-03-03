"use strict";
require('dotenv').config();

var menubar = require('menubar')
var Rescuetime = require('rescuetime.js').create(process.env.RESCUETIME_API_KEY)
var parse = require('parse-seconds')


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

        // We do this every minute so it's up to date
        updateTrayTitle();

    }, 60000);

    mb.tray.setHighlightMode(false);

})


function updateTrayTitle() {

    console.log('Updating tray title with rescuetime info');

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
