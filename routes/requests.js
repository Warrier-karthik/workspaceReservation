const express = require('express')
const router = express.Router()
const db = require('../database')


//To get all the users
router.get('/', async (req, res) => {
    try{
        const requests = await db.getrequests()
        res.json(requests)
    } catch(err) {
        res.status(500).json({message: "database error", details: err.message})
    }
})

//To get all the requests
router.post('/createRequest', async (req, res) => {
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

//To update the request status
router.post('/statusUpdate', async(req, res) => {
    const request = await db.getrequest(req.body.id)
    try {
        if (request.length == 0){
            res.status(400).json({message: "The request not found."})
        }
        else if (req.session.position == "Manager"){ 
           
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

module.exports = router