const { createServer, request } = require('./mvrp');
const { processSegments } = require('./mvvp');

module.exports = { createServer, request, processSegments };

if (require.main === module) {
    setInterval(() => processSegments(), 60000); // Every 60 seconds
  }