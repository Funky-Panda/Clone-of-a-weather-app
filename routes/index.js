require('url-search-params-polyfill');
const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Env vars
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
const API_KEY_NAME = "appid"
const API_KEY_VALUE = "f831ea411b2ed1667ff737debbebd382"

// Init cache
let cache = apicache.middleware

router.get('/', cache('2 minutes'), async (req, res, next) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    })

    const apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    const data = apiRes.body
    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    }

    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
