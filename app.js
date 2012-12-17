
/**
 * Module dependencies.
*/

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  //gzip compress
  //app.use(express.compress());
  app.use(express.methodOverride());  
  app.use(express.cookieParser('TepChk session'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

// Tcp sokcet setting
var SOCKET = {
  //HOST: '192.168.0.15',
  HOST: '20.211.55.3',  
  PORT: 9000
}

var ws = 'http://127.0.0.1:3000';

//var ws = 'http://rinker.kr:3000';
app.configure('development', function(){
  app.use(express.errorHandler());
});

//Route 
app.get('/', function(req,res) {
    res.render('index', { title: 'Express', ws: ws });
});

app.get('/chat', function(req,res) {
    res.render('chat', { title: 'Express', ws: ws });
});


app.get('/game', function(req,res) {
    res.render('game', { title: 'Express', ws: ws });
});

app.get('/room', function(req,res) {
    res.render('index', { title: 'Express', ws: ws});
});

app.get('/play', function(req,res) {
  if(app.session){
    res.render('play', { user: app.session.user });
  }else{
    res.redirect('/');  
  }
    
});

var http = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



// TCP Socket Network
// var client = new Array();

var net = require('net');
var io = require('socket.io').listen(http);

// Debug level
//io.set('log level', 1);
    app.session = {
      user: 'test'
    };
// // Websocket Server
io.sockets.on('connection', function(client) {
  console.log('Connect to Login'); 

  // Cocket server to webbrowser
  client.on('login', function(data) {
    //console.log(data);
    app.session = {
      user:data
    };
    console.log('Session:', app.session);
  });

  client.on('getUser', function() {
    console.log('userlist');
    client.emit('broadList', app.session.user);
  });

});

//Game Sokcet.io
// var Room = io
//   .of('/game')
//   .on('connection', function(socket) {

    
//     socket.emit('test', 'test');
//     //console.log('Connect to game');
//     var joinedRoom = null;
//     socket.on('join room', function(data) {
//       console.log(data);
//       socket.join(data);
//       joinedRoom = data;
//       socket.emit('joined', "you've joined " + data);
//       socket.broadcast.to(joinedRoom)
//                          .send('someone joined room');
//     });
//     socket.on('fromclient', function(data) {
//       if (joinedRoom) {
//         socket.broadcast.to(joinedRoom).send(data);
//       } else {
//         socket.send(
//            "you're not joined a room." +
//            "select a room and then push join."
//         );
//       }
//     });
// });


// create socket namespace for the chat room
var chat = io.of('/chat').on('connection', function(socket) {
  console.log('join')
  // new client has joined the chat
    socket.set('name', app.session.user, function() {
      // inform client we're ready
      console.log('join')
      socket.emit('ready');
    });

  // client has sent a new change message
  socket.on('message', function(message) {
    // get name associated with this socket
    socket.get('name', function(error, name) {
      // send message to all chat participants
      socket.broadcast.emit('message', { 
        from: app.session.user,
        message: message 
      });
    });
  });
});


// create socket namespace for the chat room
var game = io.of('/game').on('connection', function(socket) {
  console.log('Game socket.io')
  // new client has joined the chat
    socket.set('name', app.session.user, function() {
      // inform client we're ready
      console.log('join')
      socket.emit('ready');

    });

  // // client has sent a new change message
  // socket.on('start', function(message) {
  //   socket.broadcast.emit('message', { 
  //       from: '퀴즈',
  //       message: '게임을 시작합니다' 
  //   });
  // });   

  // client has sent a new change message
  socket.on('message', function(message) {

    // get name associated with this socket
    socket.get('name', function(error, name) {
      // send message to all chat participants
      socket.broadcast.emit('message', { 
        from: app.session.user,
        message: message 
      });
    });
  });


});

// Socket.io

var client = new net.Socket();
client.connect(SOCKET.PORT, SOCKET.HOST, function() {
    console.log('CONNECTED TO: ' + SOCKET.HOST + ':' + SOCKET.PORT);
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


// Console Test

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

