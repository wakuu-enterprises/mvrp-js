const net = require('net');

class MVRPRequest {
  constructor(socket) {
    this.socket = socket;
    this.headers = {};
    this.method = '';
    this.url = '';
    this.body = '';
  }
  
  parseRequest(data) {
    const requestLines = data.toString().split('\r\n');
    const [method, url] = requestLines[0].split(' ');
    this.method = method;
    this.url = url;
    let i = 1;
    for (; i < requestLines.length; i++) {
      if (requestLines[i] === '') break;
      const [key, value] = requestLines[i].split(': ');
      this.headers[key] = value;
    }
    this.body = requestLines.slice(i + 1).join('\r\n');
  }
}

class MVRPResponse {
  constructor(socket) {
    this.socket = socket;
    this.headers = {};
    this.statusCode = 200;
    this.statusMessage = 'OK';
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }

  writeHead(statusCode, headers = {}) {
    this.statusCode = statusCode;
    this.statusMessage = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      405: 'Method Not Allowed'
    }[statusCode] || 'Unknown Status';
    Object.assign(this.headers, headers);
  }

  write(chunk) {
    this.socket.write(chunk);
  }

  end(chunk) {
    if (chunk) this.write(chunk);
    const headers = Object.entries(this.headers).map(([key, value]) => `${key}: ${value}`).join('\r\n');
    this.socket.end(`MVRP/1.0 ${this.statusCode} ${this.statusMessage}\r\n${headers}\r\n\r\n${chunk || ''}`);
  }
}

function createServer(requestListener) {
  const server = net.createServer((socket) => {
    socket.on('data', (data) => {
      const req = new MVRPRequest(socket);
      req.parseRequest(data);
      const res = new MVRPResponse(socket);
      requestListener(req, res);
    });
  });
  return server;
}

function request(options, callback) {
  const client = net.createConnection({ port: options.port, host: options.hostname }, () => {
    const req = `MVRP/1.0 ${options.method} ${options.path || '/'}\r\n\r\n${options.body || ''}`;
    client.write(req);
  });
  client.on('data', (data) => {
    const res = new MVRPRequest(client);
    res.parseRequest(data);
    callback(res);
  });
  return client;
}

module.exports = { createServer, request };
