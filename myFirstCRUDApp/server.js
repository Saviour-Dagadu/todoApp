const express = require('express') // making it possible to use express in the file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121 // setting a constant to define the location where our server will be listening.
require('dotenv').config() //allows us to look for variable inside of the .env file

let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING //declare a variable and assigning our database connection string to it
    dbName = 'todo' //declare a variable and assigning the name of the database we will be using
    

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true }) //Creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console aa template literal 'connected to todo Database'
        db = client.db(dbName) ////assigning a value to previously declared db variable that contains a bd client factory method
    })//closing our .then
    
//middleware (helps facilitate our communications for our request)    
app.set('view engine', 'ejs') //set ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true})) // Tells express to decode and encode URLs where the header matches the content, Support arrays and objects
app.use(express.json()) //Parse JSON content from incoming requests


app.get('/', async (request, response)=>{ // start a GET method when the root is passed in, set up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //set a variable and waits All items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // set a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft}) // rendering the EJS file and passing through the db items and the count remaining inside of an object

    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) =>{ //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') // redirecting to update the home page
    }) // closing the then
    .catch(error => console.error(error)) //if there is an error, catch the error
}) // ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the add route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set:{
            completed: true //set completed status to true
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false    //prevents insertion if item does not already exist
    })
    .then(result =>{ // start a then if update was successful
        console.log('Marked Complete') //logging  successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })// closing our .then
    .catch(error => complete.error(error))//catching errors
})//ending put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the add route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set:{
            completed: false //set completed status to false
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false    //prevents insertion if item does not already exist
    })
    .then(result =>{ // start a then if update was successful
        console.log('Marked Complete') //logging  successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })// closing our .then
    .catch(error => complete.error(error))//catching errors
})//ending put

app.put('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result =>{ // start a then if update was successful
        console.log('Todo Deleted')//logging  successful completion
        response.json('Todo Deleted')// sending a response back to the sender
    })// closing our .then
    .catch(error => complete.error(error))//catching errors
})//ending put

.app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be lestining on either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)//end the listen method
})