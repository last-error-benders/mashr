const { 
  createBucket, 
  createBuckets 
} = require('createBuckets');
const { 
  createCloudFunction,
  deployCloudFunction,
  setupCloudFunction 
} = require('createCloudFunction');
const {   
  destroyBuckets,
  destroyBucket
} = require('destroyBucket');
const {   
  destroyGCEInstance,
  getGCEInstance
} = require('destroyGCEInstance');
const {   
  generateGCEResources,
  createEmbulkScript,
  createGemInstallationScript,
  createEmbulkConfig 
} = require('generateGCEResourcees');
const {   
  validateIntegrationNameWithGCP,
  validateBucketName,
  bucketExists,
  functionExists,
  functionNameIsAvailable,
  bucketsAreAvailable 
} = require('validateIntegrationName');

const { createDataset } = require('createDataset');
const { createGCEInstance } = require('createGCEInstance');
const { destroyCloudFunction } = require('destroyCloudFunction');
const { setGoogleApplicationCredentials } = require('setGoogleApplicationCredentials');


module.exports = {
  createBuckets,
  createBucket,
  createCloudFunction,
  deployCloudFunction,
  setupCloudFunction,
  createDataset,
  createGCEInstance,
  destroyBuckets,
  destroyBucket,
  destroyCloudFunction,
  destroyGCEInstance,
  getGCEInstance,
  generateGCEResources,
  createEmbulkScript,
  createGemInstallationScript,
  createEmbulkConfig,
  setGoogleApplicationCredentials,
  validateIntegrationNameWithGCP,
  validateBucketName,
  bucketExists,
  functionExists,
  functionNameIsAvailable,
  bucketsAreAvailable
}