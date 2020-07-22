## Employee Tracker Overview

This CLI allows the user to keep track of employees

The user will first run "node tracking_infoCRUD.js"

They will then be prompted with a set of questions

They are able to add or view employees, roles and departments as well as update an employee's role

Once they finish adding the requested information, they will be able to view it by selecting one of the view options

## Pseudo Code

The schema.sql file contains three seperate tables consisting of:

1. Department
  - Name

2. Role
  - Title
  - Salary
  - Department ID

3. Employee
  - First Name
  - Last Name
  - Role ID
  - Manager ID

The tracking_infoCRUD JS file conatins all the necessary functions 

The displayQuestions function initially prompts the user with the first set of questions using inquirer

Depending on what the user selects:

- Add Department - addDeparments()
- Add Role - addRoles()
- Add Employee - createNewEmployee() then addEmployee
- View Departments - viewDepartments() 
- View Roles - viewRoles()
- View Employees - viewEmployees()
- Update Employee Role - updateEmployees()

 The proper function will then be called within the displayQuestions function through a series of if else statements and the user will be able to exectue their desired task






