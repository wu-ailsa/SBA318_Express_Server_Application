//running the application, caching return as 'app'
const express = require("express")
const app = express()
const port = 3000

app.listen(port, ()=> {
    console.log(`Server listening on port: ${port}`)
})

// logging middleware 
const logCapture = (req,res,next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
}

// authentication middleware
const userAuth = (req,res,next) => {
    req.user = {id: 1, username: 'example_user'};
    next()
}

app.use(logCapture)
app.use(userAuth)
app.use(express.static('public'))