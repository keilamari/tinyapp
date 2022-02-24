const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
const { response } = require("express");
app.use(cookieParser());


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  },
  "gandalf": {
    id: "gandalf",
    email: "thegrey@wizard.com",
    password: "ushallnotpass"
  }
};

const generateString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const findEmail = function(database, newEmail) {
  for (let id in database) {
    let user = database[id];
    if (newEmail === user.email) {
      return true;
    } 
  }
};

const emailPassword = function(database, email, password) {
  for (let id in database) {
    let user = database[id];
    if (email === user.email) {
      if(password === user.password) {
        return true;
      } else {
        return false;
      }
    }
  }
};

const getID = function(database, email) {
  for (let item in database) {
    let user = database[item];
    if (user.email === email) {
      return user.id;
    } 
  }
}

app.get("/", (req, res) => {
  res.redirect('/urls/');
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies.user_id, users: users };
  res.render("urls_index", templateVars);
});

app.post("/urls/urls/:shortURL/EDIT", (req, res) => {
  const shortURL = req.params.shortURL;
  let newlongURL = Object.values(req.body)[0];
  urlDatabase[shortURL] = newlongURL;
  res.redirect('/urls')
});

app.get("/login", (req, res) => {
  const templateVars = { user_id: req.cookies.user_id, users: users }
  res.render("login_form", templateVars);
})

app.post("/login", (req, res) => {
  let loginItem = req.body.email;
  let pass = req.body.password;
  if (findEmail(users, loginItem)) {
    if (emailPassword(users, loginItem, pass)) {
      res.cookie('user_id', (getID(users, loginItem)))
      res.redirect('/urls');
    } else {
      res.status(403).send('403: Forbidden')
    }
  } 
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


app.post("/urls", (req, res) => {
  let shortURL = generateString();
  res.redirect(`/urls/${shortURL}`);        
  urlDatabase[shortURL] = Object.values(req.body)[0];
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: req.cookies.user_id, users: users }
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { user_id: req.cookies.user_id, users: users }
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  let newEmail = (req.body.email);
  let newPassword = (req.body.password);
  if (findEmail(users, newEmail) || newEmail === "" || newPassword === "") {
    res.status(400).send('400: Bad Request')
  } else {
  let newId = generateString();
  users[newId] = {
    id: newId,
    email: newEmail,
    password: newPassword
  }
  res.cookie('user_id', newId);
  }
  res.redirect('/urls');
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: req.cookies.user_id, users: users };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});