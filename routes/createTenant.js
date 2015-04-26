var express = require('express');
var router = express.Router();

// Models
var Tenant = require('../model/tenant');

//Routes
Tenant.methods(['get', 'put', 'post', 'delete']);
Tenant.register(router, '/tenants');

// Return router
module.exports = router;