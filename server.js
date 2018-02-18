require('dotenv').config()
const { createServer } = require('http')
const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { setInsuranceStatus } = require('./utils')

app.prepare().then(() => {
  const server = express()

  server.get('/insurances/new', (req, res) => {
    const params = { address: req.params.address }
    return app.render(req, res, '/insurances/new', params)
  })
  
  server.get('/insurances/:address', (req, res) => {
    const params = { address: req.params.address }
    return app.render(req, res, '/insurances/show', params)
  })

  // simulate the backend method call
  server.get('/test/:address', (req, res) => {
    let status = 1 // mock data
    setInsuranceStatus(status, req.params.address)
    return handle(req, res)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, '0.0.0.0', err => {
    if (err) throw err
    console.log(`${'\u2705'}  Ready on http://localhost:3000`)
  })
})