/*jslint node: true*/
var fs = require('fs');

function Socket(io, app) {

    function watchDir(dir) {
        fs.watch(dir, function () {
            io.sockets.emit('imagechange');
        });
    }

    var file = __dirname + '/public/' + app.get('imagepath');
    fs.lstat(file, function (err, stats) {

        if (err) {
            throw err;
        }

        if (stats.isSymbolicLink()) {
            fs.readlink(file, function (err, file) {

                if (err) {
                    throw err;
                }

                watchDir(file);
            });

        } else {
            watchDir(file);
        }
    });
    io.sockets.on('connection', function (socket) {
        console.log('connected');
    });
}

exports.Socket = Socket;
