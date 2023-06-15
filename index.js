
// Express and Node initialization
const express = require('express')
const bodyParser = require('body-parser')
const { timeout } = require('nodemon/lib/config')
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended : true}))

// Data and data store
const USER = []
const ADMIN = []
const SIGNUP = {}

const QUESTION = [{
  title: "Two States",
  description: "Given an array, return the maximum of the Array",
  testCases: [{
      input: "[1, 2, 3, 4, 5]",
      output: "5"
  }]
}]



const SUBMISSION = []

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/signup', (req, res)=>{

  // Getting the email and password from the form via POST method
  let email = req.body.email
  let pwd = req.body.pwd
  const admin_status = req.body.admin_status

  


  // Checking if the email aready exist, if yes then don't include, else save it
  if(USER.includes(email)){
    res.send(`<h2>User already exists<h2/>`)
  }
  else{
    if(admin_status == "admin") ADMIN.push(email) // Only admins are added
    USER.push(email)
    SIGNUP[email] = pwd
  }

  // return back 200 status code to the client.
  res.send("<h1>Status Code 200</h1>")
  console.log(ADMIN)
  


})


app.get('/signin', (req, res) => {
  res.sendFile(__dirname + '/signin.html')
})


app.post('/signin', (req, res) =>{

  // Check if the entered email already exist in the USER array or not.
  // Also check if the password is same or not.
  let email = req.body.email;
  let pwd  = req.body.pwd;

  if(USER.includes(email)){
    if(SIGNUP[email] == pwd){
      let token = email.substring(0, email.indexOf("@")) + "lc_tk"
      res.write("<h1>Status code 200</h1>")
      res.write(`<h3>Your token is: ${token}<h3>`)
      res.send()
    }
    else{
      res.send("Incorrect Password")
    }
  }
  else{
    res.write("<h1>Status code 401</h1>")
    res.write("<h2>Email doesn't exisits.</h2>")
    res.end()
  }

  console.log(SIGNUP)


  // If the password is same, return back 200 status code to the client.
  // Also send back a token_any random
  //If the password is not same return 401 status code to the client.
})

app.get('/Allquestions', (req, res)=>{

  res.sendFile(__dirname + '/question.html')

  // returns all the question.

})

app.get('/Question_2States', (req, res)=>{

  // Return Question 2_States
    res.send(QUESTION)
})



app.get('/submissions', (req,res)=>{

  // let the user submit a problem, randomly AC or Reject the solution.
  // Store the submission in the SUBMISSION Array Above
  res.sendFile(__dirname + "/answer.html")
})


app.post('/submissions', (req, res)=>{
  let ans = req.body.ans
  console.log(ans);

  let check = ans.indexOf('#');

  if(check!= -1){
    res.send("<h1>Accepted</h1>")
  }
  else{
    res.send("<h1>Not Accepted</h1>")
  }
})

// A hard to do
// Create a new route, that lets admins submit a question.
// Ensure only admins can do that.

app.get('/addQuestion', (req, res)=>{
  res.sendFile(__dirname + '/add_Question.html')
})

app.post('/addQuestion', (req, res)=>{
  let email = req.body.email
  let pwd = req.body.pwd

  if(USER.includes(email)){
    if(SIGNUP[email] == pwd){
      if(ADMIN.includes(email)){
        res.sendFile(__dirname + '/question_adder.html')


        // Adding this post method to get questions from the Admin
        app.post('/getQuestion', (req, res)=>{
            
            let ttle = req.body.title
            let des = req.body.des
            let ip =req.body.input
            let op = req.body.output

            let add_q = {
              Title: ttle,
              Description: des,

              testCases: [{
                input: ip.split(" "),
                output: op
              }]

            }

            QUESTION.push(add_q)
            res.send(`<h2>Question ${ttle} added Successfully</h2>`)
            
        })

      }
      else res.send(`<h2>You are not an admin</h2>`)
    }
  }
  else{
    res.send("<h2>You don't have an account</h2>")
  }
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})