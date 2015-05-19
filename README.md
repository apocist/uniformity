# uniformity
First attempts at a CMS
## Install
After pulling the package from Github.
```sh
$ npm install
```
**NOTE** For future commits, any *minor* version updates may require a `npm install`. Until v1, all updates will not be considered backwards-compatible.
## Dependencies

#####Included
- [body-parser](https://www.npmjs.com/package/body-parser)
- [bson-ext](https://www.npmjs.com/package/bson-ext)
- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [mongoose-auto-increment](https://www.npmjs.com/package/mongoose-auto-increment)
- [mongoose-schema-extend](https://www.npmjs.com/package/mongoose-schema-extend)
- [swig](https://www.npmjs.com/package/exprswigess)

#####Needed to install seperately
- [Mongo Database](https://www.mongodb.org/)
- [node-gyp](https://www.npmjs.com/package/node-gyp) (see notes)

## Usage

**NOTE** It is very important that a Mongo Database is running before starting the uniformity service.

```sh
$ node server
```

Depending on the setting configured, service will state that it is running on the set port.

## Notes
It has been known that on Windows platforms, it may be necessary to install [node-gyp](https://www.npmjs.com/package/node-gyp) globally with:
```sh
$ npm install -g node-gyp
```
