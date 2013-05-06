var fs = require("fs"),path = require("path");
var pre = require("./preload");

function start(request,response,cookies) {
    pre.basicup("Home",cookies['uid'],"html-home",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

function postcrossing(request,response,cookies) {
    pre.basicup("PostCrossing",cookies['uid'],"html-postcrossing",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

function contact(request,response,cookies) {
    pre.basicup("Help",cookies['uid'],"html-contact",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

function regpage(request,response,cookies) {
    pre.basicup("Sign up",cookies['uid'],"html-regester",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

function loginpage(request,response,cookies) {
    pre.basicup("Sign in",cookies['uid'],"html-login",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

exports.start = start;
exports.regpage = regpage;
exports.loginpage = loginpage;
exports.contact = contact;
exports.postcrossing = postcrossing;
