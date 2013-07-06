/*jslint node: true*/
/*
 * GET home page.
 */

exports.IndexRoute = require('./express_router').createRoute({
	execIndex: function (req, res) {
        app = this.app;
	    res.render('index', {
		title: 'RaspCam Pic',
		exports: {
		    imagepath: app.get('imagepath')
		}
	    });
	}
});
