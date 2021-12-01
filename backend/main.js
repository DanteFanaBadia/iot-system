const { runQuery, runInsert } = require('./database');
const device = require('./devices');
const express = require('express');
const cors = require('cors')

const port = 9000;
const topic = 'semaphore';
const stepPerEvent = 10;
const app = express();

app.use(cors())

app.get('/', (req, res) => {
  runQuery('SELECT COUNT(*) FROM loggers;', (row) => {
    const steps = Number(row[0]['COUNT(*)']) * stepPerEvent;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({steps: steps}));
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

device.subscribe(topic);

device
  .on('connect', () => {
    console.log(`MQTT listening event: ${topic}`);
  });

device
  .on('message', (topic, payload) => {
    console.log(`New event: ${topic}`);
    runInsert(`INSERT INTO loggers(event) VALUES ('${topic}');`);
  });
