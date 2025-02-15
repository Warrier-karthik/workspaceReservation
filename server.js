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
    next();
})
//Setting Up
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views')
app.use(express.urlencoded({extended: true}))
let msg = "";


// API's
app.get('/', async (req, res) => {
    const users = await db.getuser(req.session.email);
    
    res.render('index.ejs', {data: users});  
})

app.get('/createUser', (req, res) =>{
    res.render('register.ejs', {msg:msg})
})

app.post('/createUser', async (req, res) => {
    const users = await db.getusers();
    if (req.body.password == req.body.Cpassword) {
        try {
            const encryptedpwd = await bcrypt.hash(req.body.password, 10);
            const result = await db.createUser(req.body.fname, req.body.lname, req.body.email, req.body.position, encryptedpwd);
    
            
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(201).json(result);
            }
            msg = "";
            
            res.redirect('/login');
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ error: "Database error", details: error.message });
        }
    } else {
        res.status(400).json({ error: "Passwords do not match" });
        msg="passwords do not match"
        res.redirect('/createUser')
    } 
})

app.get('/login', async (req, res) => {
    const users = await db.getusers()
    
    res.render('login', {msg:msg})
})

app.post('/login', async (req, res) => {
    const user = await db.getuser(req.body.email)
    try{
        if (await bcrypt.compare(req.body.password, user[0].password))
        {
            
            req.session.isAuthenticated = true;
            req.session.name = user[0].FirstName;
            req.session.email = req.body.email;
            
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                res.status(200).json({msg:"login successful"})
            }
            else{
                msg = "";
                res.redirect('/')
            }
        }
        else 
        {
            msg = "Credentials do not match any of our users."
            res.redirect('/login')
        }
    } catch (error) {
        console.error("Database Error:", error);
    }
})

app.get('/book', (req, res) => {
    res.render('roomBook')
})

app.post('/book', async (req, res) => {
    const date = req.body.dateofBooking.toString()
    const dateArr = date.split("T")
    const result = await db.createRequest(req.session.name, req.session.email, dateArr[0])
    res.redirect('/')

})

app.get('/requests', async (req, res) => {
    const requests = await db.getrequests()
    const user = await db.getuser(req.session.email)
    res.render('allreq', {requests: requests, user: user[0]})
})

app.post('/requests', async(req, res) => {
    const user = await db.getuser(req.session.email)
    const result = await db.setStatus(req.body.status, req.body.id, user[0].Position)
    res.redirect('/requests')
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/'); 
    })

})
//connecting the port.
app.listen(3000, (error) =>{
    if (error) throw error
    console.log("Ready")
})