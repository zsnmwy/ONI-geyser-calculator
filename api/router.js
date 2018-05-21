const router = require('koa-router')()
const API = require('./api')
const db = require('./db')

if (process.env.NODE_ENV === 'development') {
  router.get('/', async ctx => {
    await ctx.render('index', {
      subpath: process.env.SUB_PATH || '',
    })
  })
}

router.post('/upload', async ctx => {
  const base64 = ctx.request.body.image
  const rows = await db.queryTokens()
  let ocrResult
  for (let row of rows) {
    const { id, secret } = row
    const token = await API.getAccessToken({ id, secret })
    if (token === 401) {
      // authentication failed
      db.setTokenInvalid(id)
      continue
    }

    ocrResult = await API.ocr(token, base64)
    if (ocrResult && ocrResult.error_code === 17) {
      // daily request limit reached.
      db.resetCounter(id, 500)
      continue
    }
    if (ocrResult && ocrResult.words_result) {
      // increase token counter
      db.increaseCounter(id)
      break
    }
  }
  // no result
  if (!ocrResult || !ocrResult.words_result) {
    console.warn('API call failed ERROR: ', ocrResult)
    return ctx.throw(500, 'There is no id/secret pair that you can use.')
  }

  const result = API.analyze(ocrResult.words_result)

  ctx.body = result
})

router.get('/apiQuery', async ctx => {
  await db.queryTokens(true)
    .then(ret => {
      // id/secret mask
      ctx.body = ret.map(item => {
        item.secret = '***'
        item.id = item.id.replace(/(\w{4})\w{16}/, '$1****')
        return item
      })
    })
    .catch(err => { ctx.throw(500, err) })
})

router.post('/insertToken', async ctx => {
  const { id, secret, name } = ctx.request.body
  // validation
  let token = await API.getAccessToken({ id, secret })
  if (typeof token !== 'string') {
    return ctx.throw(401, 'Invalid id/secret string.')
  }

  await db.insertToken({ id, secret, name })
    .then(ret => { ctx.status = 201 })
    .catch(err => { ctx.throw(500, err) })
})

router.post('/removeToken', async ctx => {
  const { id, secret } = ctx.request.body
  await db.removeToken({ id, secret })
    .then(ret => {
      if (ret.changes === 0) return Promise.reject('Unmatched id/secret pairs.')
      ctx.status = 200
    })
    .catch(err => { ctx.throw(400, err) })
})

module.exports = router
