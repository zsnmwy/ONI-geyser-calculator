require('dotenv').config()
const router = require('koa-router')()
const koaRequest = require('koa-http-request')

/**
 * Baidu AI API
 */
const opts = {
  json: true,
  timeout: 3000,
  host: 'https://aip.baidubce.com',
}

router.get('/token', koaRequest(opts), async ctx => {
  const params = {
    'grant_type': 'client_credentials',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
  }
  let res
  try {
    res = await ctx.get('/oauth/2.0/token', params)
  } catch (e) {
    ctx.body = e
  }
  ctx.body = res.access_token
})

router.post('/upload', ctx => {
  ctx.body = ctx.request.body
})

router.get('/', async ctx => {
  await ctx.render('index')
})

module.exports = router
