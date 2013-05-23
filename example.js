
var http = require('http')
  , httpClose = require('./')
  , assert = require('assert')

var server = http.createServer(function (req, res) {
  setTimeout(function () {
    assert(false, 'The socket should be closed before the timeout')
  }, 1000).unref()
})

// Add http-close hook
httpClose({ timeout: 10 }, server)


server.listen(function () {
  var listen = server.address()
    , reqOpts = { host: listen.address
                , port: listen.port
                }

  var req = http.get(reqOpts, function (res) {
    assert.equal(res.statusCode, 500)
  })

  setTimeout(function () {
    server.close()
  }, 10)
})
