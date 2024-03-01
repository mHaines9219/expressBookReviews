const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    req.session.username = username;
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  let reviewContent = req.body.review;
  let username = req.session.username; // Assuming this is correctly set during login

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).send('Book not found');
  }

  // Initialize the reviews object for the book if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update the review for the current user
  books[isbn].reviews[username] = reviewContent;

  return res
    .status(200)
    .json({ message: 'Review added/updated successfully', book: books[isbn] });
});
regd_users.delete('/auth/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.username;
  if (!books[isbn]) {
    return res.status(404).send('Book not found');
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).send('Review not found');
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
