var cc              = require('config-multipaas'),
    finalhandler    = require('finalhandler'),
    http            = require("http"),
    Router          = require('router'),
    fs              = require('fs'),
    serveStatic     = require("serve-static"),
    express         = require('express'),
    SimpleWebsocket = require('simple-websocket');
 
var config   = cc();
var app      = Router()

// Serve up public/ftp folder 
app.use(serveStatic('static'))

// Routes
app.get("/status", function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end("{status: 'ok'}\n")
})

app.get("/", function (req, res) {
  var index = fs.readFileSync(__dirname + '/index.html')
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(index.toString())
})

app.use('/public', express.static('public'));

// Create server 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  app(req, res, done)
})

var socket = new SimpleWebsocket('ws://echo.websocket.org')
socket.on('connect', function () {
  // socket is connected! 
  socket.send('sup!')
})
 
socket.on('data', function (data) {
  console.log('got message: ' + data)
})

server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
