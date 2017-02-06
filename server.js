var express = require('express');
var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);


function newConnection(socket) {
	console.log('connection: ' +socket.id);
	socket.on('mainfetch', message);
	
	function message(data){
		console.log(data);
		var result = getAllFilesFromFolder('public/' +data);
		//socket.broadcast.emit('filereturn', result);
		io.sockets.emit('filereturn', result);
	}
}

function getAllFilesFromFolder(dir) {
	var filename;
    var filesystem = require('fs');
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {
		filename = file;
        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file))
        } else results.push(filename);

    });
	
    return results;

};