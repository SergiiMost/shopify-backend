const express = require('express')
const router = express.Router()
const multer = require('multer')
const nanoid = require('nanoid').nanoid
const GridFsStorage = require('multer-gridfs-storage')
const auth = require('../middleware/auth')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const storage = new GridFsStorage({
  url: `mongodb+srv://sergiimost:${process.env.MONGODB_PASSWORD}@cluster0.dzwcw.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    const filename = file.originalname
    const name = filename.slice(0, filename.lastIndexOf('.'))
    const type = filename.slice(filename.lastIndexOf('.'))
    console.log(file)
    return {
      filename: `${name}-${nanoid(4)}${type}`,
    }
  },
})

const upload = multer({ storage })

//Account GET request
router.get('/', async function (req, res, next) {
  try {
    const userName = req.session.userName
    if (!userName) {
      return res.redirect('/log-in')
    }
    const db = req.app.locals.db
    let cursor = await db.collection('images').find({ userName: userName }).sort({ _id: -1 })
    let documents = []
    await cursor.forEach((document) => {
      documents.push(document)
    })
    res.render('account', { loggedIn: userName ? true : false, userName: userName, documents: documents })
  } catch (err) {
    next(err)
  }
})

// Upload GET request
router.get('/upload', function (req, res, next) {
  const userName = req.session.userName
  if (!userName) {
    return res.redirect('/log-in')
  }
  res.render('account-upload', { loggedIn: userName ? true : false, userName: userName })
})

// Upload POST request
router.post('/upload', auth, upload.single('fileInput'), async function (req, res, next) {
  try {
    const db = req.app.locals.db
    await db.collection('images').insertOne({
      userName: req.session.userName,
      image: req.file.filename,
      uploadDate: req.file.uploadDate,
      permission: req.body.permission,
      tags: req.body.tags.split(','),
      id: nanoid(8),
    })
    res.send('got it')
  } catch (err) {
    next(err)
  }
})

module.exports = router
