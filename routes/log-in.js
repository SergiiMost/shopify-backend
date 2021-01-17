const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  const userName = req.session.userName
  res.render('log-in', { loggedIn: userName ? true : false })
})

router.get('/github', function (req, res, next) {
  const redirect_uri = 'http://localhost:3000/github/callback'
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=read:user`
  )
})

module.exports = router
