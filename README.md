# workspaceReservation
create a .env file with the following variables
``` .env
HOST=
USER=
PASSWORD=
DATABASE=
```
# Add the following to the headers of the api platoform you are using
| Header Name  | Value                                 |
|---------|------------------------------------------|
| **Content-Type**  | `application/json`           | 
| **Accept**  | `application/json`           | 
# Install The following packages
``` cmd
npm i bcrypt
```
This package is to encrypt passwords
``` cmd
npm i dotenv
```
This package is to integrate .env file
``` cmd
npm i mysql2
```
This package is to integrate mysql with express
``` cmd
npm i express
```
expressJs package
``` cmd
npm i express-session(to make login sessions)
```
for creating login sessions
# Tables in mysql
This two tables should be made, users and request, its format is given in the Schema.sql file, if not...

``` MYSQL
CREATE TABLE users (

    id integer PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
    
);
```




``` MYSQL
CREATE TABLE requests (
    id integer PRIMARY KEY AUTO_INCREMENT,
    User VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    SubmitDate DATE NOT NULL,
    request VARCHAR(255) DEFAULT 'pending',
    requestAdmin VARCHAR(50) DEFAULT 'pending'
);
```
# All The Api's

| Method  | Endpoint                                  | Description                          |
|---------|------------------------------------------|--------------------------------------|
| **GET**  | `http://localhost:3000/users`           | Get a list of all users             |
| **GET**  | `http://localhost:3000/requests`        | Get a list of all requests          |
| **GET**  | `http://localhost:3000/logout`          | Logout user                         |
| **POST** | `http://localhost:3000/login`           | User login                          |
| **POST** | `http://localhost:3000/register`        | Create a new user                   |
| **POST** | `http://localhost:3000/statusUpdate`    | Update request status (approved/rejected) |
| **POST** | `http://localhost:3000/book`            | Book a room for a specific date     |


# Different JSON formats for creating a user, login, creating requests and approve/deny by manager and admin

# Creating a User
``` JSON
{
    "name": "name",
    "email": "email",
    "password": "password",
    "position": "position"
}
```

position is case sensitive. Make sure it is ("employee"/"Manager"/"admin"). anything else will create a error.


# Login
``` JSON
{
    "email": "email",
    "password": "passwords"
}
```
# Creating Requests
``` JSON
{
  "dateofbooking" : "yyyy-mm-dd"
}
```

The dateofbooking should be in the `yyyy-mm-dd` format, other formats will not be accepted.

# Approving or Denying requests. (Both Manager and admin)

There are three requests,
1. "approved"
2. "rejected"
3. "pending"
   
on initially creating a request, the request will automatically be pending.
Make sure to get the id of a request by a GET method `(http:localhost:3000/requests)`.
``` JSON
{
  "id": "the id number",
  "status": "approved/rejected"
}
```
