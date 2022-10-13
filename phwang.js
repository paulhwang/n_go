var net = require("net");
var express = require('express');
var bodyParser = require('body-parser');
require('./phwang_modules/fabric_modules/fabric_root.js').malloc();
var d_port_module = require('./phwang_modules/fabric_modules/d_port.js');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../j_go"));
app.post("/django_go/go_ajax/", d_port_module.post);
app.get("/django_go/go_ajax/", d_port_module.get);
app.put("/django_go/go_ajax/", d_port_module.put);
app.delete("/django_go/go_ajax/", d_port_module.delete);
app.use(d_port_module.not_found);
app.use(d_port_module.failure);
app.listen(8080);
