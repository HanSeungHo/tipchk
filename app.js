
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

//var ws = 'http://127.0.0.1:3000';
var ws = 'http://rinker.kr:3000';

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Route 
app.get('/', function(req,res) {
    res.render('index', { title: 'Express', ws: ws });
});

app.get('/chat', function(req,res) {
  if(app.session){
    res.render('chat', { title: 'Express', ws: ws, user:app.session.user });
  }else{
    res.redirect('/');  
  }  
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
  socket.on('message', function(data) {
    // get name associated with this socket
    socket.get('name', function(error, name) {
      // send message to all chat participants
      socket.broadcast.emit('message', { 
        user: data.user,
        message: data.message 
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

