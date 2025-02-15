CREATE DATABASE WorkspaceReservation;
USE WorkspaceReservation;

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
)