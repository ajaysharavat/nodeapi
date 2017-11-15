// trai data API
router.post('/checkdata/:conn/:db/:coll/', function (req, res, next) {
    var mongojs = require('mongojs');
    var connection_list = req.nconf.connections.get('connections');
    var mongodb = require('mongodb').MongoClient;
    var ejson = require('mongodb-extended-json');
    var docs_per_page = req.nconf.app.get('app:docs_per_page') != undefined ? req.nconf.app.get('app:docs_per_page') : 50;
   
    // Check for existance of connection
    if(connection_list[req.params.conn] == undefined){
        res.writeHead(500, { 'Content-Type': 'application/text' });
        res.end('Invalid connection name');
    }

    // Validate database name
    if (req.params.db.indexOf(" ") > -1){
        res.writeHead(500, { 'Content-Type': 'application/text' });
        res.end('Invalid database name');
    }

    mongodb.connect(connection_list[req.params.conn].connection_string, function (err, mongo_db) {
        if (err) {
            res.status(500).json(err);
        }

        var db = mongojs(mongo_db.db(req.params.db));
		var query  = req.body.query;
	//	console.log(query);
        var numbers = [];
		if(util.isString(query)) {
			    query = query.replace(/\s/g,",");
			     var tmparr = query.split(",").map(function (val) {
				  numbers.push(Number(val));
				});
				
		} 
      // console.log(numbers);
       
        db.collection(req.params.coll).find({"Ph":{$in:numbers}}, function (err, result) {
            if (err) {
                res.status(500).json(err);
            }else{
               //console.log(result); 
               var dnd = [];
			   var nondnd = [];
               result.forEach(function(data){
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
               
            }            
        });
    });
});

// TrueCaller Verification API php code in /var/www/html/truecaller/fetchfrommongodb
router.get('/truecaller/:conn/:db/:coll/:skip', function (req, res, next) {
	console.log('whatsapp verify');
	var connection = 'Local';
    var mongojs = require('mongojs');
    var connection_list = req.nconf.connections.get('connections');
    var mongodb = require('mongodb').MongoClient;
	var database = 'data';
	var collection = 'trai';
	var skip = parseInt(req.params.skip);
    var ejson = require('mongodb-extended-json');
    var docs_per_page = req.nconf.app.get('app:docs_per_page') != undefined ? req.nconf.app.get('app:docs_per_page') : 50;
   
    
   console.log(skip);
    

    mongodb.connect(connection_list[connection].connection_string, function (err, mongo_db) {
        if (err) {
           // res.status(500).json(err);
        }

        var db = mongojs(mongo_db.db(database));
		var query  = req.body.query;
	//	console.log(query);
        var numbers = '"';
	 
      // console.log(numbers);
       
        db.collection(collection).find({ "W": { $exists: true },"S":"Uttarakhand" }).skip(skip).limit(1000, function (err, result) {
            if (err) {
                res.status(500).json(err);
            }else{
               //console.log(result); 
               var numbers = '';
			 
                result.forEach(function(data){
			  
				numbers += "91"+Number(data["Ph"])+',';
			  
				   
			   });
			  var newStr = numbers.substring(0, numbers.length-1); 
			   	//numbers += '"';		   
			   res.status(200).json(newStr);
               
            }            
        });
    });
});


// trai data Whatsapp Verification API
router.get('/verifydata/:conn/:db/:coll/', function (req, res, next) {
	console.log('whatsapp verify');
	var connection = 'Local';
    var mongojs = require('mongojs');
    var connection_list = req.nconf.connections.get('connections');
    var mongodb = require('mongodb').MongoClient;
	var database = 'data';
	var collection = 'trai';
    var ejson = require('mongodb-extended-json');
    var docs_per_page = req.nconf.app.get('app:docs_per_page') != undefined ? req.nconf.app.get('app:docs_per_page') : 50;
   
    
   console.log(connection_list);
    

    mongodb.connect(connection_list[connection].connection_string, function (err, mongo_db) {
        if (err) {
           // res.status(500).json(err);
        }

        var db = mongojs(mongo_db.db(database));
		var query  = req.body.query;
	//	console.log(query);
        var numbers = '"';
	 
      // console.log(numbers);
       
        db.collection(collection).find({ "W": { $exists: false },"S":"Uttarakhand" }).limit(1000, function (err, result) {
            if (err) {
                res.status(500).json(err);
            }else{
               //console.log(result); 
               var numbers = '';
			 
                result.forEach(function(data){
			  
				numbers += "91"+Number(data["Ph"])+',';
			  
				   
			   });
			  var newStr = numbers.substring(0, numbers.length-1); 
			   	//numbers += '"';		   
			   res.status(200).json(newStr);
               
            }            
        });
    });
});


// trai data update Whatsapp Verification API
router.post('/updatedata/:conn/:db/:coll/:valid', function (req, res, next) {
	console.log('whatsapp update');
	var connection = 'Local';
    var mongojs = require('mongojs');
    var connection_list = req.nconf.connections.get('connections');
    var mongodb = require('mongodb').MongoClient;
	var database = 'data';
	var collection = 'trai';
    var ejson = require('mongodb-extended-json');
    var docs_per_page = req.nconf.app.get('app:docs_per_page') != undefined ? req.nconf.app.get('app:docs_per_page') : 50;
   
    
  
    mongodb.connect(connection_list[connection].connection_string, function (err, mongo_db) {
        if (err) {
            res.status(500).json(err);
        }

        var db = mongojs(mongo_db.db(database));
		//console.log(req);

            try {
				var postData='';

  req.on('data', function(chunk) { 
    postData += chunk;
  });

  req.on('end', function() {
    req.rawBody = postData;
    console.log('ended buffering. result: ' + req.rawBody);
			var data = postData.substr(1).slice(0, -1);
		//console.log(data);
		var numbers = data.split(',');
		
    //console.log(numbers);
	//var mobile = [];
	//console.log(req.params.valid);
	numbers.forEach(function(num) {
		 var mobile= parseInt(num.substr(2));
		 //console.log(mobile);
		db.collection(collection).find({ "Ph": mobile }, function(err,result) {
			//console.log(result);
			result.forEach(function(data){
				var isValidWhatsApp = true;
				if(req.params.valid=='invalid') {
					isValidWhatsApp = false;
				}
                     data.W = isValidWhatsApp;
					 db.collection(collection).save(data);
					 //console.log(data);
			});
					 
		});
		 
		 });
	
  });
            }catch (e) {
                console.error("Syntax error: " + e);
                res.writeHead(400, { 'Content-Type': 'application/text' });
                res.end('Syntax error. Please check the syntax');
                return;
            }
	
		
                   res.status(200).json({});
				   
	 
     
    });
});
