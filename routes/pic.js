/*jslint node: true, nomen: true*/

var fs = require('fs'),
    uploadDir = __dirname + '/../public/uploads/pic/',
    imgRex = /\.jpg$/;

function getFileList(cb) {
    fs.readdir(uploadDir, function (err, files) {
        if (err) {
            throw err;
        }

        cb(files.filter(function (f) {
            return imgRex.test(f);
        }).sort());
    });
}
function addNewPic(pic, cb) {
    fs.readFile(pic, function (er, data) {
        if (er) {
            throw er;
        }

        var newPath = uploadDir + Date.now() + '.jpg';
        fs.writeFile(newPath, data, function (err) {
            if (err) {
                throw err;
            }
            cb();
        });
    });
}

function getLastImagePath(cb) {
    getFileList(function (files) {
        cb(files.pop());
    });
}

function sendJSONResponse(res, content) {
    var output;
    if (typeof content !== 'string') {
        output = JSON.stringify(content);
    } else {
        output = content;
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(output, 'utf8'));
    res.end(output);
}

exports.PicRoute = require('./express_router').createRoute({
    initialize: function () {
        app = this.app;
        uploadDir = __dirname + '/../public' + app.get('imagepath');
    },

    execLastPic: function (req, res) {
        getLastImagePath(function (path) {
            sendJSONResponse(res, {file: path});
        });
    },

    execAddNewPic: function (req, res) {
        addNewPic(req.files.file.path, function () {
            sendJSONResponse(res, {success: true});
        });
    },

    execAllPics: function (req, res) {
        getFileList(function (files) {
            sendJSONResponse(res, {files: files});
        });
    }
});
