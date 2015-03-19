// ********** CHAT SERVER **********

// ---------- WEBSOCKET.IO ----------

var _ = require('lazy.js');
var ws = require('websocket.io'),
    wsServer = ws.listen(3000);

var users = [];

function broadcast(message) {
    wsServer.clients.map(function(client) {
        if(!!client) {
            client.send(message);
        }
    });
}

function userDisconnect(user) {
    users = _(users).without(user).toArray();
    
    var payload = {
        type: 'disconnect',
        data: {
            username: user
        }
    };
    
    broadcast(JSON.stringify(payload));
}

wsServer.on('connection', function (socket) {
    var user = null;
    socket.on('message', function (message) {
        payload = JSON.parse(message);
        
        if(payload.type == 'connect') {
            user = payload.data.username;
            users.push(user);
        }
        else if(payload.type == 'message') {
            // TODO persist message in DB
        }
        
        broadcast(message);
    });
    
    socket.on('close', function () {
        console.log('bye bye ' + user + ' :(');
        userDisconnect(user);
    });
    
    socket.on('error', function () {
        // console.log(arguments);
        console.log('Oups!');
        // userDisconnect(user);
    });
});



// ---------- EXPRESS ----------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', function (req, res) {
    
    res.render('index', {
        title: 'Sign in - Node.js demo - Web chat client over websocket',
        error_message: ''
    });
});

app.post('/', function (req, res) {
    res.cookie('username', req.body.username);
    res.cookie('color', req.body.color);
    res.redirect('/chat');
});

app.get('/chat', function (req, res) {
    res.render('chat', {
        title : 'Let\'s chat! - Node.js demo - Web chat client over websocket',
        history: [],
        users: users
    });
});

app.listen(8000);
