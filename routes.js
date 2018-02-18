const routes = require('next-routes')();

routes
  .add('/insurances/new', '/insurances/new')
  .add('/insurances/:address', '/insurances/show')

module.exports = routes;