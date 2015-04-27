var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var tenant = require('./routes/tenants');
var scrum = require('./routes/scrum');
//app = connect();
//app.use(require('connect').bodyParser());

//app.use(express.bodyParser());

//app.use(app.routes);
app.get('/tenants/:id', tenant.findById);
app.post('/tenants', tenant.addTenant);
app.put('/scrum/:id/sprint', scrum.addSprint);
app.put('/scrum/:id/story', scrum.addStory);
app.put('/scrum/:id/story/id_story', scrum.updateStory);//// not working yet
app.get('/scrum/:id/sprint', scrum.getSprint);// not defined yet

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//app.use(app.routes);