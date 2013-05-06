var path = require("path");
var fs = require("fs");
var fileserver = require("./fileserver");
var staticpage = require("./staticpage");
var userpage = require("./userpage");
var adminpage = require("./adminpage");
var sign = require("./sign");
var upload = require("./upload");

var handle = {};

function init() {
    handle["/"] = staticpage.start;
    handle["/home"] = staticpage.start;
    handle["/login"] = staticpage.loginpage;
    handle["/signin"] = sign.start;
    handle["/settings"] = userpage.settingspage;
    handle["/setuif"] = sign.setuif;
    handle["/logout"] = sign.out;
    handle["/signup"] = sign.reg;
    handle["/regester"] = staticpage.regpage;
    handle["/hwlist"] = userpage.hwlistpage;
    handle["/seehw"] = userpage.seehwpage;
    handle["/upload"] = upload.start;
    handle["/postcrossing"] = staticpage.postcrossing;
    handle["/contact"] = staticpage.contact;
    handle["/uprd"] = userpage.uprdpage;
    handle["/sethwlist"] = adminpage.hwlistpage;
    handle["/rmhw"] = adminpage.rmhwpage;
    handle["/okrmhw"] = adminpage.okrmhw;
    handle["/newhw"] = adminpage.newhwpage;
    handle["/addhw"] = adminpage.addhw;
    console.log("Router inited.");
}

function route(pathname,request,response) {
    if (typeof handle[pathname] === 'function') {
	var Cookies = {};
	request.headers.cookie && request.headers.cookie.split(';').forEach(function(Cookie) {
	    var parts = Cookie.split('=');
	    Cookies[parts[0].trim()] = (parts[1]||'').trim();
	});
	console.log(Cookies);
	handle[pathname](request,response,Cookies);
    }
    else 
	fileserver.handle(pathname,response);
}

exports.route = route;
exports.init = init;
