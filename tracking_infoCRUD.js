var mysql = require("mysql");
var inquierer = require("inquirer");
const { title } = require("process");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "libby4193!",
    database: "tracking_infoDB"
  });

 

 connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    
    displayQuestions();
  });


function displayQuestions() {
    inquierer.prompt([
        {
            type: "list",
            message: "Would you like to enter a department, role, or employee?",
            name: "choice",
            choices: ["view departments", "view roles", "view employees", "add department", "add role", "add employee", "update employee role", "exit"  ]
      },
     ]).then(function(response){
        //  console.log(response.choice)
         if(response.choice === "view departments"){
        viewDepartments()
         }
         else if(response.choice === "add department"){
             addDepartments()
         } 
         else{
             connection.end()
         }
     })
}

function viewDepartments() {
    console.log("view departments")
    connection.query("select * from department", function(err, res) {
        console.table(res)
        displayQuestions()
    })
}

function addDepartments() {
    inquierer.prompt([{

        type: "input",
        message: "What department would you like to add?",
        name: "Departmentname"
    }
    
    ]).then(function (response) {
        connection.query("Insert into department set ?", { name: response.Departmentname}, function(err, res) {
            console.log(res.affectedRows + " department inserted")
            displayQuestions()
        })
    })
    
}