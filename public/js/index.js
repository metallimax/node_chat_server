var socket = new WebSocket("ws://localhost:3000/");
var username = 'metallimax';
 
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
    console.log(message);
};
 
socket.onclose = function() {
    console.log("Disconnected");
    setTimeout(function(){
        console.log("Trying reconnection ...");
        socket = new WebSocket("ws://localhost:3000/");
    }, 3000);
};



function messageSubmit(form) {
    var payload = {
        type: 'message',
        data: {
            username: username,
            message: form.elements['message'].value
        }
    };
    
    socket.send(JSON.stringify(payload));
    form.elements['message'].value = '';
    form.elements['message'].focus();
    return false;
}