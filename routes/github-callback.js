const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

async function fetchGitHubUser(token) {
  const request = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + token,
    },
  })
  return await request.json()
}

async function getAccessToken(code, client_id, client_secret) {
  const request = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  })
  const text = await request.text()
  const params = new URLSearchParams(text)
  return params.get('access_token')
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const code = req.query.code
    const access_token = await getAccessToken(code, process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET)
    const user = await fetchGitHubUser(access_token)
    if (user) {
      console.log(user)
      req.session.githubId = user.id
      req.session.userName = user.login
      res.redirect('/account')
    } else {
      res.redirect('/error-page')
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
