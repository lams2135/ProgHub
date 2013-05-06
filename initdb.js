var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "hubdb";

var mongodb = require('mongodb');
var server = new mongodb.Server(DB_HOST,DB_PORT,{auto_reconnect:true});
var db = new mongodb.Db(DB_NAME,server,{safe:true});

db.open(function(err,db){
    if(!err)
    {  
        console.log('Connected DB');
	db.createCollection("users",function(err,collection){
	    if (err)
		console.log(err);
	    else {
		console.log("collection DB.hubdb.users created.");
		collection.insert({"uid":"root","sid":"110","email":"noemail@sysu.tk","pwd":"root19940819","group":"admin"},{safe:true},function(err,rec){});
		collection.insert({"uid":"admin","sid":"110","email":"noemail@sysu.tk","pwd":"root19940819","group":"admin"},{safe:true},function(err,rec){});
		collection.insert({"uid":"test","sid":"110","email":"noemail@sysu.tk","pwd":"root19940819","group":"admin"},{safe:true},function(err,rec){});
	    }
	});
	db.createCollection("hwlist",function(err,collection){
	    if (err)
		console.log(err);
	    else {
		console.log("collection DB.hubdb.hwlist created.");
		collection.insert({"_id":"count","conum":0},{safe:true},function(err,rec){});
	    }
	});
	db.createCollection("uphw",function(err,collection){
	    if (err)
		console.log(err);
	    else {
		console.log("collection DB.hubdb.uphw created.");
		collection.insert({"_id":"count","conum":0},{safe:true},function(err,rec){});
	    }
	});
    }else{
        console.log(err);
    }  
});

