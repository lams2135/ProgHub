var formidable = require("formidable");
var db = require("./connectdb");
var pre = require("./preload");
var fs = require("fs");
var exec = require("child_process").exec;

function start(request,response,cookies)
{
    if (request.url == '/upload' && request.method.toLowerCase() == 'post') {
	if (cookies['uid']==null||cookies['uid']=="N/A") {
	    require("./loginpage").start(request,response);
	    return;
	}
	// parse a file upload
	var form = new formidable.IncomingForm();
	form.uploadDir = "upload/tmp";
	form.maxFieldsSize = 2 * 1024 * 1024;
	form.parse(request, function(err, fields, files) {
	    if (err) {
		pre.reterror("Fatal Error.",response);
		return;
	    }
	    var upif = {};
	    var myDate = new Date();
	    var mdr = myDate.toTimeString().split(' ');
	    myDate.setHours(myDate.getHours()+8);
	    var mdf = myDate.toISOString().split('T');
	    upif["uid"] = cookies["uid"];
	    upif["tid"] = parseInt(fields["tid"]);
	    upif["time"] = mdf[0] + ' ' + mdr[0];
	    db.add_uphw(upif,function(err,akn) {
		if (err) {
		    pre.reterror("Fatal Error.",response);
		    return;
		}
		exec("sh testfile.sh "+akn+" "+files.upload.path+" "+upif["tid"],
		     {timeout: 10000, maxBuffer: 20000*1024},
		     function (error, stdout, stderr) {
			 var output = fs.readFileSync("upload/hw/"+akn+"/output.txt","utf8");
			 var resfile = fs.readFileSync("upload/hw/"+akn+"/res.txt","utf8");
			 var re = resfile.split(',');
			 output = output.replace(/\r\n|\n/g,"<O~PH_BR~O>");
			 if (re[1]==re[2])
			     db.change_uphw(akn,1,parseInt(re[1]),output);
			 else
			     db.change_uphw(akn,0,parseInt(re[1]),output);
		     });
		require("./userpage").hwlistpage(request,response,cookies);
	    });
	});
    }
    else
	pre.reterror("Wrong way to upload.",response);
}

exports.start = start;
    
