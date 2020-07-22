var mysql = require("mysql");
var inquierer = require("inquirer");
const { title } = require("process");
const { error } = require("console");

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

// fuction to display initial prompt of questions
  function displayQuestions() {
    inquierer.prompt([
        {
            type: "list",
            message: "Would you like to enter a department, role, or employee?",
            name: "choice",
            choices: ["view departments", "view roles", "view employees", "add departments", "add roles", "add employees", "update employee role", "exit"  ]
      },
     ]).then(function(response){
        //  console.log(response.choice)
         if(response.choice === "view departments"){
            viewDepartments();
         } else if(response.choice === "add departments"){
             addDepartments();
         } else if(response.choice === "add roles"){
            addRoles();
        } else if(response.choice === "view roles"){
            viewRoles();
        } else if(response.choice === "view employees"){
            viewEmployees();
        } else if(response.choice === "add employees"){
            addEmployees();
        } else if(response.choice === "update employee role"){
            updateEmployees();
        } else {
             connection.end()
         }
     })
}

// using a promise to grab departments 
function fetchDepartments() {
    return new Promise(function (resolve, reject) {
        connection.query("select * from department", function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
            
        });
    });
}
// promise that returns the array of departments
async function viewDepartments() {
    console.log("view departments");
    try {
        let res = await fetchDepartments();
        console.table(res);
        displayQuestions();
    } catch (err) {
        console.log('error:', err);
    }
}
// allows user to add departments 
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
// allows users to view roles 
function viewRoles() {
    console.log("View Roles")
    connection.query("SELECT title, salary, department.name FROM role INNER JOIN department ON role.department_id = department.id", function(err, res) {
        console.table(res)
        displayQuestions()
    })
}


// allows user to add roles
async function addRoles() {
    let departments = await fetchDepartments();
    inquierer.prompt([{

        type: "input",
        message: "What is the role title?",
        name: "title"
    },
    {
        type: "input",
        message: "What is the salary?",
        name: "salary"
    },
    {
        type: "list",
        message: "Which department does this new role belong to?",
        name: "department",
        choices: departments.map(department => department.name)  
    }
    
    ]).then(function (response) {
        let departmentId;
        departments.forEach(department => {
            if (department.name === response.department) {
                departmentId = department.id;
            }
        })
        console.log(departmentId);
        connection.query("Insert into role set ?", { title: response.title, salary:response.salary, department_id: departmentId}, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.affectedRows + " role inserted")
                displayQuestions()
            }
        })
    })
    
}




  
// allows user to view employees
function viewEmployees() {
    console.log("view employee")
    connection.query("select employee.id, first_name, last_name, role.title, manager_id from employee INNER JOIN role ON employee.role_id = role.id", function(err, res) {
        console.log(err);
        console.table(res)
        displayQuestions()
    })
}

// adds the new employee
function addEmployees() {
    connection.query("select * from role", function(err, res) {
        createNewEmployee(res)
    })    
}


//creates the new employee
function createNewEmployee(roles) {
    let titles = roles.map(role => role.title)
    let ids = roles.map(role => role.id)
    inquierer.prompt([{

        type: "input",
        message: "What is the employee's first name?",
        name: "Firstname"
    },
    {

        type: "input",
        message: "What is the employee's last name?",
        name: "Lastname"
    },
    {

        type: "list",
        message: "What is the employees role?",
        name: "Employeerole",
        choices: titles
    },
    {

        type: "input",
        message: "If the employee is a manager, what is their manager ID?",
        name: "Managerid"
    }
    
    ]).then(function (response) {
        let i = titles.indexOf(response.Employeerole)
        connection.query("Insert into employee set ?", { first_name: response.Firstname, last_name: response.Lastname, role_id: ids[i], manager_id: response.Managerid }, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.affectedRows + " employee inserted")
            displayQuestions()

        }
    })

    })
    
}

// allows user to update employee
function updateEmployees() {
    connection.query("select * from employee", function(err, employees) {
        connection.query("SELECT * FROM role ", function(err, roles) {
            let empTable = {}
            employees.forEach(emp => {
                empTable[emp.first_name + " " + emp.last_name] = emp.id 
            })
            let fullNames = Object.keys(empTable)
            inquierer.prompt([{

                type: "list",
                message: "Select the employee you would like to update the role for?",
                name: "Employee",
                choices: fullNames
            }])
            .then(empAnswers => {
                let titles = roles.map(role => role.title)
                let ids = roles.map(role => role.id)
                inquierer.prompt([{

                    type: "list",
                    message: "Select new role?",
                    name: "role",
                    choices: titles
                }])
                .then(roleAnswers => {
                    let empId = empTable[empAnswers.Employee]
                    let i = titles.indexOf(roleAnswers.role)
                    connection.query(`UPDATE employee SET role_id = ${ids[i]} WHERE id = ${empTable[empAnswers.Employee]}`, function(err, employees) {
                        if(err) console.log(err)
                        displayQuestions();
                    })
                })
        
            })
        })
    })    
}