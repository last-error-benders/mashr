const { createDataset } = require('./createDataset');
const { createGCEInstance } = require('./createGCEInstance');
const { destroyCloudFunction } = require('./destroyCloudFunction');
const { setGoogleAppCredentials } = require('./setGoogleAppCredentials');
const { configureCredentials } = require('./configureCredentials');
const { getDefaultZone } = require('./getDefaultZone');
const { destroyDataset } = require('./destroyDataset');
const { getGCEInstance } = require('./getGCEInstance');
const { destroyGCEInstance } = require('./destroyGCEInstance');
const {
  createBucket,
  createBuckets,
} = require('./createBuckets');
const {
  createCloudFunction,
  deployCloudFunction,
  setupCloudFunction,
} = require('./createCloudFunction');
const {
  destroyBuckets,
  destroyBucket,
} = require('./destroyBuckets');
const {
  generateGCEResources,
  createEmbulkScript,
  createGemInstallationScript,
  createEmbulkConfig,
} = require('./generateGCEResources');
const {
  validateIntegrationNameWithGCP,
  validateBucketName,
  bucketExists,
  functionExists,
  functionNameIsAvailable,
  bucketsAreAvailable,
} = require('./validateIntegrationNameWithGCP');

module.exports = {
  bucketExists,
  bucketsAreAvailable,
  createBuckets,
  createBucket,
  createCloudFunction,
  createDataset,
  createGCEInstance,
  createEmbulkScript,
  createGemInstallationScript,
  createEmbulkConfig,
  configureCredentials,
  destroyBuckets,
  destroyBucket,
  destroyCloudFunction,
  destroyDataset,
  destroyGCEInstance,
  deployCloudFunction,
  functionExists,
  functionNameIsAvailable,
  getGCEInstance,
  getDefaultZone,
  generateGCEResources,
  setupCloudFunction,
  setGoogleAppCredentials,
  validateIntegrationNameWithGCP,
  validateBucketName,
};
