var SERVER_PORT = 8080;

var http = require("http");
var url = require("url");
var router = require("./router");
var cdb = require("./connectdb");
var preload = require("./preload");

cdb.startdb();
preload.init();
router.init();
http.createServer(function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    router.route(pathname,request,response);
}
).listen(SERVER_PORT);
console.log("Server started.");
