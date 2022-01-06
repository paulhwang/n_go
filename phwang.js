var net = require("net");
var express = require('express');
var bodyParser = require('body-parser');
require('./phwang_modules/http_modules/http_root.js').malloc();
var http_input_module = require('./phwang_modules/http_modules/http_input.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../j_go"));
app.post("/django_go/go_ajax/", http_input_module.post);
app.get("/django_go/go_ajax/", http_input_module.get);
app.put("/django_go/go_ajax/", http_input_module.put);
app.delete("/django_go/go_ajax/", http_input_module.delete);
app.use(http_input_module.not_found);
app.use(http_input_module.failure);
app.listen(8080);
