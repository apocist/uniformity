# uniformity [![Join the chat at https://gitter.im/apocist/uniformity](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/apocist/uniformity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

First attempts at a CMS

## Install

After pulling the package from Github.

```sh
$ npm install
```

**NOTE**: Any *minor* version updates may require a `npm install` to acquire the latest libraries. During Alpha stages, updates will not be considered backwards-compatible.

## Dependencies

#####Included
- [body-parser](https://www.npmjs.com/package/body-parser)
- [bson-ext](https://www.npmjs.com/package/bson-ext)
- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [mongoose-auto-increment](https://www.npmjs.com/package/mongoose-auto-increment)
- [mongoose-schema-extend](https://www.npmjs.com/package/mongoose-schema-extend)
- [swig](https://www.npmjs.com/package/swig)
- [vhost](https://www.npmjs.com/package/vhost)

#####Needed to install seperately
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
