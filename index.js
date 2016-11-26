require('dotenv').load(); //set environment variables for development

var bot = require('./bot');
require('./web')(bot);