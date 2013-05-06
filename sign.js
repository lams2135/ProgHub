var fs = require("fs"),path = require("path");
var querystring = require("querystring");
var pre = require("./preload");
var connectdb = require("./connectdb");

function start(request,response,cookies) {
    var postData = "";
    request.setEncoding("utf8");
    request.addListener("data",function(postDataChunk){
	postData += postDataChunk;
    });
    request.addListener("end",function(postDataChunk){
	var uid = querystring.parse(postData).uid;
	var upass = querystring.parse(postData).upass;
	if (uid==null||upass==null) {
	    require("./staticpage").loginpage(request,response,cookies);
	    return;
	}
	connectdb.get_user_info(uid,function(res) {
	    if (res==null) {
		pre.reterror("User not existed or wrong password.",response);
		return;
	    }
	    if (res.pwd==upass) {
		pre.singlepage("html-login-success",function(file) {
		    response.writeHead(200, {
			"Set-Cookie": ["uid="+uid,"gp="+res.group],
			"Content-Type": "text/html"
		    });
		    response.write(file, "utf-8");
		    response.end();
		});
	    }
	    else
		pre.reterror("User not existed or wrong password.",response);
	});
    });
}

function out(request,response) {
    pre.singlepage("html-login-success",function(file) {
	response.writeHead(200, {
	    "Set-Cookie": ["uid=N/A","gp=N/A"],
	    "Content-Type": "text/html"
	});
	response.write(file, "utf-8");
	response.end();
    });
}

function reg(request,response) {
    var postData = "";
    request.setEncoding("utf8");
    request.addListener("data",function(postDataChunk){
	postData += postDataChunk;
    });
    request.addListener("end",function(postDataChunk){
	var uid = querystring.parse(postData).uid;
	var upass = querystring.parse(postData).upass;
	var usn = querystring.parse(postData).usn;
	var uem = querystring.parse(postData).uem;
	if (uid==null||upass==null) {
	    pre.reterror("Error sign up.",response);
	    return;
	}
	connectdb.exist_user(uid,function(confirm) {
	    if (confirm == 0) {
	    var uif={};
		uif["uid"]=uid;
		uif["sid"]=usn;
		uif["email"]=uem;
		uif["pwd"]=upass;
		uif["group"]="student";
		connectdb.add_user(uif,function(){
		    pre.singlepage("html-login-success",function(file) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
		    });
		});
	    }
	    else
		pre.reterror("Existed username.",response);
	});
    });
}

function setuif(request,response,cookies) {
    var postData = "";
    request.setEncoding("utf8");
    request.addListener("data",function(postDataChunk) {
	postData += postDataChunk;
    });
    request.addListener("end",function(postDataChunk) {
	if (cookies['uid']==null) {
	    pre.reterror("Please sign in.",response);
	    return;
	}
	var opass = querystring.parse(postData).opass;
	var upass = querystring.parse(postData).upass;
	var uem = querystring.parse(postData).uem;
	connectdb.confirm_user(cookies['uid'],opass,function(confirm) {
	    if (confirm == 1) {
		var uif={};
		if (uem!=""&&uem!=null)
		    uif["email"]=uem;
		if (upass!=""&&upass!=null)
		    uif["pwd"]=upass;
		connectdb.change_user(cookies['uid'],uif,function() {
		    pre.singlepage("html-login-success",function(file) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
		    });
		});
	    }
	    else
		pre.reterror("Wrong password.",response);
	});
    });
}

exports.start = start;
exports.out = out;
exports.reg = reg;
exports.setuif = setuif;
