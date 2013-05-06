var fs = require("fs"),path = require("path");
var formidable = require("formidable");
var querystring = require("querystring");
var url = require("url");
var pre = require("./preload");
var db = require("./connectdb");
var exec = require("child_process").exec;

function hwlistpage(request,response,cookies) {
    if (cookies['uid']==null||cookies['uid']=="N/A") {
	require("./staticpage").loginpage(request,response,cookies);
	return;
    }
    if (cookies['gp']!='admin') {
	pre.reterror("Must be admins.",response);
	return;	
    }
    var rep = {};
    var rec_num = 0;
    rep["PH_HWLIST_TABLE"] = "";
    db.get_hwlist(function(res) {
	for (var x in res) {
	    rep["PH_HWLIST_TABLE"]+='<tr><td><a href="edithw?tid='+res[x]['tid']+'">[<i class="icon-pencil"></i>]</a>';
	    rep["PH_HWLIST_TABLE"]+=' <a href="rmhw?tid='+res[x]['tid']+'">[<i class="icon-trash"></i>]</a></td>';
	    rep["PH_HWLIST_TABLE"]+='<td><a href="seehw?tid='+res[x]["tid"]+'">'+res[x]["name"]+"</a></td>";
	    rep["PH_HWLIST_TABLE"]+="<td>"+res[x]["deadline"]+"</td>";
	    rep["PH_HWLIST_TABLE"]+="<td>"+res[x]["pas"]+"/"+res[x]["tot"]+"</td>";
	    rep["PH_HWLIST_TABLE"]+="</tr>";
	}
	pre.popup("HW List",cookies['uid'],"html-edithwlist",rep,function(file) {
	    response.writeHead(200, {"Content-Type": "text/html"});
	    response.write(file, "utf-8");
	    response.end();
	});
    });
}

function newhwpage(request,response,cookies) {
    if (cookies['gp']==null||cookies['gp']!='admin') {
	pre.reterror("Permission denied.",response);
	return;
    }
    pre.basicup("Add Homework",cookies['uid'],"html-newhw",function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    });
}

function rmhwpage(request,response,cookies) {
    if (cookies['gp']==null||cookies['gp']!='admin') {
	pre.reterror("Permission denied.",response);
	return;
    }
    var urlParsed = url.parse(request.url);
    var getData = querystring.parse(urlParsed.query); 
    var tid = getData["tid"];
    var rep = {"PH_RMHW_TID":tid};
    pre.popup("Really?",cookies['uid'],"html-rmhw",rep,function(file) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(file, "utf-8");
	response.end();
    })
}

function edithwpage(request,response,cookies) {
    if (cookies['gp']==null||cookies['gp']!='admin') {
	pre.reterror("Permission denied.",response);
	return;
    }
    var urlParsed = url.parse(request.url);
    var getData = querystring.parse(urlParsed.query); 
    var tid = getData["tid"];
    // need a page -> changehw;
}

function okrmhw(request,response,cookies) {
    if (cookies['gp']==null||cookies['gp']!='admin') {
	pre.reterror("Permission denied.",response);
	return;
    }
    var urlParsed = url.parse(request.url);
    var getData = querystring.parse(urlParsed.query); 
    var tid = getData["tid"];
    db.rm_hw(parseInt(tid),function() {
	hwlistpage(request,response,cookies);
    });
}

function addhw(request,response,cookies) {
    if (request.url == '/addhw' && request.method.toLowerCase() == 'post') {
	if (cookies['gp']==null||cookies['gp']!='admin') {
	    pre.reterror("Permission denied.",response);
	    return;
	}
	var form = new formidable.IncomingForm();
	form.uploadDir = "upload/tmp";
	form.maxFieldsSize = 20 * 1024 * 1024;
	form.parse(request, function(err, fields, files) {
	    if (err) {
		pre.reterror("Fatal Error. Please email Error-Code:402 to admin.",response);
		return;
	    }
	    var hif = {};
	    hif["name"] = fields["hwnm"];
	    hif["des"] = fields["hwde"];
	    hif["fs"] = fields["hwfs"];
	    hif["fullsco"] = parseInt(fields["fsco"]);
	    hif["deadline"] = fields["hwdl"];
	    hif["tot"] = 0;
	    hif["pas"] = 0;
	    db.add_hw(hif,function(err,akn) {
		if (err) {
		    pre.reterror("Fatal Error. Please email Error-Code:403 to admin.",response);
		    return;
		}
		exec("mkdir upload/hwtest/"+akn,{timeout:1000},function(err,stdout,stderr) {
		    exec("mv "+files.upload.path+" upload/hwtest/"+akn+"/test.zip");
		    hwlistpage(request,response,cookies);
		});
	    });
	});
    }
    else
	pre.reterror("Wrong way to addhw.",response);
} //req

function changehw(request,response,cookies) {
} //req

//router.

exports.hwlistpage = hwlistpage;
exports.rmhwpage = rmhwpage;
exports.okrmhw = okrmhw;
exports.newhwpage = newhwpage;
exports.addhw = addhw;
