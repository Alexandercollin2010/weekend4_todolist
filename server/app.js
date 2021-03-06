var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg= require('pg');
var urlEncodedParser = bodyParser.urlencoded( { extended: false } );
var port = process.env.PORT || 8080;

var connectionString= 'postgres://localhost:5432/task-list';

app.listen( port, function( req, res ){
  console.log( 'server listening on', port );
}); // end spin up server

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'public/index.html' ) );
}); // end base url

// get all the tasks from the database and sorting them in the order of false to true
app.get( '/getTasks', function( req, res ){
  console.log( 'getTasks url hit' );
  pg.connect(connectionString, function(err, client, done) {
         if (err) {
             console.log(err);
         } else {
             var results = [];
             var query = client.query('SELECT * FROM tasks ORDER BY status, ID');
             query.on('row', function(row) {
                 results.push(row);
             });
             query.on('end', function() {
                 done();
                 res.json(results);
             });// end query on
         }// end else
     });// end pg.connect
}); // end getTasks

// get task from client and store in database
app.post( '/addtask', urlEncodedParser, function( req, res ){
  console.log( 'addtask route hit' );
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    } else {
      client.query('INSERT INTO tasks(name, status) values($1, $2)', [req.body.task,req.body.status] );
      done();
      res.send('Got task');
    }// end else
  });// end pg.connect
});// end post

// Deleting a task in the database by I.D.
app.post( '/deletetask', urlEncodedParser, function( req, res ){
  console.log( 'deletetask route hit' );
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    } else {
      client.query('DELETE FROM tasks WHERE id=$1',[req.body.id]);
           res.sendStatus(200);
           done();
    }// end else
  });// end pg.connect
});// end post

// Updating the status to be true in the database
app.put('/completedTasks', urlEncodedParser, function(req, res){
  console.log('completedTasks route hit');
  pg.connect(connectionString, function (err, client, done){
    if (err){
      console.log("put");
    } else {
      var query = client.query('UPDATE tasks SET status = TRUE WHERE id = $1', [req.body.id]);
      done();
      res.send("complete");
    }// end else statement
  });// end pg.connect
});// end app.put

// static folder
app.use( express.static( 'public' ) );
