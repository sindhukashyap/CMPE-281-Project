

# Basic
This application was built as part of the term project by a group of 5 for the course - CMPE 281 Cloud Technologies at San Jose State Univerity.

This is a prototype Multitenant SaaS Web Application that can be used by project management groups to manage and track their projects. The features of this application are described below:

## Usage
1. Sign up for the application by selecting one of the three methodlogies - Scrum, Kanban or Watrefall. Projects can be managed using  one of these three methodologies.
2. Kanban features : 
	1. Add a new card, assign it to a new memeber, assign it to one of the 3 queues - planned, in progress, 
	2. Move tasks to other queues
	3. Assign tasks to other members of the team
	4. View Graphs that shows the status of each task
3. Scrum features:
	1. Add a new sprint.
	2. Add a new story to a sprint, set the start and end date, estimated hours for each task, remaining hours for each task, assign it to a resource.
	3. Edit the story.
	4. View Graphs that shows the burndown chart for the sprint.
4. Waterfall features : 
	1. Add a new task, description for it, assign it to a resource, add end and start dates, duration, risks.
	2. Edit the tasks.
	3. View Graphs that shows the status of each task


## Developing
1. Technologies used: 
	1. Front end : HTML, Javascript, jQuery
	2. Backend : MongoDB to store user and related data
	3. Entire server side code is written in Node.js with Express. 
	4. REST APIs are written in Node.js to store and fetch details for the user
2. The application was deployed on an AWS EC2 ubuntu instance


### Tools
1. Eclipse Enide for express and node.js
2. RoboMongo and MongoLab to host the daabse
3. Postman REST Client for testing the REST APIs

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.

##To Run
1. Install npm, express, node
2. command to run the application : node app.js

