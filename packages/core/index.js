const application = require('./dist');

module.exports = application;

if (require.main === module) {
    console.debug('This module should be called upon via another module and not directly ran');
    /*console.log('application', application);
    // Run the application
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
    });*/
}