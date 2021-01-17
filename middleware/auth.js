function auth(req, res, next) {
  if (!req.session.userName) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  next()
}

module.exports = auth
