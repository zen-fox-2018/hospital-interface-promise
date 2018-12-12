const Employee = require('./Employee.js')
const Patient = require('./Patient.js')
const View = require('./View.js')

class EmployeeController {
  static register(options) {
    let lastId = 0
    let totalEmployee = 0
    let obj = {
      username: options[0],
      password: options[1],
      role: options[2]
    }
    let newEmployee = new Employee(obj)
    newEmployee.save()
      .then(function(data) {
        lastId = data.lastID
        return Employee.findAll()
      })
      .then(function(rows) {
        totalEmployee = rows.length
        View.registerSuccess(obj, totalEmployee)
      })
      .catch(function(err) {
        View.error(err)
      })
  }

  static login(options) {
    let objCheck = {
      field: "isLogin",
      value: Number(1)
    }

    let obj = {
      field: "username",
      value: `"${options[0]}"`
    }

    let loginUser = null
    let loginObj = null

    Employee.findOne(objCheck)
      .then(function(row) {
        if (Object.keys(row).length !== 0) {
          View.loginFailed()
        }
        else {
          return Employee.findOne(obj)
        }
      })
      .then(function(row) {
        if (Object.keys(row).length === 0) {
          View.wrongUsername()
        }
        else {
          loginUser = row
          if (loginUser.password === options[1]) {
            loginObj = {
              field: "isLogin",
              value: 1
            }
            return loginUser.update(loginObj)
          }
          else {
            View.wrongPassword()
          }
        }
      })
      .then(function(data) {
        if (data.changes === 1) {
          View.loginSucces(options[0])
        }
        else {
          View.loginFailed()
        }
      })
      .catch(function(err) {
        View.error(err)
      })
  }

  static addPatient(options) {
    let objCheck = {
      field: "isLogin",
      value: 1
    }

    let obj = null

    Employee.findOne(objCheck)
      .then(function(row) {
        if (Object.keys(row).length === 0) {
          View.pleaseLogin()
        }
        else {
          if (row.role !== "dokter") {
            View.pleaseLoginDoctor()
          }
          else {
            obj = {
              name: options[0],
              diagnosis: options.slice(1).join(",")
            }
            let newPatient = new Patient(obj)
            return newPatient.save()
          }
        }
      })
      .then(function(data) {
        if (data.changes === 1) {
          return Patient.findAll()
        }
        else {
          View.error('Something went wrong while adding patient')
        }
      })
      .then(function(rows) {
        View.addPatientSuccess(rows.length)
      })
      .catch(function(err) {
        View.error(err)
      })
  }

  static logout(options) {
    let objCheck = {
      field: "isLogin",
      value: Number(1)
    }

    let logoutObj = {
      field: "isLogin",
      value: 0
    }

    let dataLogout = null

    Employee.findOne(objCheck)
      .then(function(row) {
        if (Object.keys(row).length === 0) {
          View.alreadyLogout()
        }
        else {
          dataLogout = row
          return dataLogout.update(logoutObj)
        }
      })
      .then(function(data) {
        if (data.changes === 1) {
          View.logoutSucces()
        }
        else {
          View.logoutFailed()
        }
      })
      .catch(function(err) {
        View.error(err)
      })
  }
}

module.exports = EmployeeController