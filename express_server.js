const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const res = require("express/lib/response");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.post("/urls/urls/:shortURL/EDIT", (req, res) => {
  const shortURL = req.params.shortURL;
  let newlongURL = Object.values(req.body)[0];
  urlDatabase[shortURL] = newlongURL;
  res.redirect('/urls')
});

app.post("/login", (req, res) => {
  let username =req.body.username;
  res.cookie('username', username);
  res.redirect('/urls')
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
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
  const templateVars = { username: req.cookies.username }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});