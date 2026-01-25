const { Eureka } = require('eureka-js-client');

const eurekaClient = new Eureka({
  instance: {
    app: 'USER-SERVICE',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: 'http://localhost:4000/info',
    port: {
      '$': 4000,
      '@enabled': true
    },
    vipAddress: 'user-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

module.exports = eurekaClient;
