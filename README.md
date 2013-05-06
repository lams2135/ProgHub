Configure the HTTP listening port:
check the config in "server.js", first line.
var SERVER_PORT = 8080;

Configure your MongoDB server first.

Then check the config in "connectdb.js" and "initdb.js", first 3 lines, the written config is in normal.
var DB_HOST = "localhost";
var DB_PORT = 27017;
var DB_NAME = "hubdb";

Make sure node.js is correctly installed in your machine.

If all is okay -->

For first run, init first:
$./configure.sh

To start server:
$node server

To close server, just press "CTRL-C".

Entrance:server.js

Router[use npm path]:router.js

StaticFileServer:
 fileserver.js
 mime.js

FileCache&SetupPage: preload.js

MongoDB Operate[use npm mongodb]:
 connectdb.js
 initdb.js

Pages:
 userpage.js
 adminpage.js

NEXT DISTURB：
TA mark
postcrossing
TimeLimit
connectdb.js
more icon
Good Jumpover
