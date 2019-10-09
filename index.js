// Testing application only Meant to be
// A file like this will need to be copied over to the new application
// const application = require('@uniformity/core');
const application = require('./packages/core');

if (require.main === module) {
    const config = {
        rest: {
            port: +(process.env.PORT || 3000),
            host: process.env.HOST,
            openApiSpec: {
                // useful when used with OpenAPI-to-GraphQL to locate your application
                setServersFromRequest: true,
            },
            // Use the LB4 application as a route. It should not be listening.
            listenOnStart: false,
        },
    };
    application.main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}