const database = require('./database');
const device = require('./devices');
const express = require('express');

const app = express();
const port = 9000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

var count = 1;

device.subscribe('topic_1');

timeout = setInterval(function() {
  count++;
  device.publish('topic_1', JSON.stringify({
    count: count
  }));
}, Math.max(1000, 1000));

device
  .on('connect', function() {
    console.log('connect');
    device.subscribe('topic_1');
    device.publish('topic_1', JSON.stringify({ test_data: 1}));
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
