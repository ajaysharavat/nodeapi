// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var util       = require('util');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3009;        // set our port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/data'); // connect to our database


var Trai     = require('./app/Models/trai');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


router.route('/trai')
    .get(function(req, res) {
		
		//var query  = req.body.query;
		var query  = req.query.query;
		console.log(query);
        var numbers = [];
		if(util.isString(query)) {
			    query = query.replace(/\s/g,",");
			     var tmparr = query.split(",").map(function (val) {
				  numbers.push(Number(val));
				});
				
		} 
      console.log(numbers);
		
		
		
        Trai.find({ 'Ph': { $in: numbers }}, function(err, trai) {
            if (err) {
                res.send(err);
			} else {
			
 var dnd = [];
			   var nondnd = [];
               trai.forEach(function(data){
			  if(data.OT=='A') {
				  dnd.push(Number(data["Ph"]));
			  } else if(data.OT=='D'){
				  nondnd.push(Number(data["Ph"]));
			  } else {
				  nondnd.push(Number(data["Ph"]));
			  }
				   
			   });
			   var filterdata = {dnd:dnd,nondnd:nondnd};
			   
			   res.status(200).json(filterdata);			
				
           // res.json(trai);
			}
    });
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
