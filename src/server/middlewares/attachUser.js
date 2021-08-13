const User = require('../models/User')

module.exports = function attachUser(req, res, next) {
  let { username } = req.tokenData.data
  User.findOneByParams({ username })
    .then(r => {
      req.user = r.data
      next()
    })

}