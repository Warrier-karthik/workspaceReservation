const express = require('express');
const db = require('./database')
const bcrypt = require('bcrypt')
const app = express()
const session = require('express-session')
const kill = require('kill-port')

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
    res.locals.position = req.session.position
    next();
})
//Setting Up

app.use(express.urlencoded({extended: true}))
let msg = "";
// API's
app.get('/users', async (req, res) => {
    try {
    const users = await db.getusers();
    res.json(users)
    } catch (err) {
        res.status(500).json({error: "database error", details: err.message})
    }
})



app.post('/register', async (req, res) => {
    const user = await db.getuser(req.body.email);
    if (user.length > 0) {
        res.status(409).json({message: "email already exists, check if you have an account."})
    }
    else{
        try {
            const encryptedpwd = await bcrypt.hash(req.body.password, 10);
            const result = await db.createUser(req.body.name, req.body.email, req.body.position, encryptedpwd);
            return res.status(201).json(result);

        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error", details: error.message });
        }
    }
})



app.post('/login', async (req, res) => {
    const user = await db.getuser(req.body.email)
    try{
        if (await bcrypt.compare(req.body.password, user[0].password))
        {
            
            req.session.isAuthenticated = true;
            req.session.name = user[0].FirstName;
            req.session.email = req.body.email;
            req.session.position = user[0].Position
            console.log(req.session.position)
            res.status(200).json({message:"login successful"})
            
        }
        else 
        {
    
            res.status(400).json({message: "login failed"})
        }
    } catch (error) {
        console.error("Database Error:", error);
    }
})

app.post('/book', async (req, res) => {
    try {
        if (req.session.position == "employee"){
            const date = req.body.dateofbooking
            
            const result = await db.createRequest(req.session.name, req.session.email, date)
            res.json({message :"request added successfully, wait for approval."})
        } else if (!req.session.isAuthenticated) {
            res.status(401).json({message: "please login before creating a room"})
        } else {
            res.status(401).json({message: "you are not an employee, only employees can book the room"})
        }
    } catch (err) {
        res.status(500).json({message: "database error", details: err.message})
    }
})

app.get('/requests', async (req, res) => {
    try{
        const requests = await db.getrequests()
        const user = await db.getuser(req.session.email)
        res.json(requests)
    } catch(err) {
        res.status(500).json({message: "database error", details: err.message})
    }
})

app.post('/statusUpdate', async(req, res) => {
    const request = await db.getrequest(req.body.id)
    try {
        if (req.session.position == "Manager"){
            const result = await db.setStatus(req.body.status, req.body.id, req.session.position)
            res.json({message: "status updated successfully"})
        }
        else if (req.session.position == "admin") {
            if (request[0].request == "approved"){
                const result = await db.setStatus(req.body.status, req.body.id, req.session.position)
                res.json({message: "status updated successfully"})
            }
            else if (request[0].request == "rejected"){
                res.json({message: "looks like Manager denied approval"})
            }
            else {
                res.json({message: "Manager is still hasn't approved, wait till manager approves or rejects"})
            }
        }
    } catch (err) {
        res.status(500).json({message: "database error", details: err.message})
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
            res.json({message: "Cannot Logout", "details": err.message})
        }
        res.clearCookie('connect.sid');
        res.json({message:"Logged Out Successfully!!"})
    })

})
//connecting the port.
app.listen(3000, (error) =>{
    if (error) throw error
    console.log("Ready")
})