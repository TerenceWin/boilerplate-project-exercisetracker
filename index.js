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
let exercise = []; 
let log = []; 
let userid = 0; 

app.post('/api/users', (req, res) => {
  const uname = req.body.username; 
  userid++; 

  if(!uname){
    res.json({
      error: "Please enter an username"
    })
  }else{
    users.push({
      username: uname,
      id: userid
    }); 

    res.json({
      username: uname,
      id: userid
    })
  }
}); 

app.get('/api/allusers', (req, res) => {
  if(!users){
    res.json({
      error: "There are no users"
    });
  }else{
    res.json({
      "All users": users
    });
  }
}); 

app.post('/api/users/:_id/exercises', (req, res) => {
  let input_id = parseInt(req.params._id); 
  let newDescription = req.body.description; 
  let newDuration = parseInt(req.body.duration); 
  let newDate = new Date(req.body.date).toDateString(); 

  if(!(input_id && newDescription && newDuration && newDate)){
    res.json({
      error: "Please fill in all the information"
    })
  }else{
    const searchUser = users.find(user => user.id === input_id); 
    if(!searchUser){
      res.json({
        error: "There is no user with the provided id."
      }); 
    }else{
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

/*
Exercise:
{
  username: "fcc_test",
  description: "test",
  duration: 60,
  date: "Mon Jan 01 1990",
  _id: "5fb5853f734231456ccb3b05"
}
User:

{
  username: "fcc_test",
  _id: "5fb5853f734231456ccb3b05"
}
Log:

{
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }]
}
*/




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
