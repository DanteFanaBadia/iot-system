import './App.css';

var AWSConfiguration = {
  poolId: 'us-east-1:0b0753d6-ae0b-435b-8c3b-24fe61553be2',
  host: 'a1piehecu3f9hw-ats.iot.us-east-1.amazonaws.com',
  region: 'us-east-1'
};

var AWS = require('aws-sdk');
var AWSIoTData = require('aws-iot-device-sdk');

var clientId = 'semaphore-monitor-' + (Math.floor((Math.random() * 100000) + 1));
AWS.config.region = AWSConfiguration.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   IdentityPoolId: AWSConfiguration.poolId
});

const mqttClient = AWSIoTData.device({
  region: AWS.config.region,
  host: AWSConfiguration.host,
  clientId: clientId,
  protocol: 'wss',
  maximumReconnectTimeMs: 8000,
  debug: true,
  accessKeyId: '',
  secretKey: '',
  sessionToken: ''
});
var cognitoIdentity = new AWS.CognitoIdentity();
AWS.config.credentials.get(function(err, data) {
   if (!err) {
      var params = {
         IdentityId: AWS.config.credentials.identityId
      };
      cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
         if (!err) {
            mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
               data.Credentials.SecretKey,
               data.Credentials.SessionToken);
         } else {
            console.log('error retrieving credentials: ' + err);
            alert('error retrieving credentials: ' + err);
         }
      });
   } else {
      console.log('error retrieving identity:' + err);
      alert('error retrieving identity: ' + err);
   }
});

var subscribedToLifeCycleEvents = false;

mqttClient.on('connect', () => {
   if (!subscribedToLifeCycleEvents) {
      mqttClient.subscribe('topic_1');
      subscribedToLifeCycleEvents = true;
   }
   console.log('connect');
});
mqttClient.on('reconnect', () => console.log('reconnect'));
mqttClient.on('message', (topic, payload) => console.log({topic, payload}));

function App() {
  return (
    <div className="App"></div>
  );
}

export default App;
