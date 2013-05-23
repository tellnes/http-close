# http-close

http-close keeps track on open sockets and closes them gracefully when the
tcp server is closeing.

It does not handle

## Usage

```js
var http = require('http')
  , httpClose = require('http-close')

var server = http.createServer()

// Add http-close hook
httpClose({ timeout: 2000 }, server)

// Just call server.close as usual when you want to stop the server
server.close()
```

## Install

    $ npm install http-close

## License

MIT
