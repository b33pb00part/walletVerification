// webpack.config.js
const path = require('path');

module.exports = {
  entry: './public/walletConnections.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'web',
  resolve: {
    fallback: {
      "http": false, 
      "https": false, 
      "crypto": false, 
      "stream": false, 
      "buffer": false
    }
  },
};
