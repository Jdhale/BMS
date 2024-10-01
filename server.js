const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session'); // Import express-session
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
    secret: '12344', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up Handlebars view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false, partialsDir: path.join(__dirname, 'views', 'partials') }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const adminRouter = require('./routes/admin_dash');
const userRouter = require('./routes/user_dash');
const add_userRouter = require('./routes/adduser');
const deleteUserRouter=require('./routes/deleteuser');
const viewUserRouter=require('./routes/viewUsers');
const viewTransactionRouter=require('./routes/viewTransaction')
// Use routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/admin_dash', adminRouter);
app.use('/user_dash', userRouter);
app.use('/adduser',add_userRouter);
app.use('/deleteuser',deleteUserRouter);
app.use('/viewUsers',viewUserRouter);
app.use('/viewTransaction',viewTransactionRouter);
// Default route
app.get('/', (req, res) => {
    res.render('login');
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
