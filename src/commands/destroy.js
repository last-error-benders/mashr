const {
  removeResource,
  readYaml,
  readResources,
} = require('../utils/fileUtils');
const { destroyBuckets } = require('../gcp/destroyBuckets');
const configureCredentials = require('../utils/configureCredentials');
const { destroyGCEInstance } = require('../gcp/destroyGCEInstance');
const destroyCloudFunction = require('../gcp/destroyCloudFunction');
const ora = require('ora');
const mashrLogger = require('../utils/mashrLogger');

module.exports = async (args) => {
  const spinner = ora();

  const mashrConfigObj = await readYaml('./mashr_config.yml');
  await configureCredentials(mashrConfigObj);

  const integrationName = args._[1];
  const mashrInfoObj = await readResources();
  const integrations = mashrInfoObj.integrations;

  if (!integrations[integrationName]) {
    const message = `"${integrationName}" is not an integration. Run ` + 
                    `"mashr list" to see all integrations.`

    mashrLogger(spinner, 'fail', message);
  } else {
    await Promise.all([
      destroyGCEInstance(integrationName),
      destroyBuckets(integrationName),
      destroyCloudFunction(integrationName),
    ]);
    await removeResource('integrations', integrationName);

    mashrLogger(spinner, 'succeed', 'Integration is removed from ~/.mashr/info.json');
  }
};
