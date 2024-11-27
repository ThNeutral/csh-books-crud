DROP DATABASE IF EXISTS library;
CREATE DATABASE library;
USE library;

CREATE TABLE books(
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(30),
    author VARCHAR(255),
    isbn VARCHAR(13),
    publisher VARCHAR(255),
    publication_date DATE,
    language VARCHAR(50)
);