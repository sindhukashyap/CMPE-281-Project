var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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

exports.addSprint = function(req, res) {
	var id = new ObjectID();
    console.log('Updating preference: ' + id);
    console.log('Retrieving tenant: ' + id);
    //var sprint = {scrum : {sprints:[{sprint_id : 1, start_date : req.body.startDate,end_date : req.body.endDate
    	//}]}};
    dbo.collection('multitenant', function(err, collection) 
    {
    	console.log("description is : "+req.body.desc);
    	var doc =  {sprints:{sprint_id : 1, 
    		start_date : new Date(req.body.startDate),end_date : new Date(req.body.endDate), 
    		stories : [{story_name :req.body.storyName
    					,story_id : req.body.storyId
    					,start_date : new Date(req.body.startDate)
    					,description : req.body.description
    					,estimated_hours : req.body.estimatedHrs
    					,remaining_hours : req.body.remainingHrs
    					,resource_name : req.body.resourceName    					
    		}]}};
    	
    	collection.update({'_id':id},{$set:{"scrum":doc}},
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


exports.addStory = function(req, res) 
{
		var id = new ObjectID(req.params.id);
	    console.log('Retrieving tenant: ' + id);
	    
	    
	    dbo.collection('multitenant', function(err, collection) 
	    {
	    	var doc = {story_name :req.body.storyName
	    					,story_id : new ObjectID()
	    					,start_date : new Date(req.body.startDate)
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

exports.updateStory = function(req, res) {
	var id = new ObjectID(req.params.id);
    console.log('Retrieving tenant: ' + id);
    var story_name = req.body.storyName;
    var story_id = new ObjectID(req.params.id_story);
    var start_date = new Date(req.body.startDate);
    var description = req.body.description;
    var estimated_hours = req.body.estimatedHrs;
    var remaining_hours = req.body.remainingHrs;
	var resource_name = req.body.resourceName;    					
	dbo.collection('multitenant', function(err, collection) 
    	    {
		
						collection.update({"_id":id,"scrum.sprints.stories.story_id" : story_id},
    	    		   {"$set" : {"scrum.sprints.stories.$.story_name" : story_name,
    	    			   "scrum.sprints.stories.$.start_date" : start_date,
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


exports.updateStory = function(req, res) {
	var id = new ObjectID(req.params.id);
    console.log('Retrieving tenant: ' + id);
    var doc = {story_name :req.body.storyName
			,story_id : req.body.storyId
			,start_date : new Date(req.body.startDate)
			,description : req.body.description
			,estimated_hours : req.body.estimatedHrs
			,resource_name : req.body.resourceName    					
		};
    
    dbo.collection('multitenant', function(err, collection) 
    {
    	var story = {'story_id':req.params.id_story};
    	collection.update({'_id':id, },{$pull:{'scrum.sprints.stories' : story}},
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
                
            }
        });
    });
};

