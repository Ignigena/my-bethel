exports.config = {
  capabilities: {
    'browserName': 'firefox'
  },
  framework: 'mocha',
  mochaOpts: {
    reporter: 'spec',
    slow: 3000,
    enableTimeouts: false
  },
  rootElement: 'html',
  specs: [
    'bootstrap.test.js',
    'e2e/*.js'
  ]
};