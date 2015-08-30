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

app.get('/', function(req, res){
	 res.render('Login');
});

/** SignUp **/
app.post('/signUp',tenant.addTenant);

/**Login **/
app.post('/login', tenant.loginUser);
app.get('/register',tenant.register);
app.get('/Login',tenant.login);
app.get('/tenants/:email', tenant.findByEmail); 

/** Waterfall **/
app.get('/getTask', waterfall.getTask);
app.get('/getStatusWaterfall', waterfall.getStatus);
app.post('/createTask', waterfall.createTask);
app.post('/updateTask', waterfall.updateTask);

/** Kanban **/
app.get('/getCard', kanban.getCard); 
app.get('/getCardsByQueue', kanban.getCardsByQueue);
app.post('/updateCard',kanban.updateCard); 
app.get('/getInfo',kanban.getInfo);
app.get('/getStatus',kanban.getStatus);
app.post('/createCard',kanban.createCard); 

/** Scrum **/
app.post('/scrum/addsprint', scrum.addSprint);
app.post('/scrum/story', scrum.addStory);
app.get('/scrum/dates',scrum.checkDates);
app.put('/scrum/updateStory', scrum.updateStory);
app.get('/scrum/getStatus',scrum.getStatusScrum);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
