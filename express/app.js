var express = require('express');
var http = require('http');
var path = require('path');
var exphbs  = require('express3-handlebars');
var logger = require('morgan');
var couchUser = require('express-user-couchdb');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var config = {};

if ('development' === app.get('env')) {
    config = require("./configs/express/dev.json");
    app.use(logger('dev'));
}
else {
    config = require("./configs/express/prod.json");
    app.use(logger());
}

config.templateDir = path.join(__dirname, 'templates');

app.set('port', config.port || process.env.PORT || 4895);
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser()); // Required for session storage, must be called before session()
app.use(session({ secret: 'Printer, printer take a hint-ter.'}));

// /api/user/* is provided by the express-user-couchdb package
app.use(couchUser(config));

app.use(express.static(path.join(__dirname, 'public')));

// Most static content including root page
app.use(express.static(__dirname + '/public'));

// REST APIs
var api = require('./api')(config);
app.use('/api',api);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


