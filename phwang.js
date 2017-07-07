var net = require("net");

/*
var client = new net.Socket();
client.setEncoding('utf8');
client.connect('8006', 'localhost', function() {
	console.log*('connect to server');
	client.write("Lphwang");
});
client.on('error', function() {
	console.log("errorrr");
});
client.on('data', function(data) {
	console.log('client receive: ' + data + ' from ' + client.remoteAddress + ':' + client.remotePort);
});

const TESTING_PORT = 8010;

var server = net.createServer(function(conn) {
	console.log('connected from ' + conn.remoteAddress + ":" + conn.remotePort);

	conn.on('data', function(data) {
		console.log('server receive: ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
		conn.write("HELLO");
	});
}).listen(TESTING_PORT);

server.on('listening', function() {
	console.log('listening on ' + TESTING_PORT);
})

server.on('error', function(err) {
	console.log('error');
})
*/

var express = require('express');
var bodyParser = require('body-parser');
require('./phwang_modules/go_modules/go_root.js').malloc();
require('./phwang_modules/matrix_modules/matrix_root.js').malloc();
require('./phwang_modules/fabric_modules/fabric_root.js').malloc();
var ajax = require('./phwang_modules/fabric_modules/fabric_ajax.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../js_go"));
app.post("/django_go/go_ajax/", ajax.post);
app.get("/django_go/go_ajax/", ajax.get);
app.put("/django_go/go_ajax/", ajax.put);
app.delete("/django_go/go_ajax/", ajax.delete);
app.use(ajax.not_found);
app.use(ajax.failure);
app.listen(8080);
