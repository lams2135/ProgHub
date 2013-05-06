var fs = require("fs"),path = require("path");
var url = require("url");
var querystring = require("querystring");
var pre = require("./preload");
var db = require("./connectdb");

function hwlistpage(request,response,cookies) {
    if (cookies['uid']==null||cookies['uid']=="N/A")
	require("./staticpage").loginpage(request,response,cookies);
    else {
	var rep = {};
	var rec_num = 0;
	rep["PH_HWLIST_TABLE"] = "";
	if (cookies['gp']=='admin')
	    rep["PH_HWLIST_ADMINENT"] = '<hr><h4><a href="sethwlist">[Edit Homework]</a></h4>';
	else
	    rep["PH_HWLIST_ADMINENT"] = '';
	db.get_pertotsub(cookies['uid'],function(perres) {
	    var st = {};
	    var sttt = 0;
	    for (var y in perres) {
		if (st[perres[y]["tid"]]==null)
		    st[perres[y]["tid"]]=0;
		st[perres[y]["tid"]]+=perres[y]["res"];
	    }
	    for (var z in st)
		if (st[z]>0)
		    sttt++;
	    console.log(st);
	    rep["PH_USER_SUBMITTED"] = sttt;
	    db.get_hwlist(function(res) {
		for (var x in res) {
		    rep["PH_HWLIST_TABLE"]+='<tr>';
		    if (st[res[x]["tid"]]==null)
			rep["PH_HWLIST_TABLE"]+='<td><i class="icon-pencil"></i></td>';
		    else if (st[res[x]["tid"]]>0)
			rep["PH_HWLIST_TABLE"]+='<td><i class="icon-ok"></i></td>';
		    else
			rep["PH_HWLIST_TABLE"]+='<td><i class="icon-minus"></i></td>';
		    rep["PH_HWLIST_TABLE"]+='<td><a href="seehw?tid='+res[x]["tid"]+'">'+res[x]["name"]+"</a></td>";
		    rep["PH_HWLIST_TABLE"]+="<td>"+res[x]["deadline"]+"</td>";
		    rep["PH_HWLIST_TABLE"]+="<td>"+res[x]["pas"]+"/"+res[x]["tot"]+"</td>";
		    rep["PH_HWLIST_TABLE"]+="</tr>";
		    rec_num++;
		}
		rep["PH_TOTAL_HW"] = rec_num;
		rep["PH_USER_PROGRESS"] = sttt*100/rec_num+ "%";
		pre.popup("HW List",cookies['uid'],"html-hwlist",rep,function(file) {
		    response.writeHead(200, {"Content-Type": "text/html"});
		    response.write(file, "utf-8");
		    response.end();
		});
	    });
	});
    }
}

function seehwpage(request,response,cookies) {
    if (cookies['uid']==null||cookies['uid']=="N/A") {
	require("./staticpage").loginpage(request,response,cookies);
	return;
    }
    var urlParsed = url.parse(request.url);
    var getData = querystring.parse(urlParsed.query); 
    var tid = getData["tid"];
    var rep = {};
    db.get_a_hw(parseInt(tid),function(res) {
	if (res==null) {
	    pre.reterror("Wrong homework id.",response);
	    return;
	}
	rep["PH_HW_TID"] = res.tid;
	rep["PH_HW_NAME"] = res.name;
	rep["PH_HW_DES"] = res.des;
	rep["PH_HW_FS"] = res.fs;
	rep["PH_HW_DL"] = res.deadline;
	rep["PH_HW_REC"] = "";
	db.get_persub(cookies['uid'],parseInt(tid),function(sub) {
	    for (var x in sub) {
		rep["PH_HW_REC"] += '<tr><td>'+sub[x]['upid']+'</td>';
		rep["PH_HW_REC"] += '<td>'+sub[x]['time']+'</td>';
		rep["PH_HW_REC"] += '<td>'+sub[x]['sco']+'</td>';
		if (sub[x]['res']==1)
		    rep["PH_HW_REC"] += '<td><span class="label label-success"><a href="uprd?upid='+sub[x]['upid']+'">Accepted</a></span></td></tr>';
		else if (sub[x]['sco']==-1)
		    rep["PH_HW_REC"] += '<td><span class="label"><a href="uprd?upid='+sub[x]['upid']+'">Pending</a></span></td></tr>';
		else
		    rep["PH_HW_REC"] += '<td><span class="label label-important"><a href="uprd?upid='+sub[x]['upid']+'">Failed</a></span></td></tr>';
	    }
	    pre.popup(res.name,cookies['uid'],"html-seehw",rep,function(file) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(file, "utf-8");
		response.end();
	    });
	});
    });
}

function uprdpage(request,response,cookies) {
    if (cookies['uid']==null||cookies['uid']=="N/A") {
	require("./staticpage").loginpage(request,response,cookies);
	return;
    }
    var urlParsed = url.parse(request.url);
    var getData = querystring.parse(urlParsed.query); 
    var upid = getData["upid"];
    var rep = {};
    db.get_a_sub(parseInt(upid),function(res) {
	if (res==null) {
	    pre.reterror("Error: wrong upload id.",response);
	    return;
	}
	if (cookies['uid']!=res.uid) {
	    pre.reterror("Error: Permission denied.",response);
	    return;
	}
	rep["PH_RD_UPID"] = res.upid;
	rep["PH_RD_TIME"] = res.time;
	rep["PH_RD_TID"] = res.tid;
	rep["PH_RD_SCO"] = res.sco;
	rep["PH_RD_OUTPUT"] = res.output;
	if (res.res==1)
	    rep["PH_RD_RES"] = "Accepted";
	else if (res.sco==-1)
	    rep["PH_RD_RES"] = "Pending";
	else
	    rep["PH_RD_RES"] = "Failed";
	db.get_a_hw(res.tid,function(sub) {
	    rep["PH_RD_TOTSCO"] = sub.fullsco;
	    rep["<O~PH_BR~O>"] = "<br>";
	    pre.popup("Result:"+res.upid,cookies['uid'],"html-uprd",rep,function(file) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(file, "utf-8");
		response.end();
	    });
	});
    });
}

function settingspage(request,response,cookies) {
    if (cookies['uid']==null||cookies['uid']=="N/A") {
	pre.reterror("Please sign in first.",response);
	return;
    }
    db.get_user_info(cookies['uid'],function(res) {
	if (res==null) {
	    pre.reterror("Fatal error! plz email Error-Code:401 to admin.",response);
	    return;
	}
	var rep = {};
	rep["PH_UIF_UID"] = res.uid;
	rep["PH_UIF_SN"] = res.sid;
	rep["PH_UIF_EMAIL"] = res.email;
	pre.popup("Settings",cookies['uid'],"html-settings",rep,function(file) {
	    response.writeHead(200, {"Content-Type": "text/html"});
	    response.write(file, "utf-8");
	    response.end();
	});
    });
}

exports.hwlistpage = hwlistpage;
exports.seehwpage = seehwpage;
exports.uprdpage = uprdpage;
exports.settingspage = settingspage;
