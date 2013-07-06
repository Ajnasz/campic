/*jslint node: true, nomen: true*/

var fs = require('fs'),
    uploadDir = __dirname + '/../public/uploads/';

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
    fs.readdir(uploadDir, function (err, files) {
        if (err) {
            throw err;
        }
        cb(files.sort().pop());
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

exports.lastPic = function (req, res) {
    getLastImagePath(function (path) {
        sendJSONResponse(res, {file: path});
    });
};

exports.addNewPic = function (req, res) {
    console.log(req);

    addNewPic(req.files.file.path, function () {
        sendJSONResponse(res, JSON.stringify({success: true}));
    });
};
