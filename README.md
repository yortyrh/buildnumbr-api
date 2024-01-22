# BuildNumbr.com
[![ci](https://github.com/yortyrh/buildnumbr-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/yortyrh/buildnumbr-api/actions/workflows/ci.yml)

> Incrementing ios build numbers and android version codes as a service.

```sh
❯ curl -s https://buildnumbr.com/my-app
1
❯ curl -s https://buildnumbr.com/my-app
2
❯ curl -s https://buildnumbr.com/my-app
3
❯ curl -s https://buildnumbr.com/my-other-app
1
❯ curl -s https://buildnumbr.com/my-other-app/set/1234
1234
❯ curl -s https://buildnumbr.com/my-other-app
1235
# Get the current value without incrementing
❯ curl -s https://buildnumbr.com/my-other-app/get
1235
```

## Why?

- Automatically increasing the build number provides an easy means to identify the latest build in the sequence.
- Assigning a unique build number/version code to each build facilitates quick identification of problematic builds when issues arise.
- iOS developers must increment the build number for each uploaded binary; failure to do so leads to rejection, requiring recompilation and re-upload.
- Android developers must raise the version code for each app bundle upload; overlooking this results in rejection, even for a previous version.
- Ensuring continuous integration, without the need to manually commit build number/version code increments, is desirable.
- Achieving decentralized builds allows a subset of the team to build and deploy to Google Play/App Store while ensuring continuous incrementation of version codes/build numbers with each deployment.

## Integrating with your project

### IOS projects

Move into the folder where your Info.plist is and execute this command:

```sh
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion (curl https://buildnumbr.com/my-app)" Info.plist
```

### Android projects

In your build.gradle, make the `versionCode` variable:
`versionCode project.hasProperty('versionCode') ? project.property('versionCode') as int : 1`
then pass the version code like this:

```sh
./gradlew assembleRelease -PversionCode=$(curl https://buildnumbr.com/my-app)
```

### Fastlane

For iOS projects, use this step:

```rb
increment_build_number(
  xcodeproj: './ios/MyAwesomeApp.xcodeproj',
  build_number: sh('curl -s https://buildnumbr.com/my-app-ios')
)
```

For Android projects, first change the `build.gradle` file as described above. Then specify the versionCode during your Gradle step:

```rb
gradle(task: 'assemble', build_type: 'Release', properties: {
  versionCode: sh('curl -s https://buildnumbr.com/my-app-android')
})
```

### Expo
### Update app.json
```javascript
#!/usr/bin/env node
const fs = require('fs');
const execSync = require('child_process').execSync;
const config = require('./app.json');

const BUILD_NUMBER_COMPONENT_ID = 'my-app-ios';
const VERSION_CODE_COMPONENT_ID = 'my-app-android';

config.expo.ios.buildNumber=String(execSync(`curl -s https://buildnumbr.com/${BUILD_NUMBER_COMPONENT_ID}`));
config.expo.android.versionCode=Number(execSync(`curl -s https://buildnumbr.com/${VERSION_CODE_COMPONENT_ID}`));

fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
```
### Use app.config.js
```javascript
const execSync = require('child_process').execSync;

const BUILD_NUMBER_COMPONENT_ID = 'my-app-ios';
const VERSION_CODE_COMPONENT_ID = 'my-app-android';

module.exports = ({ config }) => {
  const buildNumber=String(execSync(`curl -s https://buildnumbr.com/${BUILD_NUMBER_COMPONENT_ID}`));
  const versionCode=Number(execSync(`curl -s https://buildnumbr.com/${VERSION_CODE_COMPONENT_ID}`));

  return {
    ...config,
    ios: {
      ...config.ios,
      buildNumber,
    },
    android: {
      ...config.android,
      versionCode,
    },
  };
};
```

## FAQ

- **My cURL also prints the progress, not just the build number!** <br>
  Try to add the -s flag to prevent progress being printed:

```sh
curl -s https://buildnumbr.com/my-app
```

- **There is no authentication! How do I prevent others from incrementing my build number?** <br>
  Just use an identifier that is really hard to guess, like https://buildnumbr.com/01hmqaf00ft6c98h1ytdxh6286. Maybe not that one exactly, but you get the idea.

- **How can I get a really hard to guess unique identifier?** <br>
```sh
npx ulid | sed -e 's/\(.*\)/\L\1/'
```
  
- **I incremented by accident. Can I go back?** <br>

```sh
# Get the current build number
❯ curl -s https://buildnumbr.com/my-app/get
456
# Set the previous value (There isn't any service to decrease the value)
❯ curl -s https://buildnumbr.com/my-app/set/455
455
```

- **I want to make sure the build number you are providing is actually a number** <br>
  You can add a check that the response that you get from buildnumbr.com is purely numeric.

```sh
export BUILD = $(curl https://buildnumbr.com/my-app)
re='^[0-9]+$'
    if ! [[ $BUILD =~ $re ]] ; then
    echo "error: Not a number" >&2; exit 1
fi
```

- **My current build number is already at 123. How can I make buildnumbr.com start from this number?**<br>
  There is another endpoint for this. Simply append `/set/{your_number}` and your counter will jump to this number.

```sh
curl https://buildnumbr.com/my-app/set/123
```

## Credits
This service is brought to you by [Yorty Ruiz Hernandez](https://linkedin.com/in/yorty)
