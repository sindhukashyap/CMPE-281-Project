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
function createTask(req,res){
	var task_id = new ObjectID();
    var task_desc  = req.body.taskdesc;
    var start_date = req.body.startdate;
    var duration = req.body.duration;
    var hoursCompleted= req.body.hours;
    var resource_name= req.body.resource;
    var risk_name= req.body.riskname;
    var id= new ObjectID(req.body.userId);
    console.log(task_desc);
    console.log(duration);
    dbo.collection('multitenant', function(err, collection) {
    	var doc = {
    			  "task_id"		: task_id,
    			  "task_desc" : task_desc,
               
                  "start_date" : start_date,
                  "duration" :duration ,
                  "hoursCompleted": hoursCompleted,
                  "resource" : {
                     "resource_name":resource_name
                  },
                  "risk_name": risk_name,
   };
 collection.update({
			  "_id": id}, {$push:{ "waterfall.tasks": doc}}, function(err, result) {
            if (err) 
            	res.send({'error':'An error has occurred'});
            else 
            	console.log('Added Successfully!');
                //res.jsonp(user1);
            res.send({TaskId :task_id});
			  });
       
    });
}

function updateTask(req,res){
	var taskid = new ObjectID(req.body.taskid);
	console.log(taskid);
    var task_desc  = req.param('taskdesc');
    var start_date = req.param('startdate');
    var duration = req.param('duration');
    var hoursCompleted=req.param('hours');
    var resource_name= req.param('resource');
    var risk_name=req.param('riskname');
    console.log(task_desc);
    console.log(start_date);
    console.log(duration);
    
    var id= new ObjectID(req.body.userId);
    dbo.collection('multitenant', function(err, collection) {
        collection.update({"waterfall.tasks.task_id" : taskid}, {"$set" : {"waterfall.tasks.$.task_desc": task_desc,"waterfall.tasks.$.start_date" : start_date,"waterfall.tasks.$.duration" : duration,"waterfall.tasks.$.hoursCompleted": hoursCompleted,"waterfall.tasks.$.resource.resource_name" : resource_name,"waterfall.tasks.$.risk_name": risk_name}}, function(err, result)  
        		{
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('Updated Successfully!');
                
                res.send({'success':'Successfully Updated'});
            }
        });
    });
		
}


function getTask(req,res){
	var taskID= req.param('taskid');
	
	//Querry: db.multitenant.find({'waterfall.tasks.task_id':'Task_102_1'},{'waterfall.tasks.$.task_id':1});

	dbo.collection('multitenant', function(err,collection){
		collection.findOne({'waterfall.tasks.task_id':'Task_102_1'},{'waterfall.tasks.$.task_id':1},function(err, result)
				{
            if (err) 
            {
                console.log('Error updating scrum ' + err);
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('' + result + ' Doc Fetched!');
                res.jsonp(result);
                
            }
	});
	});
}
    
    
function getStatus(req,res){
	var id= new ObjectID(req.query.userId);
	
	dbo.collection('multitenant', function(err,collection){
		collection.aggregate(
				  [{
					    $match: {
					      _id: id
					    }
					  }, {
					    $unwind: "$waterfall.tasks"
					  }, {
					    $group: {
					      _id: null,
					      count: {
					        $sum: 1
					      }
					    }
					  }]
,function(err, result)
				{
            if (err) 
            {
                console.log('Error updating scrum ' + err);
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('' + result + ' Doc Fetched!');
                var count=0,str; 
                if(result.length>0)
                	{
                	var count=result[0].count;
                	str='{"count":'+count+',';
                	}
                else
                	str='{"count":'+count;
                	
                
                
            		collection.findOne({"_id":id},function(err, result)
            				{
                        if (err) 
                        {
                            console.log('Error updating scrum ' + err);
                            res.send({'error':'An error has occurred'});
                        }
                        else 
                        {
                            console.log('' + result + ' Doc Fetched!');
                            
                          
                           // res.send({"TotalTasks":count});
                           for(var i=0;i<count;i++)
                        	{
                        	   var percent=result.waterfall.tasks[i].hoursCompleted;
                        	   var total= result.waterfall.tasks[i].duration;
                        	   
                        	   percent=percent*100/total;
                        	   if(percent!==null && !isNaN(percent)  )
                        		   {
                        		   console.log("Inside");
                        	   if(i===count-1) //make it 1 later
                        		   {
                        	   str+='"Task'+(i+1)+'":'+percent; 
                        		   }
                        	   else
                        		   {
                               str+='"Task'+(i+1)+'":'+percent+",";
                        		   }
                        		   }
                           }  
                           str+="}";
                           console.log(str);
                            res.send(JSON.parse(str));
                            
                        }
            	});
            	
               
                
            }
	});
	});
}

exports.createTask=createTask;
exports.updateTask=updateTask;
exports.getTask=getTask;
exports.getStatus=getStatus;
