   function SigV4Utils(){}
 
    SigV4Utils.sign = function(key, msg) {
      var hash = CryptoJS.HmacSHA256(msg, key);
      return hash.toString(CryptoJS.enc.Hex);
    };
 
    SigV4Utils.sha256 = function(msg) {
      var hash = CryptoJS.SHA256(msg);
      return hash.toString(CryptoJS.enc.Hex);
    };
 
    SigV4Utils.getSignatureKey = function(key, dateStamp, regionName, serviceName) {
      var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
      var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
      var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
      var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
      return kSigning;
    };

    function getCredentials(done) {
      AWS.config.region = 'ap-northeast-1';
      var cognitoidentity = new AWS.CognitoIdentity();
      var params = {
        IdentityPoolId: 'ap-northeast-1:d31f092c-8c4f-45ff-ba45-9da55117880f'
      };
      cognitoidentity.getId(params, function(err, objectHavingIdentityId) {
        if (err) return done(err);
        cognitoidentity.getCredentialsForIdentity(objectHavingIdentityId, function(err, data) {
          if (err) return done(err);
          var credentials = {
            accessKey: data.Credentials.AccessKeyId,
            secretKey: data.Credentials.SecretKey,
            sessionToken: data.Credentials.SessionToken
          };
          console.log('CognitoIdentity has provided temporary credentials successfully.');
          done(null, credentials);
        });
      });
    }

    function __createEndpoint(regionName, awsIotEndpoint, accessKey, secretKey) {
      var time = moment.utc();
      var dateStamp = time.format('YYYYMMDD');
      var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
      var service = 'iotdevicegateway';
      var region = regionName;
      var secretKey = secretKey;
      var accessKey = accessKey;
      var algorithm = 'AWS4-HMAC-SHA256';
      var method = 'GET';
      var canonicalUri = '/mqtt';
      var host = awsIotEndpoint;
 
      var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
      var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
      canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
      canonicalQuerystring += '&X-Amz-Date=' + amzdate;
      canonicalQuerystring += '&X-Amz-SignedHeaders=host';
 
      var canonicalHeaders = 'host:' + host + '\n';
      var payloadHash = SigV4Utils.sha256('');
      var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
 
      var stringToSign = algorithm + '\n' +  amzdate + '\n' +  credentialScope + '\n' +  SigV4Utils.sha256(canonicalRequest);
      var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
      var signature = SigV4Utils.sign(signingKey, stringToSign);
 
      canonicalQuerystring += '&X-Amz-Signature=' + signature;
      return 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
    }

    // var endpoint = createEndpoint(
    //    'ap-northeast-1', // Your Region
    //    'abb4wssef8fld.iot.ap-northeast-1.amazonaws.com', // Require 'lowercamelcase'!!

    //var clientId = Math.random().toString(36).substring(7);
    //var client = new Paho.MQTT.Client(endpoint, clientId);


    function getEndpoint(regionName, awsIotEndpoint, done) {
      getCredentials(function (err, creds) {
        if (err) return done(err);
 
        var time = moment.utc();
        var dateStamp = time.format('YYYYMMDD');
        var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
        var service = 'iotdevicegateway';
        var region = regionName;
        var secretKey = creds.secretKey;
        var accessKey = creds.accessKey;
        var algorithm = 'AWS4-HMAC-SHA256';
        var method = 'GET';
        var canonicalUri = '/mqtt';
        var host = awsIotEndpoint;
        var sessionToken = creds.sessionToken;
 
        var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
        var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
        canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
        canonicalQuerystring += '&X-Amz-Date=' + amzdate;
        canonicalQuerystring += '&X-Amz-SignedHeaders=host';
 
        var canonicalHeaders = 'host:' + host + '\n';
        var payloadHash = SigV4Utils.sha256('');
        var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
 
        var stringToSign = algorithm + '\n' +  amzdate + '\n' +  credentialScope + '\n' +  SigV4Utils.sha256(canonicalRequest);
        var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
        var signature = SigV4Utils.sign(signingKey, stringToSign);
 
        canonicalQuerystring += '&X-Amz-Signature=' + signature;
 
        var wssEndpoint = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
        wssEndpoint += '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);
        done(null, wssEndpoint);
      });
    }

    var client;
    getEndpoint(
        'ap-northeast-1', 
        'abb4wssef8fld.iot.ap-northeast-1.amazonaws.com',
        function(err, endpoint) {
          if (err) {
            console.log('failed', err);
            return;
          }
          var clientId = Math.random().toString(36).substring(7);
          client = new Paho.MQTT.Client(endpoint, clientId);
          //var connectOptions = {
          //  useSSL: true,
          //  timeout: 3,
          //  mqttVersion: 4,
          //  onSuccess: subscribe
          //};
          //client.connect(connectOptions);
          //client.onMessageArrived = onMessage;
          //client.onConnectionLost = function(e) { console.log(e) };
        });

