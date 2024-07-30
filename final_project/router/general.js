const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password: password };

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here

//   res.status(200).json({ books: JSON.stringify(books, null, 2) });
// });

public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('https://tanishgupta1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books'); 
      res.status(200).json({ books: response.data });
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     res.status(200).json({ book: JSON.stringify(book, null, 2) });
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
//  });

 // Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`https://tanishgupta1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/${isbn}`); // Replace with actual URL if different
      res.status(200).json({ book: response.data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
      }
    }
  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     const booksByAuthor = [];
  
//     Object.keys(books).forEach(key => {
//       if (books[key].author === author) {
//         booksByAuthor.push(books[key]);
//       }
//     });
  
//     if (booksByAuthor.length > 0) {
//       res.status(200).json({ books: JSON.stringify(booksByAuthor, null, 2) });
//     } else {
//       res.status(404).json({ message: "No books found by this author" });
//     }
// });

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`https://tanishgupta1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`); // Replace with actual URL if different
      res.status(200).json({ books: response.data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "No books found by this author" });
      } else {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
      }
    }
  });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     const booksByTitle = [];
  
//     Object.keys(books).forEach(key => {
//       if (books[key].title === title) {
//         booksByTitle.push(books[key]);
//       }
//     });
  
//     if (booksByTitle.length > 0) {
//       res.status(200).json({ books: JSON.stringify(booksByTitle, null, 2) });
//     } else {
//       res.status(404).json({ message: "No books found with this title" });
//     }
// });

// Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const response = await axios.get(`https://tanishgupta1-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`); // Replace with actual URL if different
      res.status(200).json({ books: response.data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "No books found with this title" });
      } else {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
      }
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      res.status(200).json({ reviews: JSON.stringify(book.reviews, null, 2) });
    } else {
      res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
