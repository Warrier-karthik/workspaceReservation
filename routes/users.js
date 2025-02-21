const express = require('express')
const router = express.Router()
const db = require('../database')
const bcrypt = require('bcrypt')

// To get all the users
router.get('/', async (req, res) => {
    try {
    const users = await db.getusers();
    res.json(users)
    } catch (err) {
        res.status(500).json({error: "database error", details: err.message})
    }
})

// To create a new user
router.post('/register', async (req, res) => {
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


//To login
router.post('/login', async (req, res) => {
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


//To Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
            res.json({message: "Cannot Logout", "details": err.message})
        }
        res.clearCookie('connect.sid');
        res.json({message:"Logged Out Successfully!!"})
    })

})

module.exports = router