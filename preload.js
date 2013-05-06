var fs = require("fs");
var buf = {};

function readin(fname) {
    fs.readFile("static/"+fname+".html","utf-8",function(err,file){
	if (!err)
	    buf[fname]=file;
	else {
	    console.log("Error in loading "+fname);
	    console.log(err);
	}
    });
}

function init() {
    readin("html-head");
    readin("signed-nav");
    readin("html-foot");
    readin("html-error");
    readin("html-regester");
    readin("html-login");
    readin("html-settings");
    readin("html-login-success");
    readin("html-home");
    readin("html-hwlist");
    readin("html-seehw");
    readin("html-uprd");
    readin("html-postcrossing");
    readin("html-contact");
    readin("html-edithwlist");
    readin("html-rmhw");
    readin("html-newhw");
    console.log("File Cache loaded.");
}

function basicup(title,uid,body,callback) {
    var head = buf["html-head"].replace("PH_HEAD_TITLE",title);
    if (body=="html-home")
	head = head.replace('<li><a href="home">','<li class="active"><a href="#">');
    else if (body=="html-hwlist")
	head = head.replace('<li><a href="hwlist">','<li class="active"><a href="#">');
    else if (body=="html-postcrossing")
	head = head.replace('<li><a href="postcrossing">','<li class="active"><a href="#">');
    else if (body=="html-contact")
	head = head.replace('<li><a href="contact">','<li class="active"><a href="#">');
    if (uid==null||uid=="N/A")
	head = head.replace("PH_NAV_USER",'<li><a href="login">Sign in</a></li>');
    else {
	head = head.replace("PH_NAV_USER",buf["signed-nav"]);
	head = head.replace("PH_NAV_UID",uid);
    }
    if (buf[body]!=null) {
	callback(head+buf[body]+buf["html-foot"]);
    }
    else
	callback("HTTP NOT FOUND");
}

function popup(title,uid,body,rep,callback) {
    var head = buf["html-head"].replace("PH_HEAD_TITLE",title);
    if (body=="html-home")
	head = head.replace('<li><a href="home">','<li class="active"><a href="#">');
    else if (body=="html-hwlist")
	head = head.replace('<li><a href="hwlist">','<li class="active"><a href="#">');
    else if (body=="html-message")
	head = head.replace('<li><a href="message">','<li class="active"><a href="#">');
    else if (body=="html-contact")
	head = head.replace('<li><a href="contact">','<li class="active"><a href="#">');
    if (uid==null||uid=="N/A")
	head = head.replace("PH_NAV_USER",'<li><a href="login">Sign in</a></li>');
    else {
	head = head.replace("PH_NAV_USER",buf["signed-nav"]);
	head = head.replace("PH_NAV_UID",uid);
    }
    if (buf[body]!=null) {
	var bbody = buf[body];
	for (var x in rep) {
	    bbody = bbody.replace(new RegExp(x,'g'),rep[x]);
	}
	callback(head+bbody+buf["html-foot"]);
    }
    else
	callback("HTTP NOT FOUND");
}

function singlepage(page,callback) {
    if (buf[page]!=null)
	callback(buf[page]);
    else
	callback("HTTP NOT FOUND");
}

function reterror(str,response) {
    popup('Error!','N/A',"html-error",{"PH_ERROR_INFO":str},function(file) {
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(file);
	response.end();
    });
}

exports.init = init;
exports.basicup = basicup;
exports.popup = popup;
exports.singlepage = singlepage;
exports.reterror = reterror;
