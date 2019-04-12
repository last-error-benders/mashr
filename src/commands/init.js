const path = require("path");
const fs = require('fs');
const ora = require('ora');

module.exports = async (args) => {
  const spinner = ora().start();

  try {
    const workingDir = path.resolve("./");
    const destination = `${workingDir}/mashr_config.yml`;
    const configTemplate = `${__dirname}/${'../../templates/mashr_template.yml'}`
    await fs.copyFile(configTemplate, destination);
    spinner.stop()
  } catch (err) {
    spinner.stop()
  }
}
