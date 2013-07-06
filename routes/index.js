/*jslint node: true*/
/*
 * GET home page.
 */

var app = null;

exports.setApp = function (application) {
	app = application;
}

exports.execIndex = function (req, res) {
    res.render('index', {
        title: 'RaspCam Pic',
        exports: {
            imagepath: app.get('imagepath')
        }
    });
};
