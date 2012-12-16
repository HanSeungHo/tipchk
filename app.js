
/**
 * Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Network
// var client = new Array();

var net = require('net');
 var io = require('socket.io').listen(3001);

// // Debug level
io.set('log level', 1);

// // Websocket Server
io.sockets.on('connection', function(client) {
  console.log('Socket.io client connected'); 

  client.on('get page', function(page) {
      client.emit('page', data);
  });

  // C# recive
  client.on('query', function (data) {
   console.log(data);
  });

  //광해 
  client.on('actor', function(data) {

  });

  // Client(web browser) send
  mysql.get_employees(function(employees) {
   client.emit('populate', employees);
  });
  
  // Cocket server to webbrowser
  client.on('add employee', function(data) {

  });
});

var HOST = '192.168.0.15';
var PORT = 9000;

var client = new net.Socket();
client.connect(SOCKET_PORT, SOCKET_HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    //client.write('I am Chuck Norris!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {
    
  console.log('DATA: ' + data);
  // Close the client socket completely
  // client.destroy();

});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  process.stdout.write('data: ' + chunk);
  client.write(chunk);
});

process.stdin.on('end', function () {
  process.stdout.write('end');
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

