const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
var cors = require('cors')
var ejs = require('ejs')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();


const app = express()
var cors = require('cors')
const sequelize = require('./config/database');
const User = require('./models/User');

app.set('view-engine', 'ejs')
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


sequelize.sync().then(() => console.log('db is ready'));


// // Render Html File
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'templates/index.html'));
// });


const router = require('./router');
app.use(router)

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on "+process.env.PORT || 3000);
});