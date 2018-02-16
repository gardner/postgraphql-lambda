var graphql = require('./index').handler

graphql({}, {}, function (err, res) {
  console.log(err, res)
})
