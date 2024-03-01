const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    users.push({ username: username, password: password });
    console.log(users);
    res.send('User registered successfully');
  } else {
    res.send('Please enter username and password');
  }
});

public_users.get('/', async function (req, res) {
  try {
    const bookList = await Promise.resolve(books); // Assuming books is fetched asynchronously
    res.send(bookList);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const bookDetails = await Promise.resolve(books[req.params.isbn]);
    res.send(bookDetails);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    //Write your code here
    let result = [];
    let author = req.params.author;
    Object.values(books).forEach((book) => {
      if (book.author === author) {
        result.push(book);
      }
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    let result = [];
    let title = req.params.title;
    Object.values(books).forEach((book) => {
      if (book.title === title) {
        result.push(book);
      }
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let result = [];
  let isbn = req.params.isbn;
  Object.values(books).forEach((book) => {
    if (book.isbn === isbn) {
      result.push(book.reviews);
    }
  });
  res.send(result);
});

module.exports.general = public_users;
