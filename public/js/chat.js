var wsUrl = "ws://localhost:3000/";
var socket = null;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var username = getCookie('username');
var color = getCookie('color');

function initSocket() {
    socket = new WebSocket(wsUrl);
    
    socket.onopen = function(evt) {
        var payload = {
            type: 'connect',
            data: {
                username: username
            }
        };

        this.send(JSON.stringify(payload));
    };
    
    socket.onmessage = function(message) {
        var payload = JSON.parse(message.data);
        var user_selector = '#user_' + payload.data.username;
        
        if (payload.type == 'connect') {
            if(!$(user_selector).length) {
                $('#users').append('<li id="user_' + payload.data.username + '">' + payload.data.username + '</li>');
            }
            $('#messages').append('<li><i>User <b>' + payload.data.username + '</b> has joined the chat</i></li>');
        }
        else if (payload.type == 'message') {
            $('#messages').append('<li class="' + payload.data.color + '"><span class="who">' + payload.data.username + '&gt;&nbsp;</span><span class="message">' + payload.data.message + '</span></li>');
        }
        else if (payload.type == 'disconnect') {
            console.log(payload);
            if($(user_selector).length) {
                console.log('Oh yeah!');
                console.log(user_selector);
                $(user_selector).remove();
            }
            $('#messages').append('<li><i>User <b>' + payload.data.username + '</b> has left the chat</i></li>');
        }
        else {
            // unsupported type
        }
    };
    
    socket.onclose = function() {
        console.log("Disconnected");
        setTimeout(function(){
            console.log("Trying reconnection ...");
            initSocket();
        }, 3000);
    };
}

initSocket();

function messageSubmit(form) {
    var payload = {
        type: 'message',
        data: {
            username: username,
            color: color,
            message: form.elements['message'].value
        }
    };
    
    socket.send(JSON.stringify(payload));
    form.elements['message'].value = '';
    form.elements['message'].focus();
    return false;
}

$(document).ready(function() {
    var messages = $('#messages');
    var messages_scroller = setInterval(function(){
        messages.scrollTop(messages.height());
    }, 100);
});

