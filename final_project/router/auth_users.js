const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username)=>{
  return (username in users);
}

const authenticatedUser = (username,password)=>{
  if (! isValid(username)) {
    return false;
  }
  return(users[username] === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (! authenticatedUser(username, password)) {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  };
  
  // Generate JWT access token
  let accessToken = jwt.sign({
      data: password
  }, 'access', { expiresIn: 60*60 });

  // Store access token and username in session
  req.session.authorization = {
      accessToken, username
  }
  return res.status(200).send("User successfully logged in");
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (! (isbn in books)) {
    return res.status(208).send(`Unknown ISBN ${isbn}`);
  }
  const review = req.query.review;
  if (! review) {
    return res.status(200).send("");
  }
  const user = req.session.authorization.username;
  books[isbn]["reviews"][user] = review;

  return res.status(200).send(`Review from '${user}' added for ISBN '${isbn}': '${review}'`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (! (isbn in books)) {
    return res.status(208).send(`Unknown ISBN ${isbn}`);
  }
  const user = req.session.authorization.username;
  if (user in books[isbn]["reviews"]) {
    delete books[isbn]["reviews"][user];
  }

  return res.status(200).send(`Review from '${user}' deleted for ISBN '${isbn}'.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
