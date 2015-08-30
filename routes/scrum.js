var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var uri = "mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab";
var dbo;
var format = require('util').format;
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

exports.addSprint = function(req, res) 
{
	
	var email = req.body.email;
    
    //var sprint = {scrum : {sprints:[{sprint_id : 1, start_date : req.body.startDate,end_date : req.body.endDate
    	//}]}};
    dbo.collection('multitenant', function(err, collection) 
    {
    	console.log("description is : "+req.body.description);
    	var doc =  {sprints:{sprint_id : 1, 
    		start_date : new Date(req.body.startDate),end_date : new Date(req.body.endDate), 
    		stories : [{story_name :req.body.storyName
    					,story_id :  new ObjectID()
    					,description : req.body.description
    					,estimated_hours : req.body.estimatedHrs
    					,remaining_hours : req.body.remainingHrs
    					,resource_name : req.body.resourceName    					
    		}]}};
    	
    	collection.update({'email':email},{$set:{"scrum":doc}},
    		{upsert:false,multi:false}, function(err, result)
    	{
            if (err) 
            {
                console.log('Error updating scrum ' + err);
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('' + result + ' document(s) updated');
                
                	        collection.findOne({'email':email}, function(err, item) {
                	        	console.log(item);
                	        	res.jsonp(item);
                	        });
            }
        });
    });
};


exports.addStory = function(req, res) 
{
		var id = new ObjectID(req.body.id);
	    console.log('Retrieving tenant: ' + id);
	    dbo.collection('multitenant', function(err, collection) 
	    {
	    	var doc = {story_name :req.body.storyName
	    					,story_id : new ObjectID()
	    					,description : req.body.description
	    					,estimated_hours : req.body.estimatedHrs
	    					,remaining_hours : req.body.remainingHrs
	    					,resource_name : req.body.resourceName    					
	    				};
	    	collection.update({'_id':id},{$push:{'scrum.sprints.stories' : doc}},
	    		{upsert:false,multi:false}, function(err, result)
	    	{
	            if (err) 
	            {
	                console.log('Error updating scrum ' + err);
	                res.send({'error':'An error has occurred'});
	            }
	            else 
	            {
	                console.log('' + result + ' document(s) updated');
	                res.jsonp(doc);
	            }
	        });
	    });
};

exports.updateStory = function(req, res) 
{
	var id = new ObjectID(req.body.id);
    console.log('Retrieving tenant: ' + id);
    var story_name = req.body.storyName;
    var story_id = new ObjectID(req.body.id_story);
    var description = req.body.description;
    var estimated_hours = req.body.estimatedHrs;
    var remaining_hours = req.body.remainingHrs;
	var resource_name = req.body.resourceName;    					
	dbo.collection('multitenant', function(err, collection) 
	{
		
		collection.update({"_id":id,"scrum.sprints.stories.story_id" : story_id},
    	  {"$set" : {"scrum.sprints.stories.$.story_name" : story_name,
    	    		"scrum.sprints.stories.$.description" : description,
    	    		"scrum.sprints.stories.$.estimated_hours" : estimated_hours,
    	    		"scrum.sprints.stories.$.remaining_hours" : remaining_hours,
    	    		"scrum.sprints.stories.$.resource_name" : resource_name
    	    		   }}, function(err, result)  
    	        		{
    	    			   if (err) 
    	    			   {
    	    				   console.log('Error updating scrum ' + err);
    	    				   res.send({'error':'An error has occurred'});
    	    			   }
    	    			   else 
    	    			   {
    	    				   res.send({'Success':'Successfully updated'});
    	                //res.jsonp(user1);
    	    			   }
    	        		});
    	    });
	
};


exports.checkDates = function(req, res) 
{
	
	var email = req.query.email;
    dbo.collection('multitenant', function(err, collection) 
    {	
    	 collection.find({'email' : email, 'scrum.sprints.start_date':{$exists:true}, 
    		 'scrum.sprints.end_date':{$exists:true}}).toArray(function(err, result)
	    	{
    		 if(result.length > 0)
    			{
    			 		console.log(result);
    			 		console.log("You have start and end dates for sprint");
    			 		collection.findOne({'email':email}, function(err, item) 
    		    				{
    		    		        	console.log(item);
    		    		        	res.jsonp(item);
    		    		        
    		    				});
    			}
    			else
    			{
    				 res.send({'msg':'You DO NOT have start and end dates for sprint'});
    				console.log("You DO NOT have start and end dates for sprint");
    			}
    });
    
    
});
};
exports.getStatusScrum = function(req, res) 
{
	var id = new ObjectID(req.query.id);
	//var id = new ObjectID(req.params.id);
	//db.multitenant.find({_id: ObjectId("5543f652a23963f82b74a321"),"scrum.sprints.sprint_id" :1},{"scrum.sprints.stories":1,_id:0})
	var JSONObj = {};
	var remHrssum = 0;
	var totalHrsSum = 0;
	dbo.collection('multitenant', function(err, collection) 
	{
		//get remaining hours for that sprint
		collection.aggregate({'$match': {"scrum.sprints.sprint_id" :1,"_id":id}},{'$unwind' : "$scrum.sprints.stories"},
							{'$project': { _id:0,"Remaining_hrs" : "$scrum.sprints.stories.remaining_hours",
								"total_hrs" : "$scrum.sprints.stories.estimated_hours"}},
							function (err, result)
							{
								console.log("Result : "+ result);
								
								for(var i=0;i<result.length;i++)
								{
									remHrssum = remHrssum + Number(result[i].Remaining_hrs);
									totalHrsSum = totalHrsSum + Number(result[i].total_hrs);
								}
								
								console.log(" SUM: "+ remHrssum);
								JSONObj.remaining_hrs = remHrssum;
								JSONObj.totalHours = totalHrsSum;
								console.log(JSONObj.remaining_hrs);
								console.log(JSONObj.totalHours);
								//res.jsonp(result);
							});
		
		//get start and end dates for sprint
		collection.find({'_id' : id},{"scrum.sprints.start_date":1,"scrum.sprints.end_date":1,_id:0})
		.toArray(function(err, doc)
		{
			if(doc.length > 0)
			{
				//console.log( doc[0].scrum.sprints.start_date);
				//res.jsonp(doc);
				var start_date = doc[0].scrum.sprints.start_date;
				var end_date = doc[0].scrum.sprints.end_date;
				JSONObj.start_date = formatDate(start_date);
				JSONObj.end_date = formatDate(end_date);
				var cur_date = new Date();
				JSONObj.cur_date =  cur_date.getMonth()+1+'/'+cur_date.getDate()+'/'+cur_date.getFullYear();
				console.log("JSON :"+JSONObj);
				res.send(JSONObj);
				//res.end(JSON.stringify(JSONObj));
				//res.jsonp(JSONObj);
			}
			else
			{
				res.jsonp({'msg':'please create a sprint first!'});
			}
		});
		 
});
	
};

function formatDate(date)
{
	var newDate = new Date(date);
	console.log(newDate);
	return newDate.getMonth()+1+'/'+newDate.getDate()+'/'+newDate.getFullYear();
}
