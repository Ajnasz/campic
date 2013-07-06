/*jslint node: true*/
/**
 * Module dependencies.
 */

var express = require('express'),
    IndexRoute = require('./routes').IndexRoute,
    PicRoute = require('./routes/pic').PicRoute,
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    IniReader = require('inireader').IniReader;
    

function startServer(conf) {
    var app = express();

    // all environments
    app.set('port', conf.server && conf.server.port || 3000);
    app.set('views', __dirname + '/views');
    app.engine('html', cons.underscore);
    app.set('view engine', 'html');

    // set environment
    app.set('imagepath', conf.uploads.imagepath);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.basicAuth(conf.user.name, conf.user.password));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }

    picRoute = new PicRoute(app);
    indexRoute = new IndexRoute(app);

    app.get('/', indexRoute.execIndex);
    app.get('/lastPic.json', picRoute.execLastPic);
    app.get('/allPics.json', picRoute.execAllPics);
    app.put('/pic', picRoute.execAddNewPic);

    var server = http.createServer(app);
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

var parser = new IniReader();
parser.on('fileParse', function () {
    var conf = this.param();
    startServer(conf);
    parser = null;
});
parser.load('conf.ini');

/* ex: set shiftwidth=4 tabstop=4 expandtab: */
