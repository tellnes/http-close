
var debug = require('debug')('http-close')

module.exports = function httpClose(options, server) {
  if (!server) {
    server = options
    options = {}
  }

  var sockets = []
    , timeout = options.timeout || 5000

  server.on('connection', function (socket) {
    sockets.push(socket)
    socket.on('close', function () {
      sockets.splice(sockets.indexOf(socket), 1)
    })
  })

  var close = server.close
  server.close = function () {
    debug('server close')
    close.apply(this, arguments)

    sockets.forEach(function (socket) {
      var res = socket._httpMessage

      // Close all keep-alive sockets
      if (!res) {
        socket.destroy()
        return
      }

      // If headers is not sent, then say we don't want keep-alive
      if (!res.headersSent) {
        res.setHeader('Connection', 'close')
      }

      if (timeout) {
        socket.setTimeout(timeout)
      }
    })

    if (timeout) {
      server.on('timeout', function (socket) {
        debug('socket timeout')

        var res = socket._httpMessage

        if (!res) {
          debug('no ServerResponse')
          socket.destroy()
          return
        }

        if (res.headersSent) {
          debug('no response in time')
          socket.destroy()
          return
        }

        debug('write 500')
        res.writeHead(500, { Connection: 'close'})
        res.end()
      })

    } // if (timeout)

  } // server.close
}
