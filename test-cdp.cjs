#!/usr/bin/env node

const net = require('net');
const path = require('path');
const os = require('os');

const session = 'default';
const socketPath = path.join(os.tmpdir(), `agent-browser-${session}.sock`);

console.log('Connecting to socket:', socketPath);

const client = net.createConnection(socketPath, () => {
  console.log('Connected to daemon');

  // Send a URL command to get the current URL
  const cmd = {
    id: 'test-1',
    action: 'url'
  };

  console.log('Sending command:', cmd);
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  console.log('Response:', data.toString());
  client.end();
});

client.on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

client.on('end', () => {
  console.log('Connection closed');
  process.exit(0);
});
