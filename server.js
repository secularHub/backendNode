var logger = require('morgan'),
    cors = require('cors'),
    http = require('http'),
    express = require('express'),
    errorhandler = require('errorhandler'),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser');

var app = express();

dotenv.load();


// Parsers//
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
var path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('static'))
app.use('/static', express.static('static'))
app.use(function(err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        next(err);
    }
});

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
    app.use(errorhandler())
}

app.use(require('./docs-routes'));
app.use(require('./anonymous-routes'));
app.use(require('./protected-routes'));
app.use(require('./user-routes'));

var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function(err) {
    console.log('listening in http://localhost:' + port);
});