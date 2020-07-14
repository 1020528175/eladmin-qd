'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:5188/eladmin"'
  // BASE_API: '"http://39.99.200.108/eladmin"'
})
