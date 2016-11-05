var express = require('express'),
    app = express(),
    path = require('path'),
    Twig = require('twig'),
    twig = Twig.twig,
    slug = require('slug'),

    conf = require('../config'),

    allwaysJson = function(request, response, next) {
        response.header('Content-Type', 'application/json; charset=utf-8');
        next();
    };

String.prototype.toUpperCamelCase = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toUpperCase(); });
};

app.configure(function() {
    app.use('/assets', express.static(path.join(__dirname, '../app/assets')));
    app.use('/exports', allwaysJson);
    app.use('/exports', express.urlencoded());
    app.use('/exports', express.json());
});

app.set('port', conf.serverPort);

app.get('/', function(request, response) {
    response.sendfile(path.join(__dirname, '../app/app.html'));
});

app.post('/exports', function(request, response) {
    var type = request.body.type || null,
        filename = request.body.filename || 'export',
        template = request.body.template || null,
        data = request.body.data || null;

    if( type === null || template === null || data === null ) {
        response.status(400)
            .end(null, 'utf8');
    }

    var twigTpl = twig({ data: template }),
        finalResult = '';

    if( type === 'figure' )
        data = [data];
    else if( type === 'group' )
        data = data.figures;
    else
        data = data.figures;

    data.forEach(function(figure) {
        finalResult += twigTpl.render({
            camelCaseTitle: slug(figure.title, ' ').toUpperCamelCase(),
            slug: slug(figure.title, {lower: true}),
            dots: figure.dots
        });
    });

    response.writeHead(200, {
        'Content-Type': 'text/x-c',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename='+filename+'.cpp'
    });

    response.end(finalResult, 'utf8');
});

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('El servidor está corriendo en localhost:'+port+'; no puedes seguir usando esta instancia del shell, debes abrir otra...');
});