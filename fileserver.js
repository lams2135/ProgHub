var mime = require("./mime").types;
var path = require("path");
var fs = require("fs");
var pre = require("./preload");

function handle(pathname,response) {
    var realPath = "static" + pathname;
    readPath = realPath.replace("../","");
    fs.exists(realPath, function (exists) {
	if (!exists) {
	    pre.reterror("HTTP Not Found.",response);
	    return;
	} else {
	    fs.readFile(realPath,"binary",function(err,file) {
                if (err) {
		    response.writeHead(500, {'Content-Type': 'text/plain'});
		    response.end(err);
                } else {
		    var ext = path.extname(realPath);
		    ext = ext ? ext.slice(1) : 'unknown';
		    var cty = mime[ext]||'text/plain';
		    response.writeHead(200, {'Content-Type':cty});
		    response.write(file, "binary");
		    response.end();
                }
	    });
	}
    });
}

exports.handle = handle;
