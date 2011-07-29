var sio = require('socket.io');
var express = require('express');

var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res, next){
  res.render('./public/index.html');
});
app.listen(8080, 'localhost');

var socket = sio.listen(app, {
  flashPolicyServer: false,
  transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
});

//var socket = sio.listen(app);

var allClients = 0;
var clientId = 1;

var clients = new Array();

socket.sockets.on('connection', function(client) {
  
  var my_client = { "id": clientId, "obj": client, "x": 0, "y": 0 };
  
  clients.push(my_client);
  
  clientId += 1;
  allClients += 1;
  
  client.on('message', function(data) {
  	var obj = JSON.parse(data);
    my_client.x = obj.x;
    my_client.y = obj.y;
    console.log(data);
  });
  
  client.on('disconnect', function() {
    allClients -= 1;
    console.log('disconnect');
  });

});

my_timer = setInterval(function () {
			var _message = new Array();
			for(var i=0;i<clients.length;i++) {
				_message.push({"id":clients[i].id, "x":clients[i].x, "y":clients[i].y});
			}
	
    			socket.sockets.send(JSON.stringify({ "message": _message }));
  		}, 33);
  		