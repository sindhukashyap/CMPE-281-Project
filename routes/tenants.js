var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var mongo = require('mongodb').MongoClient;
var uri = "mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab";
var dbo;
mongo.connect(uri, function (err, db) 
{
	  if (err) 
	  {
		  console.log('Unable to connect to the mongoDB server. Error:', err);
	  }
	  else 
	  {
		  dbo = db;
	  }
});

function getPreference(req)
{
	if(req.body.preference === "kanban")
		{
			return {name: req.body.username, email :req.body.email,password : req.body.password, 
	    		preference : req.body.preference, "kanban":{"cards":[] }};
		}
	else if(req.body.preference === "scrum")
		{
			return {name: req.body.username, email :req.body.email,password : req.body.password, 
    		preference : req.body.preference, "scrum":{} };
		}
	else if(req.body.preference === "waterfall")
		{
		return {name: req.body.username, email :req.body.email,password : req.body.password, 
    		preference : req.body.preference, "waterfall":{"tasks":[]}};
		}
}

exports.findByEmail = function(req, res) {
    var email = req.params.email;
    console.log('Retrieving tenant: ' + email);
    dbo.collection('multitenant', function(err, collection) {
        collection.findOne({'email':email}, function(err, item) {
        	console.log(item);
        	res.jsonp(item);
        });
    });
};


exports.register = function(req, res) {
	
	res.render('Register');

}

exports.login = function(req, res) {
	
	res.render('Login');

}

exports.addTenant = function(req, res) 
{
	//res.setHeader('Content-Type', 'application/json');
    
    var user1 = getPreference(req);
    
//    var user1= {name: req.body.name, email :req.body.email,password : req.body.password, 
//		preference : req.body.preference};
    dbo.collection('multitenant', function(err, collection) {
        collection.insert(user1, {safe:true}, function(err, result) 
        {
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log(user1);
                res.render('Login');
            }
        });
    });
}; 


function getUserPreference(res,result,email)
{
	if(result=== "kanban")
		{
			res.render('Kanban',{email:email});
		}
	else if(result === "scrum")
		{
			res.render('scrum',{email:email});
		}
	else if(result === "waterfall")
		{
			res.render('waterfall',{email:email});
		}
}
 
exports.loginUser = function(req, res) 
{
    var email = req.body.email;
    var password = req.body.password;
    dbo.collection('multitenant',function(err,collection){
    	collection.findOne({'email':email},{'preference':1},function(err, result){
    		if(err){
    			console.log("eroor");
    			res.send({'error':'An error has occurred'});
    		}
    		else {
    			console.log('' +result + "Running");
    			//console.log(result.preference);
    			if(result===null)
    				res.render('Login');
    			else 
    				getUserPreference(res,result.preference,req.body.email);
    		} 	
    });
    });
}; 
