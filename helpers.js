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

getLongURL(database, id) {
  for (let item in database) {
    if (item === id) {
      let info = database[id];
      return info.longURL;
    }
  }
},

editedURL(database, id, newURL) {
  for (let item in database) {
    let entry = database[item];
    if (item === id) {
      entry.longURL = newURL;
    }
  }
},
checkShortURL(urlDatabase, id) {
  for (let i in urlDatabase) {
    if (id === i) {
      return true;
    }
  }
},
getShortURL(database, longURL) {
  for (let item in database) {
    let entry = database[item];
    if (entry.longURL === longURL) {
      return item;
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
},
ownedURL(database, user, id) {
  for (let item in database) {
    let account = database[item];
    if (account.userID === user && item === id) {
      return true;
    }
  }
}
};


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
