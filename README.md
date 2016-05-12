# uniformity [![npm](https://img.shields.io/npm/v/uniformity.svg)](https://www.npmjs.com/package/uniformity) [![Build Status](https://travis-ci.org/apocist/uniformity.svg?branch=master)](https://travis-ci.org/apocist/uniformity) [![Join the chat at https://gitter.im/apocist/uniformity](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/apocist/uniformity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A simple but highly customizable NodeJS CMS. Still in alpha development, but provides modular plug and play capabilities to offer only the features you're looking for in a website.

Cannot be used in a production environment at this time.

## Install 

Install from npm using:

```sh
$ npm install uniformity
```

You will need an Authentication Plugin to perform any changes. The only one available at this time can be installed via
```sh
$ npm run plugin 'uniformity-auth-twitter'
```
Configure your correct Twitter API settings in ./config/config.json (refer to ./config/defaults.json at [uniformity-auth-twitter](https://github.com/apocist/uniformity-auth-twitter))

**NOTE**: Any *minor* version updates may require a `npm install` to acquire the latest libraries. During Alpha stages, updates will not be considered backwards-compatible.

## Plugins

Install any other needed plugins stored in the npm repository.
Example:
```sh
$ npm run plugin 'uniformity-blog'
```

## Dependencies

#####Needed to install separately
- [Mongo Database](https://www.mongodb.org/)
- [node-gyp](https://www.npmjs.com/package/node-gyp) (see notes)

## Usage

**NOTE**: A Mongo Database is required before starting the uniformity service.

```sh
$ npm start
```

The service will then state it is running on the port configured in `./config/config.json`.

## Notes

It has been known that on Windows platforms, it may be necessary to install [node-gyp](https://www.npmjs.com/package/node-gyp) globally with:

```sh
$ npm install -g node-gyp
```
