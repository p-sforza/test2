var adminWS = [ ];
var notify = function(req, res) {
	for(c in adminWS) 
		adminWS[c].send(JSON.stringify({ 
			id: req.connection.remoteAddress,
			userAgent: req.headers['user-agent'],
			time: (new Date()).getTime()
		}));
}

var wss = new WebSocketServer({server:server});
wss.on('connection', function(ws) {
	adminWS.push(ws);
});
