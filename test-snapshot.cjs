#!/usr/bin/env node

const net = require('net');
const path = require('path');
const os = require('os');

const session = 'default';
const socketPath = path.join(os.tmpdir(), `agent-browser-${session}.sock`);

console.log('Getting page snapshot...');

const client = net.createConnection(socketPath, () => {
  const cmd = {
    id: 'test-snapshot',
    action: 'snapshot'
  };
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  const response = JSON.parse(data.toString());
  if (response.success) {
    console.log('Snapshot retrieved (first 500 chars):');
    console.log(response.data.snapshot.substring(0, 500));
  } else {
    console.log('Error:', response.error);
  }
  client.end();
});

client.on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

client.on('end', () => {
  console.log('\nConnection closed');
  process.exit(0);
});
