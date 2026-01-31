const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send(`include username and password in body`);
  }
  if (isValid(username)) {
    return res.status(404).send(`User ${username} is already registered.`);
  }
  users[username] = password;
  return res.status(200).send(`User ${username} has been registered.`);

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const match = books[isbn];
  if (match) {
    return res.status(200).send(JSON.stringify(match, null, 4));
  } else {
    return res.status(200).send(`ISBN ${isbn} not found.`);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const isbns = Object.keys(books);
  const author = req.params.author;

  let authorBooks = {};
  for (let i=0; i<isbns.length; i++) {
    let isbn = isbns[i];
    if (books[isbn].author === author) {
      authorBooks[isbn] = books[isbn];
    }
  }
  if (Object.keys(authorBooks).length > 0) {
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } else {
    return res.status(200).send(`No books found by author '${author}'.`);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const isbns = Object.keys(books);
  const title = req.params.title;

  let titleBooks = {};
  for (let i=0; i<isbns.length; i++) {
    let isbn = isbns[i];
    if (books[isbn].title === title) {
      titleBooks[isbn] = books[isbn];
    }
  }
  if (Object.keys(titleBooks).length > 0) {
    return res.status(200).send(JSON.stringify(titleBooks, null, 4));
  } else {
    return res.status(200).send(`No books found with title '${title}'.`);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const match = books[isbn];
  if (match) {
    return res.status(200).send(JSON.stringify(match.reviews, null, 4));
  } else {
    return res.status(200).send(`ISBN ${isbn} not found.`);
  }});

module.exports.general = public_users;
