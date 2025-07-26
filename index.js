const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({extended: true}));

let users = []; 

app.post('/api/users', (req, res) => {
  const uname = req.body.username; 
  const uniqueId = Math.random().toString(36).substring(2)+ Date.now().toString(36); 

  if(!uname){
    res.json({
      error: "Please enter an username"
    })
  }else{
    users.push({
      username: uname,
      _id: uniqueId,
      count: 0,
      log: []
    }); 

    res.json({
      username: uname,
      _id: uniqueId
    })
  }
}); 

app.get('/api/users', (req, res) => {
  if(!users){
    res.json({
      error: "There are no users"
    });
  }else{
    res.json(users);
  }
}); 

app.post('/api/users/:_id/exercises', (req, res) => {
  let input_id = req.params._id; 
  let newDescription = req.body.description; 
  let newDuration = parseInt(req.body.duration); 
  let newDate; 

  if (!input_id || !newDescription || isNaN(newDuration)){
    res.json({
      error: "Please fill in all the information"
    })
  }else{
    const searchUser = users.find(user => user._id === input_id); 
    if(!searchUser){
      res.json({
        error: "There is no user with the provided id."
      }); 
    }else{
      if(!req.body.date){
        newDate = new Date().toDateString();
      }else{
        newDate = new Date(req.body.date).toDateString();
      }

      searchUser.count++; 
      searchUser.log.push({
        description: newDescription,
        duration: newDuration, 
        date: newDate
      })

      res.json({
        _id: input_id,
        username: searchUser.username,
        date: newDate,
        duration: newDuration, 
        description: newDescription
      });
    }
  }
}); 

app.get('/api/users/:_id/logs' , (req, res) => {
  const userId = req.params._id; 
  const {from, to, limit} = req.query; 

  const user = users.find(user => user._id === userId); 
  if(!user){
    return res.json({error: "User not found"}); 
  }

  if(!(from) && !(to) && !(limit)){
    return res.json({
      _id: user._id, 
      username: user.username,
      count: user.count,
      log: user.log
    }); 
  }; 

  let logs = [...user.log];

  if(from){
    const fromDate = new Date(from); 
    if(!isNaN(fromDate)){
      logs = logs.filter(entry => new Date(entry.date) >= fromDate); 
    }
  }

  if(to){
    const toDate = new Date(to); 
    if(!isNaN(toDate)){
      logs = logs.filter(entry => new Date(entry.date) <= toDate); 
    }
  }

  if(limit){
    const limitLog = parseInt(limit); 
    logs = logs.slice(0, limitLog);
  }

  return res.json({
    _id: user._id, 
    username: user.username,
    count: user.count,
    log: logs
  }); 
}); 



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
