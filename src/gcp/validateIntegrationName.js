const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const { exec } = require('../utils/fileUtils');
const ora = require('ora');
const mashrLogger = require('../utils/mashrLogger');

const validateIntegrationName = async (integrationName) => {
  try {
    await Promise.all([
      bucketsAreAvailable(integrationName),
      functionNameIsAvailable(integrationName),
    ]);
  } catch (e) {
    throw(e);
  }
};

/*
functionExists;
input:
outout:
  - returns true if exists, false if not

functionExist
*/

const functionExists = async (integrationName) => {
  const { stdout, stderr } = await exec('gcloud functions list');
  let lines = stdout.split('\n');

  for (let i = 1; i < lines.length; i++) {
    name = lines[i].split(/\s/)[0].trim();
    if (name === integrationName) { return true; }
  }

  return false;
};


async function functionNameIsAvailable(integrationName) {
  const functionSpinner = ora();
  mashrLogger(
    functionSpinner,
    'start', 
    `Validating function name "${integrationName}"...`
  );

  if (await functionExists(integrationName)) {
    mashrLogger(functionSpinner, 'fail', 'Function name is unavailable');

    const error = new Error(`Cloud function name "${integrationName}" is taken. ` +
                            'Please provide a different integration_name in the ' + 
                            'mashr_config.yml file.');
    throw(error);
  }

  mashrLogger(functionSpinner, 'succeed', 'Function name is valid');
}

const bucketsAreAvailable = async (bucketName) => {
  const bucketsSpinner = ora();

  validateBucketName(bucketName, bucketsSpinner);

  const results = await Promise.all([
    bucketExists(bucketName),
    bucketExists(bucketName + '_archive'),
  ]);

  const anyExists = results.some(function (result) {
    return result === true;
  });

  if (anyExists) {
    mashrLogger(bucketsSpinner, 'fail', 'Bucket name is unavailable');

    const error = new Error(`Bucket name "${bucketName}" is taken. ` +
                            'Please provide a different integration_name in the ' +
                            'mashr_config.yml file.');
    throw(error);
  }

  mashrLogger(bucketsSpinner, 'succeed', 'Bucket name is valid');
};

const validateBucketName = (bucketName, bucketsSpinner) => {
  mashrLogger(bucketsSpinner, 'start', `Validating bucket name, "${bucketName}"...`);

  if (!bucketName.match(/^[a-z0-9]([a-z0-9_-]|\.)*[a-z0-9]$/)) {
    mashrLogger(bucketsSpinner, 'fail', 'Bucket name is invalid');

    throw new Error(`Bucket name '${bucketName}' invalid, needs to only ` +
      'include lowercase numbers, dashes and underscores. Can only begin ' +
      'and end with number or letter.');
  }
};

/*
if no bucket => false [ false ]
if bucket exist but we don't have permission => catch error and return true
if we have bucket + access => true
*/
const bucketExists = async (bucketName) => {
  const bucket = storage.bucket(bucketName);
  let data;

  try {
    data = await bucket.exists();
  } catch (e) {
      if (!!e.errors && e.errors[0].reason === 'forbidden') {
        return true;
      } else {
        throw(e);
      }
  }

  return data[0];
}

module.exports = {
  validateIntegrationName,
  bucketExists,
  validateBucketName,
  functionExists,
};
