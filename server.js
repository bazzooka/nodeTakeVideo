var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Capture = require('./camera.js'); 


/** EXPRESS CONFIG **/
//console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));

app.get('/display', function(req, res){
  res.sendFile(__dirname + '/public/display.html');
});

app.get('/control', function(req, res){
  res.sendFile(__dirname + '/public/control.html');
});

var host = process.argv[2] || '127.0.0.1';
var port = process.argv[3] || 3000;
// var server = http.listen(port, host, function () {
// 	console.log('Example app listening at http://%s:%s', host, port);
// });
 
http.listen(3000, '0.0.0.0', function(){
  console.log('listening on *:3000');
});

/** SOCKET.IO CONFIG **/
var socket_display = null,
	socket_control = null;

io.on('connection', function(socket){
  socket.on('whoiam', function(msg, callback){
  	if(msg === "display"){
  		socket_display = socket.id;
  		console.log("Display connected on %s", socket.id);
  	} else if(msg === "control"){
  		socket_control = socket.id;
  		console.log("Control connected on %s", socket.id);
  	}
    callback(socket.id);

    socket.on('takeVideo', function(time){
    	console.log("Received takeVideo for time %s", time);
    	io.sockets.connected[socket_display].emit("prepareVideo", 5);
    	Capture.capture(time, function(){
    		console.log("catpure finished");
    	})
    });

    //io.sockets.connected[socket_display].emit("welcome", "I see you !");
  });
});


