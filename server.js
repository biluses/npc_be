require('@babel/register');

/* eslint-disable no-console */
const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');
const serverMain = http.createServer(app);
const io = socketIO(serverMain,{
	cors: {
		origin: '*',
	}
});
global.io = io;
global.activeUsers=[]

require('./src/socket/index')

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
    dotenv.config({ path: '.env' });
    const port = process.env.APP_PORT || 8000;
    const server = serverMain.listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
};
setUpExpress()
