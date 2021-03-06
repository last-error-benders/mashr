const ora = require('ora');

const {
  createDataset,
  validateIntegrationNameWithGCP,
  createBuckets,
  createCloudFunction,
  createGCEInstance,
  configureCredentials,
} = require('../gcp');

const {
  addIntegrationToDirectory,
  validateMashrConfig,
  mashrLogger,
  checkMashrInitialized,
} = require('../utils');

module.exports = async(args) => {
  await checkMashrInitialized();

  const path = './mashr_config.yml';
  const mashrConfigObj = await validateMashrConfig(path).catch((e) => {
    const spinner = ora();
    mashrLogger(spinner, 'fail', 'Deploy integration error');
    throw (e);
  });

  await configureCredentials(mashrConfigObj);

  const integrationName = mashrConfigObj.mashr.integration_name.trim();

  await validateIntegrationNameWithGCP(integrationName);

  await addIntegrationToDirectory(mashrConfigObj);
  await Promise.all([
    createGCEInstance(mashrConfigObj),
    createDataset(mashrConfigObj),
    createBuckets(integrationName).then(() => {
      createCloudFunction(mashrConfigObj);
    }),
  ]);
};
