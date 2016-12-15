var client:

var endpoint = 'ws://lite.mqtt.shiguredo.jp/mqtt';

          var clientId = Math.random().toString(36).substring(7);
          client = new Paho.MQTT.Client(endpoint, clientId);
