# workspaceReservation
create a .env file with the following variables
HOST=
USER=
PASSWORD=
DATABASE=

#Install The following packages
npm i brcrypt(to encrypt passwords)
npm i dotenv
npm i mysql2
npm i express
npm i express-session(to make login sessions)

# Tables in mysql
This two tables should be made, users and request, its format is given in the Schema.sql file, if not...
CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE requests (
    id integer PRIMARY KEY AUTO_INCREMENT,
    User VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    SubmitDate DATE NOT NULL,
    request VARCHAR(255) DEFAULT 'pending',
    requestAdmin VARCHAR(50) DEFAULT 'pending'
);

# All The Api's

[
 [GET]http:localhost:3000/users, Gives the list of all users.
 [GET]http:localhost:3000/requests, Gives the list of all requests.
 [GET]http:localhost:300/logout, Used for logging out.
 [POST]http:localhost:3000/login, Used for logging in.
 [POST]http:localhost:3000/register, Used for creating a user.
 [POST]http:localhost:3000/statusUpdate, Used to update the status for a request.
 [POST]http:localhost:3000/book, To Book a room on a specific date.
]



#Different JSON formats for creating a user, login, creating requests and approve/deny by manager and admin

# Creating a User
{
    "name": "name",
    "email": "email",
    "password": "password",
    "position": "position"
}
position is case sensitive. Make sure it is ("employee"/"Manager"/"admin"). anything else will create a error.
# Login
{
    "email": "god@gmail.com",
    "password": "123"
}

#Creating Requests
{
  "dateofbooking" : "yyyy-mm-dd"
}
The dateofbooking should be in the yyyy-mm-dd format, other formats will not be accepted.

#Approving or Denying requests. (Both Manager and admin)
There are three requests,
1. "approved"
2. "rejected"
3. "pending"
on initially creating a request, the request will automatically be pending.
Make sure to get the id of a request by a get method (http:localhost:3000/requests)[GET].

{
  "id" "the id number",
  "status": "approved/rejected"
}
