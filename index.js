// ********** CHAT SERVER **********

// ---------- WEBSOCKET.IO ----------

var ws = require('websocket.io'),
    wsServer = ws.listen(3000);
 
wsServer.on('connection', function (socket) {
    socket.on('message', function (message) {
        console.log(message);
        wsServer.clients.map(function(client) {
            client.send(message);
        });
    });
    socket.on('close', function () {
        console.log('bye bye!');
    });
});



// ---------- EXPRESS ----------
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', {
    title : 'Sign in - Node.js demo - Web chat client over websocket'
  });
});

app.post('/', function (req, res) {
  res.redirect('/chat');
});

app.get('/chat', function (req, res) {
  res.render('chat', {
    title : 'Let\'s chat! - Node.js demo - Web chat client over websocket',
    // history: [{color: 'black', message: '<no history>'}]
    history: [],
    users: ['toto', 'pipo']
  });
});
app.listen(8000);
