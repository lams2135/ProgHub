var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "hubdb";

var mongodb = require('mongodb');
var server = new mongodb.Server(DB_HOST,DB_PORT,{auto_reconnect:true});
var db = new mongodb.Db(DB_NAME,server,{safe:true});

function startdb() {
    db.open(function(err,db){
	if(!err)
            console.log("DB Connected.");
	else
	    console.log(err);
    });
};

function exist_user(uid,callback) {
    db.collection("users",function(err,collection) {
	collection.findOne({"uid":uid},function(err,doc) {
	    if (doc==null)
		callback(0);
	    else
		callback(1);
	});
    });
}

function add_user(uif,callback) {
    db.collection("users",function(err,collection) {
	collection.insert({
	    "uid":uif["uid"],
	    "sid":uif["sid"],
	    "email":uif["email"],
	    "pwd":uif["pwd"],
	    "group":uif["group"]
	},{safe:true},function(err,doc){console.log(uif);callback();});
    });
}

function change_user(uid,uif,callback) {
    db.collection("users",function(err,collection) {
	collection.findAndModify(
	    {uid : uid},
	    [['_id','asc']],
	    {$set : uif},
	    {},
	    function(err, object) {
		if (err)
		    console.warn(err.message);
		callback();
	    }
	);
    });
}

function confirm_user(uoid,pwd,callback) {
    var res;
    db.collection("users",function(err,collection) {
	collection.findOne({uid:uoid},function(err,results) {
	    console.log(results);
	    if (results==null)
		res = 0;
	    else if (results.pwd==pwd)
		res = 1;
	    else
		res = 2;
	    callback(res);
	});
    });
}

function get_user_info(uoid,callback) {
    db.collection("users",function(err,collection) {
	collection.findOne({uid:uoid},function(err,results) {
	    callback(results);
	});
    });
}

function add_hw(hif,callback) {
    db.collection("hwlist",function(err,collection) {
	collection.findOne({_id:"count"},function(err,res) {
	    var akn = res.conum+1200000;
	    collection.insert({
		"tid":akn,
		"name":hif["name"],
		"des":hif["des"],
		"fs":hif["fs"],
		"deadline":hif["deadline"],
		"tot":hif["tot"],
		"pas":hif["pas"],
		"fullsco":hif["fullsco"]
	    },{safe:true},function(err,doc){callback(err,akn);});
	    collection.findAndModify(
		{_id:"count"},
		[['_id','asc']],
		{$set:{"conum":res.conum+1}},
		{},
		function(err, object) {
		    if (err)
			console.warn(err.message);
		}
	    );
	});
    });
}

function change_hw(hif,callback) {
    db.collection("hwlist",function(err,collection) {
	collection.findAndModify(
	    {tid: hif["tid"]},
	    [['_id','asc']],
	    {
		$set:
		{
		    "name":hif["name"],
		    "des":hif["des"],
		    "fs":hif["fs"],
		    "script":hif["script"],
		    "deadline":hif["deadline"]
		}
	    },
	    {},
	    function(err, object){callback(err);}
	);
    });
}

function get_hwlist(callback) {
    db.collection("hwlist",function(err,collection) {
	collection.find({"tid":{$gte:0}}).toArray(function(err,res) {
	    if (!err)
		callback(res);
	    else
		callback(null);
	});
    });
}

function get_a_hw(tid,callback) {
    db.collection("hwlist",function(err,collection) {
	collection.findOne({"tid":tid},function(err,result) {
	    callback(result);
	});
    });
}

function rm_hw(tid,callback) {
    db.collection("hwlist",function(err,collection) {
	collection.remove({"tid":tid},{safe:true},function(err,t) {
	    callback();
	});
    });
    db.collection("uphw",function(err,collection) {
	collection.remove({"tid":tid},{safe:true},function(err,t) {
	    // rm all the files later--.
	});
    });
}

function get_pertotsub(uid,callback) {
    db.collection("uphw",function(err,collection) {
	collection.find({"uid":uid}).toArray(function(err,res) {
	    if (!err)
		callback(res);
	    else
		callback(null);
	});
    });
}

function get_persub(uid,tid,callback) {
    db.collection("uphw",function(err,collection) {
	collection.find({"uid":uid,"tid":tid}).toArray(function(err,res) {
	    if (!err)
		callback(res);
	    else
		callback(null);
	});
    });
}

function get_a_sub(upid,callback) {
    db.collection("uphw",function(err,collection) {
	collection.findOne({"upid":upid},function(err,res) {
	    callback(res);
	});
    });
}

function add_uphw(upif,callback) {
    db.collection("uphw",function(err,collection) {
	collection.findOne({_id:"count"},function(err,res) {
	    var akn = res.conum+1300000;
	    collection.insert({
		"upid":akn,
		"uid":upif["uid"],
		"tid":upif["tid"],
		"res":0,
		"sco":-1,
		"output":"N/A",
		"time":upif["time"]
	    },{safe:true},function(err,doc){callback(err,akn);});
	    collection.findAndModify(
		{_id:"count"},
		[['_id','asc']],
		{$set:{"conum":res.conum+1}},
		{},
		function(err, object) {
		    if (err)
			console.warn(err.message);
		}
	    );
	});
    });
}

function change_uphw(akn,result,sco,outtxt)
{
     db.collection("uphw",function(err,collection) {
	collection.findAndModify(
	    {upid: akn},
	    [['_id','asc']],
	    {
		$set:
		{
		    "res":result,
		    "sco":sco,
		    "output":outtxt
		}
	    },
	    {},
	    function(err, object) {
		if (err)
		    console.warn(err.message);
	    }
	);
     });
}

exports.exist_user = exist_user;
exports.change_user = change_user;
exports.confirm_user = confirm_user; // plan to delete.
exports.get_user_info = get_user_info;
exports.add_user = add_user;
exports.add_hw = add_hw;
exports.change_hw = change_hw;
exports.get_hwlist = get_hwlist;
exports.get_a_hw = get_a_hw;
exports.rm_hw = rm_hw;
exports.get_pertotsub = get_pertotsub;
exports.get_persub = get_persub;
exports.get_a_sub = get_a_sub;
exports.add_uphw = add_uphw;
exports.change_uphw = change_uphw;
exports.startdb = startdb;

// bad design, terrible drivers, they will be changed at next version.
