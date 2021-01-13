const http = require("http");
const fs = require("fs");

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};

/*fs.readFile(__dirname + '/index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {
        //response.setHeader('Content-type', mimeType['./index.html'] || 'text/html' );
        response.setHeader("Content-type", "text/html");
        //response.writeHead("Content-type", "application/javascript");
        //response.writeHead(200, { 'Content-Type': 'application/javascript' });
        response.write(html);  
        response.end();  
    }).listen(8000);
});*/


const server = http.createServer(function(req, res) {
 
   if(req.method==="POST"){
     var data = {newSpeed:500};     
     res.write(JSON.stringify(data));
     res.end();
   }
  
   if (req.method==="GET" && req.url === "/") {
     res.setHeader("Content-type", "text/html");
     const index = fs.readFileSync("./index.html");
     res.end(index);
   }
  
   fs.readFile("./"+req.url, function(err, data) {
     if (err) 
       res.end(err);
     else 
       res.end(data)
   });
  
 });

server.listen(process.env.PORT || 3000);

/*const url = require('url');
const path = require('path');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.argv[2] || 9000;


http.createServer(function (req, res) {
  console.log(`${req.method} ${req.url}`);

  // parse URL
  const parsedUrl = url.parse(req.url);

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  fs.exists(pathname, function (exist) {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory, then look for index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }

    // read file from file system
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // based on the URL path, extract the file extention. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // if the file is found, set Content-type and send data
        res.setHeader('Content-type',  'text/html' );
        res.end(data);
      }
    });
  });


}).listen(parseInt(port));

console.log(`Server listening on port ${port}`);*/