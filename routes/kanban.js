var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var uri = "mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab";
var dbo;
var ejs = require("ejs");
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

function getInfo(req,res)
{
	var email=req.query.email;
	dbo.collection('multitenant', function(err, collection) 
		    {
				collection.findOne({"email":email}, function(err, result)
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
function getCard(req,res)
{
	var cardId=req.body.cardId;
	console.log(cardId+"cardId");
	//Query: db.multitenant.find({'kanban.cards.card_id':'Card_101_1'},{'kanban.cards.$.card_id':1});
	
	dbo.collection('multitenant', function(err, collection) {
			collection.findOne({'kanban.cards.card_id':cardId},{'kanban.cards.$.card_id':1},function(err, result)
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

function getCardsByQueue(req,res)
{
	var queue=req.body.queueName;
	console.log(queue+ " queue");
	
/**Query
 * db.multitenant.aggregate([{
  $match: {
    _id: '101'
  }
}, {
  $unwind: "$kanban.cards"
}, {
  $project: {
    card_name: "$kanban.cards.card_name",
    card_id: "$kanban.cards.card_id",
    queue_name: "$kanban.cards.queue_name",
    user: {
      firstname: "$kanban.cards.user.firstname",
      lastname: "$kanban.cards.user.lastname"
    }
  }
}, {
  $match: {
    queue_name: {
      $in: ["Planned"]
    }
  }
}])
 */
dbo.collection('multitenant', function(err, collection) {
	collection.aggregate([{
		$match: {
		    	_id: '101'
		    	}
		 }, 	{
			 	$unwind: "$kanban.cards"
		    	}, 
		    	{
		    	$project: {
		    		   	card_name: "$kanban.cards.card_name",
		    		    card_id: "$kanban.cards.card_id",
		    		    queue_name: "$kanban.cards.queue_name",
		    		    user: {
		    		      firstname: "$kanban.cards.user.firstname",
		    		      lastname: "$kanban.cards.user.lastname"
		    		    }
		    		  }
		    		}, {
		    	$match: {
		    		    queue_name: {
		    		    $in: [queue]
		    		    }
		    		  }
		    	}],
		    	function(err, result)
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

function updateCard(/*callback*/req,res)
{
	
	var card_id = new ObjectID(req.body.card_id);
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var card_name = req.body.cardname;
    var queueName = req.body.queueName;
    var id=new ObjectID(req.body.userId);
    console.log('Queue_name'+queueName); 
   
    //db.multitenant.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : "Planned"}})   
    //Updated Query: db.multitenant.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : "Planned","kanban.cards.$.card_name" : "NewCardName2","kanban.cards.$.user.firstname" : "Purvi","kanban.cards.$.user.lastname" : "Purvi"}})  
    //Updated 2: db.multitenant.update({"email": "tenant1@gmail.com"  ,"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : "Planned","kanban.cards.$.card_name" : "NewCardName3","kanban.cards.$.user.firstname" : "Purvi2","kanban.cards.$.user.lastname" : "Purvi"}})
    dbo.collection('multitenant', function(err, collection) {
        //collection.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : queueName}}, function(err, result) 
       collection.update({"_id": id,"kanban.cards.card_id" : card_id}, {"$set" : {"kanban.cards.$.queue_name" : queueName,"kanban.cards.$.card_name" : card_name,"kanban.cards.$.user.firstname" : firstName,"kanban.cards.$.user.lastname" : lastName}}, function(err, result)  
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

function getStatus(/*callback*/req,res)
{
	var id = new ObjectID(req.query.id);	
	var planned=0;
	var inProgress=0;
	var completed=0;
	dbo.collection('multitenant', function(err, collection) 
	{
		//db.multitenant.find({'kanban.cards.card_id' : 'Card_101_1'});
		collection.aggregate([
		{
			$match: {
					_id: id
					}},
		{
			$unwind: "$kanban.cards"
		}, 
		{
			$project: {
				card_name: "$kanban.cards.card_name",
				card_id: "$kanban.cards.card_id",
				queue_name: "$kanban.cards.queue_name" }
		}, 
		{ 
			$match: {
				queue_name : 'Completed'
		} }, 
		{ 
			$group: { _id: null,
				count: {$sum :1}
		}

} ], function(err, result)
	//collection.find( function(err, result)
	{
			if (err) {
				console.log('Error updating scrum ' + err);
				res.send({'error':'An error has occurred'});
				}
			else  {
					console.log('' + result + ' count');
					if(result.length>0)
						completed=result[0].count;
					collection.aggregate([
					{
						$match: {
							_id: id
							}},
					{
						$unwind: "$kanban.cards"
					}, 
					{
						$project: {
							card_name: "$kanban.cards.card_name",
							card_id: "$kanban.cards.card_id",
							queue_name: "$kanban.cards.queue_name" }
					},
					{ $match: {
						queue_name: 'Planned'
						} }, 
					{ $group: { _id: null,
						count: {$sum :1}
					}

} ], function(err, result)
      //collection.find( function(err, result)
    {
		if (err) 
        {
			console.log('Error updating scrum ' + err);
			res.send({'error':'An error has occurred'});
		}
		else 
		{
                console.log('' + result + ' count');
                if(result.length>0)
                	planned=result[0].count;
                collection.aggregate([{
                	$match: {
                		_id: id
                		}},{
                	$unwind: "$kanban.cards"
                		},{
                	$project: {
                		card_name: "$kanban.cards.card_name",
                		card_id: "$kanban.cards.card_id",
                		queue_name: "$kanban.cards.queue_name" }
                		},{
                	$match: {
                		queue_name: 'inProgress'
                	} }, { 
                	$group: { _id: null,
                	count: {$sum :1}}
        } ], function(err, result)
        //collection.find( function(err, result)	
        {
            if (err) 
            {
                console.log('Error updating scrum ' + err);
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('' + result + ' count');
                if(result.length>0)
                	inProgress=result[0].count;
                console.log("planned"+planned);
                total=planned+completed+inProgress;
                res.send({'planned':planned*100/total, 'inProgress':inProgress*100/total, 'completed': completed*100/total});

                //res.send({'plannedCards': planned,'inprogressCards': inProgress, 'completedCards': completed});
             }});
         }
    });

}

        });

    });
}

function createCard(req,res)
{
	var card_id = new ObjectID();
	var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var card_name = req.body.cardname;
    var queueName =req.body.queueName;
    var id= new ObjectID(req.body.userId);
    dbo.collection('multitenant', function(err, collection) {
    	var card = {
    			  "user": {
    			    "firstname": firstName,
    			    "lastname": lastName
    			  },
    			  "card_name": card_name,
    			  "card_id": card_id,
    			  "queue_name": queueName
    			};
    		/*Query: 	db.multitenant.update({
    			  "_id": "101"
    			}, {
    			  $push: {
    			    "kanban.cards": card
    			  }
    			}); */
    	
        collection.update({
			  "_id": id   
        	
		}, 
		{
		  $push:{
		    "kanban.cards": card
		  		}
		}, function(err, result) 
        {
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('Updated Successfully!');
                res.send({cardId :card_id});
            }
        });
    });
}

exports.getInfo=getInfo;
exports.getCard=getCard;
exports.getCardsByQueue=getCardsByQueue;
exports.getStatus=getStatus;
exports.updateCard=updateCard;
exports.createCard=createCard;
exports.getStatus=getStatus;