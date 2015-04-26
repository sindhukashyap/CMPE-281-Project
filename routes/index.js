
function connectDB() {
	
	var mongoose = require('mongoose');
	var uriUtil = require('mongodb-uri');
	var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };
	var mongodbUri = 'mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab';
	var mongooseUri = uriUtil.formatMongoose(mongodbUri);
	mongoose.connect(mongooseUri, options);
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open',function()
			{
		
			});
//	var mongo = require('mongodb').MongoClient;
//	var uri = "mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab";
//	mongo.connect(uri, function(err,db)
//			{
//				if(err)
//				{
//					console.log("unable to connect");
//					return;
//				}
//				
//				console.log("Successfully connected to DB");
//			});
	
}

function getConn(callback)
{
	var connection=connectDB();
}