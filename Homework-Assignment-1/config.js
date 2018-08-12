//object of environments
var envi = {};

envi.staging = {
    'httpPort' : '1016',
    'httpsPort' : '1023',
    'envName' : 'staging'
};

envi.production = {
    'httpPort' : '3010',
    'httpsPort' : '8080',
    'envName' : 'production'
};

//determine which environments was passed on a cli argument, if none, return null
var decision = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

//check that the current env is one of the above envi, if not, default to staging
var finalOut = typeof(envi[decision]) == 'object' ? envi[decision] : envi.staging;

//exporting
module.exports = finalOut;