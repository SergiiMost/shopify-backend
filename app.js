const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const cookieSession = require('cookie-session')

const indexRouter = require('./routes/index')
const logInRouter = require('./routes/log-in')
const githubCallbackRouter = require('./routes/github-callback')
const errorRouter = require('./routes/error')
const logOutRouter = require('./routes/log-out')
const accountRouter = require('./routes/account')
const imageRouter = require('./routes/image')
const app = express()
dotenv.config()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  cookieSession({
    name: 'session',
    maxAge: 6.048e8,
    secret: process.env.COOKIE_SECRET,
  })
)

app.use('/', indexRouter)
app.use('/log-in', logInRouter)
app.use('/github/callback', githubCallbackRouter)
app.use('/error-page', errorRouter)
app.use('/log-out', logOutRouter)
app.use('/account', accountRouter)
app.use('/image', imageRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
