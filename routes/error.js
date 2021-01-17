const express = require('express')
const router = express.Router()

/*Error page*/
router.get('/', function (req, res, next) {
  const userName = req.session.userName
  res.render('error-page', { loggedIn: userName ? true : false })
})

module.exports = router
