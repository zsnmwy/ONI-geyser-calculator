const axios = require('axios')
const qs = require('querystring')

/**
 * Baidu AI OCR API
 * http://ai.baidu.com/docs#/OCR-API/top
 */
class API {
  static async getAccessToken () {
    const params = {
      'grant_type': 'client_credentials',
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET,
    }
    return axios.get('https://aip.baidubce.com/oauth/2.0/token', { params })
      .then(res => res.data.access_token)
      .catch(err => {
        throw new Error(err)
      })
  }

  static async ocr (token, image) {
    const url = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`
    const data = {
      image,
      language_type: 'CHN_ENG',
    }
    return axios.post(url, qs.stringify(data))
      .then(res => res.data.words_result)
      .catch(err => err)
  }

  static analyze (ocrResult) {
    const ret = {
      type: '',
      temp: 0,
      output: 0,
      ep: [],
      ap: [],
      match2: 0,
      origin_data: ocrResult,
    }
    for (let i of ocrResult) {
      let word = i.words
      if (word.length < 6) continue
      let match
      // 识别温泉种类和喷发量
      if ((match = word.match(/^(\S+)[;:]\S*?([.\d]+)(千?)克\/?秒\S*/)) ||
          (match = word.match(/^\b(.+)\b[;:]([ ,.\d]+)([kK]?)g\/?s at.*/))) {
        const tempMatch = match[0].match(/(-?[.\d]+?)\S?氏?(度)/) ||
            match[0].match(/at (-?[.\d]+?)(C|c|K|k|[oO]?F)/) ||
            match[0].match(/\S?([-\d]+?)(°C|度|c|C|°c)/)

        if (!tempMatch) continue

        if (tempMatch[2] === '度' || tempMatch[2].toLowerCase() === 'c' || tempMatch[2] === '°C' || tempMatch[2] === '°c') {
          ret.temp = Number(tempMatch[1]) + 273.15 // 摄氏度转化为K
        } else if (tempMatch[2].toLowerCase() === 'k') {
          ret.temp = Number(tempMatch[1])
        } else if (tempMatch[2].match(/.?F/)) {
          ret.temp = Math.round((tempMatch[1] - 32) * 5 / 9 + 273.15) // 华氏度转K
        } else continue

        ret.type = match[1]
        match[2] = match[2].replace(/,/g, '.').replace(/\s/g, '')
        ret.match2 = match[2]
        ret.output = match[2] * (match[3] ? 1000 : 1)// 识别到千克时进行单位换算
        continue
      }
      // 识别喷发期
      if ((match = word.match(/喷发\S+?[;:]\S*?(\d+)秒\S+?(\d+)秒/)) ||
          (match = word.match(/Eruption.+[;:]\s?(\d+)s every (\d+)s/))) {
        ret.ep = [Number(match[1]), Number(match[2])]
        continue
      }
      // 识别活跃期
      if ((match = word.match(/活(?:跃期|动周期)[;:]\S*?([ ,.\d]+)(?:个周期|天)\S*?([ ,.\d]+)(?:个周?期?|天)/)) ||
          (match = word.match(/Active.+[;:]([ .,\d]+)cycles every([ .,\d]+)\S*/)) ||
          (match = word.match(/活(?:跃|期|跃期)[;:]\S*?([.,\d]+)(?:周期|个周期)\S*?([,.\d]+)(?:周期|周)/))) {
        match[1] = match[1].replace(/,/g, '.').replace(/\s/g, '')
        match[2] = match[2].replace(/,/g, '.').replace(/\s/g, '')
        ret.ap = [Number(match[1]), Number(match[2])]
        continue
      }
    }
    return ret
  }
}

module.exports = API
