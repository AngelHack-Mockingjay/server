var bpdyParser = require('body-parser')
var express = require('express');
var app = express();

let messageList = [],
    userObject = {}

const locale = ['en', 'zh-tw', 'zh-cn']

app.use(bpdyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('connect.');
});

// POST method route
app.post('/message', (req, res) => {
  const data = req.body
  if (data) {
  	const userID = data.userID,
  		  userName = data.userName,
  		  userMessage = data.userMessage,
  		  userPlatform = data.userPlateform,
  			createdOn = new Date().getTime()
    let isNewUser = false
  	let userOldTime
    if (!userObject[userID]) {
      userOldTime = createdOn
    	userObject = Object.assign({}, userObject, {
    		[userID]: {
          userPlatform: userPlatform,
          userName: `user-${Object.keys(userObject).length + 1}`,
          userLocale: randomArrayMessage(locale),
    			userUpdatedAt: createdOn
    		}
    	})
    	messageList.push({
        userID: userID,
    		userMessage: userMessage,
    		userPlatform: userPlatform,
    		createdOn: createdOn
    	})
      isNewUser = true
    } else {
    	userOldTime = userObject[userID].userUpdatedAt
      const userCurrLocale = userObject[userID].userLocale,
            userCurrName = userObject[userID].userName
			userObject = Object.assign({}, userObject, {
    		[userID]: {
          userPlatform: userPlatform,
          userName: userCurrName,
          userLocale: userCurrLocale,
    			userUpdatedAt: createdOn
    		}
    	})
      messageList.push({
        userID: userID,
    		userMessage: userMessage,
    		userPlatform: userPlatform,
    		createdOn: createdOn
    	})
      isNewUser = false
    }
    // const currentMessageList = messageList.filter(list => {
    // 	return (list.createdOn > userOldTime) || isNewUser
    // })
    res.sendStatus(200)
    // res.send(currentMessageList)
	}
});

app.get('/message/list', (req, res) => {
  const mergeObject = Object.assign({}, {
    userObject: userObject,
    messageList: messageList
  })
  res.send(mergeObject)
})

app.post('/message/user/update', (req, res) => {
  const data = req.body,
        userID = data.userID,
        userPlatform = data.userPlatform,
        createdOn = new Date().getTime(),
        userCurrLocale = userObject[userID].userLocale,
        userCurrName = userObject[userID].userName
  if (userObject[userID]) {
    userObject = Object.assign({}, userObject, {
      [userID]: {
        userPlatform: userPlatform,
        userName: userCurrName,
        userLocale: userCurrLocale,
        userUpdatedAt: createdOn
      }
    })
  }
  res.sendStatus(200)
})

app.listen(14433, (req, res) => {
	console.log('Server listen on port 14433')
})

function randomArrayMessage(messages) {
  return messages.sort(function() {
    return .5 - Math.random();
  })[0]
}
