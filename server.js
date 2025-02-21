const express = require('express');
const usersRouter = require('./routes/users')
const requestRouter = require('./routes/requests')
const app = express()
const session = require('express-session')
app.use(express.json())
app.use(session({
    secret: "messi@10",
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.name = req.session.name;
    res.locals.email = req.session.email;
    res.locals.position = req.session.position;
    next();
})

app.use(express.urlencoded({extended: true}))

// API's
app.use('/users', usersRouter)
app.use('/requests', requestRouter)

//connecting the port.
app.listen(3000, (error) =>{
    if (error) throw error
    console.log("Ready")
})