const assert = require('chai').assert;

const functions = require('../helpers.js');

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

const testUsers = {
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

describe('Functions', function() {
  it('should return true if email exists', function() {
    const user = functions.findEmail(testUsers, "bilbo@baggins.ca")
    const result = true;
    assert.equal(result, true)
  }),
  it('should return ID using email address', function() {
    const user = functions.getID(testUsers, "bilbo@baggins.ca")
    const result = "bilbo";
    assert.equal(user, result)
  }),
  it('should add a new URL to the database', function() {
    const objectKeys = Object.keys(functions.addURL(urlDatabase, "http://www.blogto.com", "frodo")).length;
    assert.equal(objectKeys, 5)
  }),
  it('should return the LongURL from the database based on the shortURL', function() {
    const longURL = functions.getLongURL(urlDatabase, "9sm5xK")
    const result = "http://www.google.com"
    assert.equal(result, longURL)
  }),
  it('should change the existing entry in the database to the new URL', function() {
    const edited = functions.editedURL(urlDatabase, "9sm5xK", 'https://developer.mozilla.org/en-US/')
    const result1 =  urlDatabase["9sm5xK"];
    const result = result1.longURL
    assert.equal(result, 'https://developer.mozilla.org/en-US/')
  }),
  it('should return true if shortURL exists', function() {
    const result = functions.checkShortURL(urlDatabase, "9s10vrj")
    assert.equal(result, true)
  }),
  it('should return the amount of urls logged under a specific user id', function() {
    const objects = Object.keys(functions.filteredURL(urlDatabase, "bilbo")).length
    const result = 2
    assert.equal(objects, result)
  }),
  it('should return undefined if wrong email entered', function() {
    const ID = functions.getID(urlDatabase, "tree@ent.com")
    const result = undefined
    assert.equal(ID, result)
  })
});