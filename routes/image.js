const express = require('express')
const router = express.Router()

//Load Images
router.get('/load-image/:image', async function (req, res, next) {
  try {
    const gfs = req.app.locals.gfs
    gfs.files.findOne({ filename: req.params.image }, (err, file) => {
      // Check if file
      if (err) {
        console.log(err)
      }
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists',
        })
      }

      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename)
        readstream.pipe(res)
      } else {
        res.status(404).json({
          err: 'Not an image',
        })
      }
    })
  } catch (err) {
    next(err)
  }
})

// Delete image
router.post('/delete', async function (req, res, next) {
  try {
    const userName = req.session.userName
    const db = req.app.locals.db
    const gfs = req.app.locals.gfs
    const imageId = req.body.imageId
    if (!userName) {
      return res.status(401).json({ error: 'UNAUTHORIZED' })
    }
    const dbData = await db.collection('images').findOne({ id: imageId })
    if (!dbData) {
      return res.status(422).json({ error: 'UNPROCESSABLE REQUEST' })
    }
    if (dbData.userName !== userName) {
      return res.status(401).json({ error: 'UNAUTHORIZED' })
    }
    gfs.remove({ filename: dbData.image }, function (err) {
      if (err) console.log(err)
    })
    await db.collection('images').deleteOne({ id: imageId })
    res.status(200).json({ deleted: 'TRUE' })
  } catch (err) {
    next(err)
  }
})

//Change Permissions
router.post('/permission', async function (req, res, next) {
  try {
    const userName = req.session.userName
    const db = req.app.locals.db
    const imageId = req.body.imageId
    const permission = req.body.permission
    if (!userName) {
      return res.status(401).json({ error: 'UNAUTHORIZED' })
    }
    const dbData = await db.collection('images').findOne({ id: imageId })
    if (!dbData) {
      return res.status(422).json({ error: 'UNPROCESSABLE REQUEST' })
    }
    if (dbData.userName !== userName) {
      return res.status(401).json({ error: 'UNAUTHORIZED' })
    }
    await db.collection('images').updateOne({ id: imageId }, { $set: { permission: permission } })
    res.status(200).json({ changed: 'TRUE' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
