#!/usr/bin/env node

const net = require('net');
const path = require('path');
const os = require('os');

const session = 'default';
const socketPath = path.join(os.tmpdir(), `agent-browser-${session}.sock`);

console.log('Sending close command to daemon...');

const client = net.createConnection(socketPath, () => {
  const cmd = {
    id: 'close-1',
    action: 'close'
  };
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
  console.log('Daemon closed gracefully');
  process.exit(0);
});
