/*
* My take on assignment 1
*
*/

//imports
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var config = require('./config');

//function for the meat of http and https, since they have the same function
var unifiedServer = function(req, res){
    
    //get the url and parse
    var parsedUrl = url.parse(req.url, true);

    //get the path and trim it
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    //now to get some info(headers, stream if ever, method, query string as an object)
    var method = req.method.toLocaleLowerCase();
    var headers = req.headers;
    var queryStringObj = parsedUrl.query;

    //for stream
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(chunk){
        buffer += decoder.write(chunk);
    });
    req.on('end', function(){
        buffer += decoder.end();
    });

    //put the info to a data array
    var data = {
       'trimmedPath' : trimmedPath, 
       'headers' : headers,
       'method' : method,
       'queryStringObj' : queryStringObj,
       'payload' : buffer
    };

    //know what handler should use
    var chosenHandler = typeof(routing[trimmedPath]) !== 'undefined' ? routing[trimmedPath] : handlers.notFound;

    //route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload){
       //use the status code called back by the handler, or default to 200
       statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

       //use the payload called back by the handler, or default empty obj
       payload = typeof(payload) == 'object' ? payload : {};
   
       //parse the payload to string in JSON
       var payloadString = JSON.stringify(payload);

       //return the response
       res.setHeader('Content-Type', 'application/json');
       res.writeHead(statusCode);
       res.end(payloadString);

       //log the response
       console.log("Returning this response " +statusCode + payloadString);
   });
};

//create https server
var httpsOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pe')
}
var httpsServer = https.createServer(httpsOptions, function(req, res){
    unifiedServer(req, res);
});

//listen https server
httpsServer.listen(config.httpsPort, function(){
    console.log("Your server is listening on port " + config.httpsPort);
});

//create http server
var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

//listen http server
httpServer.listen(config.httpPort, function(){
    console.log("Your server is listening on port "  + config.httpPort);
})


//create handlers
var handlers = {};

//hello handler
handlers.hello = function(data, callback){
    callback(406, {'message' : "Hello there! Let's get started!"});
};

//not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

//ping handler
handlers.ping = function(data, callback){
    callback(200);
}

//routing procedures
var routing = {
    'hello' : handlers.hello,
    'ping' : handlers.ping
};
