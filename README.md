# Muvor Protocol (insecure)

## Description

An implementation for (nonsecure) MVRP.

## Installation

```bash
npm install mvrp
```

## Implementation

### Client (In-Browser)

```bash
const { request } = require('mvrp');

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  method: 'CREATE'
};

const req = request(options, (res) => {
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.write('Hello, server!');
req.end();
```

### Video

```bash
const { processSegments } = require('mvrp');

processSegments('/path/to/uploads', '/path/to/structured');
```

### Server

```bash
const { createServer } = require('mvrp');

const server = createServer((req, res) => {
  res.write('Hello, MVRP!');
  res.end();
});

server.listen(8080, '127.0.0.1', () => {
  console.log('MVRP server listening on 127.0.0.1:8080');
});
```