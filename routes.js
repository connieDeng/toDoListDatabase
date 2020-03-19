const util = require('util');
const axios = require("axios");
const cookieParser = require('cookie-parser');
const db = require('./connection');
const { checkToken } = require("./token_validation");
const { sign } = require("jsonwebtoken");

require('dotenv').config;
const TODO_API_URL = "https://hunter-todo-api.herokuapp.com";
var loggedinUser = [];

module.exports =  (app) => {
    app.use(cookieParser());

    //login page
    app.get("/", (req, res) => {
        res.render("login-page");
    });
    
    //home page when authorized
    app.get('/home', function (req, res, next) {
		res.render('home');
    })
    
    //sign up page
    app.get('/signup', function (req, res, next) {
		res.render('sign-up');
    });

    //sign up
    app.post('/signup', async function (req, res, next) {
        const newTargetUsername = req.body.inputNewUsername;
        console.log(newTargetUsername);

        db.query('SELECT * FROM users WHERE username = ?', newTargetUsername, (err, rows, fields) => {
            //if user doesnt exist
            if (rows.length){
                res.render('sign-up', {
                    message: 'User ' + newTargetUsername + ' already exists, try another username.',
                    //messageClass: 'alert-danger'
                });
            } else {
                db.query('INSERT INTO users (username) VALUES ( \'' + newTargetUsername + '\' )', (err, rows, fields) => {});
                res.render('login-page', {
                    message: 'User ' + newTargetUsername + ' successfully created. Login!',
                })

            }
        })
    });

    //login page
    app.get('/login', function (req, res, next) {
		res.render('login-page');
    });

    //get all users
    app.get('/users', (req, res) => {
        db.query('SELECT * FROM users', (err, rows, fields) => {
            res.send(rows);
        })
    });

    //login
    app.post('/login', (req, res, next) => {
        const targetUsername = req.body.inputUsername;
        //console.log(targetUsername);

        //const allUsers = (await 
            db.query('SELECT * FROM users WHERE username = ?', targetUsername, (err, rows, fields) => {
                console.log(rows);
                //if user doesnt exist
                if (!rows.length){
                    res.render('login-page', {
                        message: 'Invalid username or password',
                        //messageClass: 'alert-danger'
                        });
                } else {
                    loggedinUser.push([targetUsername, rows[0].id]);
                    
                    const jsontoken = sign({ token: rows[0].id }, "qwe1234"); //key is qwe1234
                    console.log(jsontoken);
                    db.query('SELECT * FROM tasks WHERE user_id = ?', rows[0].id, (terr, trows, tfields) => {
                        var taskObj = JSON.parse(JSON.stringify(trows));
                        //console.log(taskObj);
                        res.cookie('authToken', jsontoken);
                        res.render("home", { username: targetUsername, content : taskObj });
                    })

                }
            })
    });

    //add new task
    app.post('/addNewTask', checkToken, (req, res) => {
        const newTask = req.body.inputNewTask;
        db.query('INSERT INTO tasks (content, deleted, completed, user_id) ' +
        'VALUES (\'' + newTask + '\' , 0, 0, ' + loggedinUser[0][1] + ' )', (err, rows, fields) => {});

        db.query('SELECT * FROM tasks WHERE user_id = ?', loggedinUser[0][1], (terr, trows, tfields) => {
            var taskObj = JSON.parse(JSON.stringify(trows));
            //console.log(taskObj);
            res.render("home", { username: loggedinUser[0][0], content : taskObj });
        })
    });

    //delete task
    app.post('/deleteTask', checkToken, (req, res) => {
        const taskID = req.body.taskID;
       
        db.query('UPDATE tasks SET deleted = 1 WHERE id = ?', taskID, (err, rows, fields) => {})

        db.query('SELECT * FROM tasks WHERE user_id = ?', loggedinUser[0][1], (terr, trows, tfields) => {
            var taskObj = JSON.parse(JSON.stringify(trows));
            //console.log(taskObj);
            res.render("home", { username: loggedinUser[0][0], content : taskObj });
        })
    });

    app.post('/complete', checkToken, (req, res) => {
        const taskID = req.body.taskID;

        db.query('UPDATE tasks SET completed = 1 WHERE id = ?', taskID, (err, rows, fields) => {})

        db.query('SELECT * FROM tasks WHERE user_id = ?', loggedinUser[0][1], (terr, trows, tfields) => {
            var taskObj = JSON.parse(JSON.stringify(trows));
            //console.log(taskObj);
            res.render("home", { username: loggedinUser[0][0], content : taskObj });
        })
    });

    //logout
    app.get('/logout', (req, res) => {
        //clear cookie
        res.clearCookie('authToken');
        
        //clear loggedinUser
        loggedinUser = [];

        res.render('login-page', {
            message: 'Successfully logged out',
            //messageClass: 'alert-danger'
        });
    });

    require('./algo.js')(app);
}; 