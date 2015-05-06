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
var ejs = require('ejs');
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var tenant = require('./routes/tenants');
var scrum = require('./routes/scrum');
var kanban = require('./routes/kanban');
var waterfall = require('./routes/waterfall');
//app = connect();
//app.use(require('connect').bodyParser());

//app.use(express.bodyParser());

//app.use(app.routes);
app.get('/tenants/:email', tenant.findByEmail); // http://localhost:3000/tenants/103
app.post('/tenants', tenant.addTenant);
app.post('/scrum/addsprint', scrum.addSprint);
app.post('/scrum/story', scrum.addStory);
app.get('/scrum/dates',scrum.checkDates);
app.put('/scrum/updateStory', scrum.updateStory);
//app.get('/scrum/:id/sprint', scrum.getSprint);// not defined yet
app.get('/scrum/getStatus/:id',scrum.getStatusScrum);
//app.put('/scrum/:id/story/id_story', scrum.updateStory);//// not working yet
//app.get('/scrum/:id/sprint', scrum.getSprint);// not defined yet



/**Dhanu*****/
app.get('/', function(req, res){
	 res.render('Login');
}
);
app.get('/getCard', kanban.getCard); //Working
app.get('/getCardsByQueue', kanban.getCardsByQueue);

app.post('/logIn', tenant.loginUser);
app.post('/updateCard',kanban.updateCard); // Working
app.get('/getInfo',kanban.getInfo);
app.get('/getStatus',kanban.getStatus)
app.post('/createCard',kanban.createCard); // Working : also need tenantId in api
/************/


app.post('/signUp',tenant.addTenant);
app.post('/login',tenant.loginUser);
app.get('/	',tenant.register);


/***Waterfall***/
app.get('/getTask', waterfall.getTask);
app.get('/getStatusWaterfall', waterfall.getStatus);


app.post('/createTask', waterfall.createTask);
app.post('/updateTask', waterfall.updateTask);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//app.use(app.routes);