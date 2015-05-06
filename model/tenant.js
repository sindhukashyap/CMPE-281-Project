var restful = require('node-restful');
var mongoose = restful.mongoose;
//schema
var tenantSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true , unique : true},
	password : { type: String, required: true },
	preference : { type: String, required: true }
});

module.exports = restful.model('multitenant', tenantSchema);
//mongoose.model('multitenant', tenantSchema);