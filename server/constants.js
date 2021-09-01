'use strict';

const
  isDevMode = process.env.NODE_ENV !== 'production',
  isTestMode = process.env.NODE_ENV === 'test',
  localUri = 'mongodb://localhost:27017/';

const constants = {
  EXPRESS_PORT: Number(process.env.PORT) || 3000,
  QUERIES_MAX_LIMIT: Number(process.env.QUERIES_MAX_LIMIT) || 1000,
  MONGODB: {
    connections: {
      default: {
        uri: process.env.COFFEE_MONGO_DB_URI || localUri + `reza-mir${isTestMode ? '_test' : (isDevMode ? '_dev' : '')}`
      }
    }
  },

};

module.exports = constants;
