# fbStarter
A starter project for Ionic/Angular/Firebase by Matthew Angelini.

## Setup

### Dependencies (Must Install First)
* [Node and npm](https://nodejs.org/)
* [Bower](http://bower.io/) - `npm install -g bower`
* [Gulp](http://gulpjs.com/) - `npm install -g gulp`
* [Ionic](http://ionicframework.com/) - `npm install -g cordova ionic`


### Environment
1. `git clone https://github.com/mjangelini/fbStarter.git`
1. `cd fbStarter`
1.  `npm install`

## Build Process

### Development
Run `ionic serve` to view and work with the application locally.

### iOS Simulator (only for OSX)
1. `ionic platform add ios` - Add iOS Platform
1. `ionic plugin add cordova-plugin-inappbrowser` - Add browser support for social login
1. `ionic plugin add cordova-plugin-statusbar` - Add statusbar for color changes
1. `ionic build ios` - Build iOS App
1. `ionic emulate ios` - Run iOS App in iOS Emulator

## Firebase Data & Security
If you would like to setup your own Firebase for testing, the files are included

### Firebase Data
* `firebaseData.json`

### Firebase Security
* `firebaseSecurity.json`