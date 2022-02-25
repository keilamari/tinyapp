const functions = require('./helpers.js')
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));
const { response } = require("express");
const bcrypt = require('bcryptjs');
const morgan = require('morgan')
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'user_id',
  keys: ["some", "secret", "keys"],
}))
app.use(morgan('dev'))


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "frodo"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "bilbo"
  },
  "9s10vrj": {
    longURL: "http://www.reddit.com",
    userID: "bilbo"
  },
  "93fdj3": {
    longURL: "http://www.cbc.ca",
    userID: "frodo"
  }
};

const users = {
  "frodo": {
    id: "frodo",
    email: "frodo@baggins.ca",
    password: "oh-sam"
  },
  "bilbo": {
    id: "bilbo",
    email: "bilbo@baggins.ca",
    password: "my-precious"
  }
};


app.get("/", (req, res) => {
  res.redirect('/urls/');
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });


app.get("/urls", (req, res) => {
  if (req.session.user_id) {
    let userURL = functions.filteredURL(urlDatabase, req.session.user_id);
    const templateVars = {urls: userURL, user_id: req.session.user_id, users: users };
    res.render("urls_index", templateVars);
  } else {
    const templateVars = { urls: urlDatabase, user_id: req.session.user_id, users: users };
    res.render("urls_loggedOff", templateVars);
  }
});


app.get("/urls/profile/:id", (req, res) => {
  let userURL = functions.filteredURL(urlDatabase, req.params.id);
  const templateVars = {urls: userURL, user_page: req.params.id, users: users, user_id: req.session.user_id};
  res.render("urls_user", templateVars);
});


app.get("/login", (req, res) => {
  const templateVars = { users: users, user_id: req.session.user_id };
  res.render("login_form", templateVars);
});


app.post("/urls/urls/:shortURL/EDIT", (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    let newlongURL = Object.values(req.body)[0];
    functions.editedURL(urlDatabase, shortURL, newlongURL);
  }
  if (!req.session.user_id) {
    res.status(401).send("Please log in to edit");
  }
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  let loginItem = req.body.email;
  let pass = req.body.password;
  for (let data in users) {
    let user = users[data];
    if (user.email === loginItem) {
      const result = bcrypt.compareSync(pass, user.password);
      if (result) {
      req.session.user_id = (functions.getID(users,loginItem));
      console.log(req.session.user_id)
      res.redirect('/urls');
      } else {
        res.status(401).send(res.redirect('/register'));
    } 
    }
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


app.post("/urls/", (req, res) => {
  if (req.session.user_id) {
    functions.addURL(urlDatabase, req.body.longURL, req.session.user_id);
    res.redirect(`/urls`);
  } else {
    res.status(401).send(res.redirect('/login'));
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send('Please login to delete');
  }
});

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = { user_id: req.session.user_id, users: users };
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send(res.redirect('/login'));
  }
});

app.get("/register", (req, res) => {
  const templateVars = { user_id: req.session.user_id, users: users };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let newEmail = (req.body.email);
  let newPassword = req.body.password;
  if (functions.findEmail(users, newEmail) || newEmail === "" || newPassword === "") {
    res.status(400).send('400: Please check email/password');
  } else {
    let newId = functions.generateString();
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    users[newId] = {
      id: newId,
      email: newEmail,
      password: hashedPassword
    };
    console.log(users)
    req.session.user_id = newId;
  }
  res.redirect('/urls');
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: functions.getLongURL(urlDatabase, req.params.shortURL), user_id: req.session.user_id, users: users };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (functions.checkShortURL(urlDatabase, shortURL)) {
    const longURL = functions.getLongURL(urlDatabase, req.params.shortURL);
    console.log(req.params.shortURL);
    res.redirect(longURL);
  } else {
    res.status(404).send('URL not logged');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});