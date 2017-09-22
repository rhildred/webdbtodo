var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();
var sFolder = ".";
app.use(serveStatic(sFolder));
var nPort = 5100;
app.listen(nPort, ()=>{
    console.log("Listening on port: " + nPort);
    console.log("Document Root: " + __dirname + "/" + sFolder);
});

