import config from './config';

var AWS = require('aws-sdk');
var AWSIoTData = require('aws-iot-device-sdk');
AWS.config.region = config.region;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   IdentityPoolId: config.poolId
});


export function getMqttClient(){
    var clientId = 'semaphore-monitor-' + (Math.floor((Math.random() * 100000) + 1));
    var cognitoIdentity = new AWS.CognitoIdentity();
    const mqttClient = AWSIoTData.device({
        region: AWS.config.region,
        host: config.host,
        clientId: clientId,
        protocol: 'wss',
        maximumReconnectTimeMs: 8000,
        accessKeyId: '',
        secretKey: '',
        sessionToken: ''
    });
      
      
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

    return mqttClient;
}