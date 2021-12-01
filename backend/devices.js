const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: './config/f2f49dcdf0d1e1615ffa43822a2521df954c9251a89078656692ff4a0047c1e2-private.pem.key',
  certPath: './config/f2f49dcdf0d1e1615ffa43822a2521df954c9251a89078656692ff4a0047c1e2-certificate.pem.crt',
  caPath: './config/AmazonRootCA1.pem',
  clientId: 'semaphore',
  region: 'us-east-1',
  host: 'a1piehecu3f9hw-ats.iot.us-east-1.amazonaws.com',
  debug: true
});

module.exports = device;
