const NodeGeocoder = require('node-geocoder');
// geocoder setup
module.exports = NodeGeocoder({
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
});
