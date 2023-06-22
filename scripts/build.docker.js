import fs from 'fs';
import { spawn } from 'child_process';

function getPackageJson() {
  const content = fs.readFileSync('package.json');
  return JSON.parse(content);
}

function runCmd(command, options) {
  return new Promise((resolve, reject) => {
    const instance = spawn(command, options, { stdio: 'inherit' });
    instance.on('error', reject);
    instance.on('close', resolve);
  });
}

async function build() {
  const packageJson = getPackageJson();
  const dockerImage = packageJson.name + ':' + packageJson.version;
  const fullDockerImage = packageJson.author + '/' + dockerImage;
  await runCmd('docker', ['build', '-t', dockerImage, '.']);
  await runCmd('docker', ['tag', dockerImage, fullDockerImage]);
  await runCmd('docker', ['push', fullDockerImage]);
}

build();
