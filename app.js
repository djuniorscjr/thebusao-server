const   express         = require('express'),
        methodOverride  = require('method-override'),
        cors            = require('cors'),
        config          = require('config'),
        bodyParser      = require('body-parser');
const   app             = express();

app.use(cors());
app.set('port', (process.env.PORT || config.get('server.port')));
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((request, response, next) => {
    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'});
        response.end('');
    } else {
        next();
    }
});

app.use('/', require('./routes'));

app.use((request, response, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, request, response, next) => {
    response.status(err.status || 500).json({ err : err.message });
});

module.exports = app;
