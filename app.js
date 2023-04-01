console.log("Hi i am alive")
const express = require('express')

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('hello world')
})


app.get('/user', (req, res) => {
    res.send({
        company: "none",
        name: "nils",
        age: 24
    }

    )
})

app.listen(PORT, () => console.log(`Hello world app listening on port ${PORT}!`))