const functions = require('./helpers.js');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));
const { response } = require("express");
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'user_id',
  keys: ["some", "secret", "keys"],
}));
app.use(morgan('dev'));
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
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

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

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = { user_id: req.session.user_id, users: users };
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send(res.redirect('/login'));
  }
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { user_id: req.session.user_id, longURL: functions.getLongURL(urlDatabase, req.params.id), users: users, id: req.params.id };
  let userID = req.session.user_id;
  let shortURL = req.params.id;
  if (userID) {
    if (functions.ownedURL(urlDatabase, userID, shortURL)) {
      res.render('urls_show', templateVars);
    } else {
      res.render('url_notexist', templateVars);
    }
  } else {
    res.render('urls_loggedOff', templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const templateVars = { user_id: req.session.user_id, longURL: functions.getLongURL(urlDatabase, req.params.id), users: users, id: req.params.id };
  if (functions.checkShortURL(urlDatabase, req.params.id)) {
    const longURL = functions.getLongURL(urlDatabase, req.params.id);
    res.redirect(longURL);
  } else {
    res.status(404).render('url_notexist', templateVars);
  }
});

app.post("/urls/", (req, res) => {
  if (req.session.user_id) {
    functions.addURL(urlDatabase, req.body.longURL, req.session.user_id);
    res.redirect('/urls/');
  } else {
    res.status(401).render('urls_loggedOff');
  }
});

app.post("/urls/:id", (req, res) => {
  if (req.session.user_id) {
    const id = req.params.id;
    let newlongURL = Object.values(req.body)[0];
    functions.editedURL(urlDatabase, id, newlongURL);
  }
  if (!req.session.user_id) {
    res.status(401).render('urls_loggedOff');
  }
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id) {
    if (functions.ownedURL(urlDatabase, req.session.user_id, req.params.id)) {
      const id = req.params.id;
      delete urlDatabase[id];
      res.redirect('/urls');
    }
  } else {
    res.status(401).render('urls_loggedOff');
  }
});

app.get("/login", (req, res) => {
  const templateVars = { users: users, user_id: req.session.user_id };
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.render('login_form', templateVars);
  }
});

app.get("/register", (req, res) => {
  const templateVars = { user_id: req.session.user_id, users: users };
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.render("urls_register", templateVars);
  }
});

app.post("/login", (req, res) => {
  const templateVars = { user_id: req.session.user_id, users: users };
  let loginItem = req.body.email;
  let pass = req.body.password;
  for (let data in users) {
    let user = users[data];
    if (user.email === loginItem) {
      const result = bcrypt.compareSync(pass, user.password);
      if (result) {
        req.session.user_id = (functions.getID(users,loginItem));
        console.log(req.session.user_id);
        res.redirect('/urls');
      } else {
        res.status(401).render('login_error', templateVars);
      }
    } if (pass === "") {
      res.status(401).render('login_error', templateVars);
    }
  }
});

app.post("/register", (req, res) => {
  const templateVars = { user_id: req.session.user_id, users: users };
  if (!functions.findEmail(users,req.body.email)) {
    if (req.body.email !== "" && req.body.password !== "") {
      let newId = functions.generateString();
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      users[newId] = {
        id: newId,
        email: req.body.email,
        password: hashedPassword
      };
      req.session.user_id = newId;
      res.redirect('/urls');
    } else {
      res.render('register_empty', templateVars);
    }
  } else {
    res.render('register_error', templateVars);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
