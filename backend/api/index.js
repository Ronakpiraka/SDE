// var Express = require("express");
// var Mongoclient = require("mongodb").MongoClient;
// var cors = require("cors");
// const multer = require("multer");
// const { response } = require("express");

// var app = Express();
// app.use(cors());

// // var Connection_String = "mongodb+srv://admin:justpassword@cluster0.7wtdhcs.mongodb.net/?retryWrites=true&w=majority";
// var Connection_String = "mongodb+srv://admin:simplepassword@cluster0.hauzbe5.mongodb.net/?retryWrites=true&w=majority";
// var databasename = "healthcaredb"
// // var databasename = "todoappdb"
// var database;

// app.listen(5038, () => {
//     Mongoclient.connect(Connection_String, (error, client) => {
//         database = client.db(databasename);
//         console.log("Mongo DB is working")
//     })
// })

// app.get('/api/todoapp/GetNotes', (request, response) => {
//     // database.collection("todoappcollection").find({}).toArray((error,result)=> {
//     database.collection("sampledata").find({}).toArray((error, result) => {
//         response.send(result);
//     });
// })

// // app.post('/api/todoapp/AddNotes',multer().none(),(request,response)=> {
// //     database.collection("todoappcollection").count({},function(error,numOfDocs){
// //         database.collection("todoappcollection").insertOne({
// //             id:(numOfDocs+1).toString(),
// //             description:request.body.newNotes
// //         });
// //         response.json("Added Successfully");
// //     })
// // })

// // app.delete('/api/todoapp/DeleteNotes',(request,response)=>{
// //     database.collection("todoappcollection").deleteOne({
// //         id:request.query.id
// //     });
// //     response.json("deleted succesfully");
// // })