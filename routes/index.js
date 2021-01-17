var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const userName = req.session.userName
  const db = req.app.locals.db
  let cursor = await db.collection('images').find({ permission: 'public' }).sort({ _id: -1 })
  let documents = []
  await cursor.forEach((document) => {
    documents.push(document)
  })
  res.render('index', { loggedIn: userName ? true : false, documents: documents })
})

module.exports = router
