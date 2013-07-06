/*jslint node: true*/
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    pic = require('./routes/pic'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', cons.underscore);
app.set('view engine', 'html');

// set environment
app.set('imagepath', '/uploads/pic/');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

pic.setApp(app);
routes.setApp(app);

app.get('/', routes.execIndex);
app.get('/lastPic.json', pic.execLastPic);
app.get('/allPics.json', pic.execAllPics);
app.put('/pic', pic.execAddNewPic);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
