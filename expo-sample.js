#!/usr/bin/env node
const fs = require('fs');
const execSync = require('child_process').execSync;
const config = require('./app.json');

const BUILD_NUMBER_COMPONENT_ID = 'my-buildnumber-app-ios';
const VERSION_CODE_COMPONENT_ID = 'my-buildnumber-app-android';
const COMMIT_MESSAGE = process.argv[2] || 'new build number';

config.expo.ios.buildNumber=String(execSync(`curl -s https://buildnumbr.com/${BUILD_NUMBER_COMPONENT_ID}`));
config.expo.android.versionCode=Number(execSync(`curl -s https://buildnumbr.com/${VERSION_CODE_COMPONENT_ID}`));

fs.writeFileSync('app.json', JSON.stringify(config, null, 2));

execSync('git add app.json');
execSync(`git commit -m '${COMMIT_MESSAGE} -- buildNumber: ${config.expo.ios.buildNumber}, versionCode: ${config.expo.android.versionCode}'`);
