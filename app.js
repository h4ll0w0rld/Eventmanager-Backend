console.log("Hi i am alive")


//require config.js fpr database connection
const config = require('./config');
const mysql = require('mysql');
const express = require('express')

const app = express()
const PORT = 3000

//set up database connection
const db = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
});


//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to database: ${config.database.name}`);
});





app.get('/', (req, res) => {
    res.send('hello world')
})


app.get('/shift', (req, res) => {

    //get every shift 
    db.query('Select * from Shift;', (err, rows) => {

        if (err) throw err

        console.log(rows)

        //responde all shifts
        res.send({
            rows
         }
    
        )

    })
   
})



app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`))

