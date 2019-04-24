const { readFile } = require('../utils/fileUtils');
const yaml = require('js-yaml');

const generateGCEResources = async (mashrConfigObj) => {
  const gemInstallationScript = createGemInstallationScript(mashrConfigObj.mashr.embulk_gems);
  const embulkScript = createEmbulkScript(mashrConfigObj.mashr.embulk_run_command);
  const embulkConfig = createEmbulkConfig(mashrConfigObj);

  const [ dockerfile, crontab ] = await Promise.all([
    readFile(`${__dirname}/../../templates/docker/Dockerfile`),
    readFile(`${__dirname}/../../templates/docker/crontab`),
  ]);

  return {
    dockerfile,
    gemInstallationScript,
    embulkScript,
    crontab,
    embulkConfig,
  };
};

const createEmbulkScript = (runCommand) => {
  // TODO: place logs in stackdriver
  // TODO: what to do with logs? Does the log file get too large?
  // diff file run from root of container. Can't use it after?
  runCommand = runCommand.replace(
    'embulk_config.yml', '/root/mashr/embulk_config.yml.liquid');
// sends logs of cron job to /proc/1/fd/1, where docker listens
  const script =
`#!/bin/bash
export DATE=$(date +"%Y-%m-%dT%H-%M-%S-%3N")

${runCommand} >> /proc/1/fd/1
`;

  return script;
}

const createGemInstallationScript = (gems) => {
  if (!gems) return '#!/bin/bash';

  const installGemsArray = gems.map((name) => (
      `embulk gem install ${name}`
    )
  );

  return `#!/bin/bash\n${installGemsArray.join('\n')}`;
};


const createEmbulkConfig = (mashrConfigObj) => {
  const mashrConfig = mashrConfigObj.mashr;
  const embulkConfig = mashrConfigObj.embulk;

  const date = '{{ env.DATE }}'; // NOTE: `env.DATE`created by embulkScript.sh
  embulkConfig['out'] = {
    type: 'gcs',
    bucket: mashrConfig.integration_name,
    path_prefix: date,
    file_ext: '.json',
    auth_method: 'compute_engine',
    formatter: {
      type: 'jsonl'
    },
  };

  return yaml.safeDump(embulkConfig);
}

module.exports = {
  generateGCEResources,
  createEmbulkScript,
  createGemInstallationScript,
  createEmbulkConfig,
}
