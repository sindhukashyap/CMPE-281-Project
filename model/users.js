var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  name: String
});

mongoose.model('users', usersSchema);
/**
 * New node file
 */
