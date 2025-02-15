const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config()
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise()

async function getusers(){
    const [rows] = await pool.query(`SELECT * FROM users`)
    return rows;
}
async function getuser(email) {
    const [row] = await pool.query(`SELECT * FROM users WHERE Email=?`, 
        [email]);
        return row;
}
async function createUser(FirstName, LastName, Email, Position, password){
    const result = await pool.query(`INSERT INTO users (FirstName, LastName, Email, Position, password) 
        VALUES (?, ?, ?, ?, ?)`
        , [FirstName, LastName, Email, Position, password]);
    
}   

async function createRequest(User, Email, SubmitDate) {
    const result = await pool.query(`INSERT INTO requests (User, Email, SubmitDate) 
        VALUES (?, ?, ?)`
        , [User, Email, SubmitDate])
}
async function getrequests() {
    const [rows] = await pool.query(`SELECT * FROM requests`)
    return rows
}

async function setStatus(Request, Id, position) {
    if (position === 'teamManager'){
        const result = await pool.query(`UPDATE requests SET 
            request = ? WHERE id = ?`
            , [Request, Id])
    } 
    if (position === 'admin') {
        const result = await pool.query(`UPDATE requests SET 
            requestAdmin = ? WHERE id = ?`
            , [Request, Id])
    }
}

module.exports = {
    getusers : getusers,
    createUser: createUser,
    getuser: getuser,
    createRequest: createRequest,
    getrequests: getrequests,
    setStatus: setStatus,
}