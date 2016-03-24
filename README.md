# uniformity [![npm](https://img.shields.io/npm/v/uniformity.svg)](https://www.npmjs.com/package/uniformity) [![Build Status](https://travis-ci.org/apocist/uniformity.svg?branch=master)](https://travis-ci.org/apocist/uniformity) [![Join the chat at https://gitter.im/apocist/uniformity](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/apocist/uniformity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

First attempts at a CMS

## Install 

Install from npm using:

```sh
$ npm install uniformity
```

Configure your correct Twitter API settings in ./config/social/twitter.blank.js then rename to 'twitter.js'

**NOTE**: Any *minor* version updates may require a `npm install` to acquire the latest libraries. During Alpha stages, updates will not be considered backwards-compatible.

## Plugins

Install any needed plugins stored in the npm repository.
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

The service will then state it is running on the port configured in `/config/env/development.js`.

## Notes

It has been known that on Windows platforms, it may be necessary to install [node-gyp](https://www.npmjs.com/package/node-gyp) globally with:

```sh
$ npm install -g node-gyp
```
