const functions = {
  getID(database, email) {
    for (let item in database) {
      let user = database[item];
      if (user.email === email) {
        return user.id;
      }
   }
  },

generateString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
},

 addURL(urlDatabase, longURL, userID) {
  if (longURL) {
    let shortURL = this.generateString();
    urlDatabase[shortURL] = {longURL: longURL, userID: userID};
    return urlDatabase;
  }
},

findEmail(database, newEmail) {
  for (let id in database) {
    let user = database[id];
    if (newEmail === user.email) {
      return true;
    }
  }
},

getLongURL(database, shortURL) {
  for (let item in database) {
    if (item === shortURL) {
      let info = database[shortURL];
      return info.longURL;
    }
  }
},

editedURL(database, shortURL, newURL) {
  for (let item in database) {
    let entry = database[item];
    if (item === shortURL) {
      entry.longURL = newURL;
    }
  }
},
checkShortURL(urlDatabase, shortURL) {
  for (let i in urlDatabase) {
    if (shortURL === i) {
      return true;
    }
  }
},
filteredURL(database, name) {
  let returnObj = {};
  for (let i in database) {
    let x = database[i];
    if (x.userID === name) {
      returnObj[i] = x;
    }
  } return returnObj;
}
}

module.exports = functions

// const emailPassword = function(database, email, password) {
//   for (let id in database) {
//     let user = database[id];
//     if (email === user.email) {
//       if (password === user.password) {
//         return true;
//       }
//     }
//   }
// };
