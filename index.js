// Testing application only Meant to be
const application = require('./packages/core');

if (require.main === module) {
    console.debug('This module should be called upon via another module and not directly ran');
    /*
    const config = {
        rest: {
            port: +(process.env.PORT || 3000),
            host: process.env.HOST,
            openApiSpec: {
                // useful when used with OpenAPI-to-GraphQL to locate your application
                setServersFromRequest: true,
            },
        },
    };
    application.main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
    */
}