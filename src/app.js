let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
} );
let stream = require( './ws/stream' );
let path = require( 'path' );

// Serve index.html at root
app.get( '/', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'index.html' ) );
} );

// Serve static files
app.use( express.static( path.join( __dirname ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

io.of( '/stream' ).on( 'connection', stream );

const PORT = process.env.PORT || 3000;
server.listen( PORT, () => {
    console.log( `Server running on port ${PORT}` );
} );

// Handle errors
process.on( 'unhandledRejection', ( reason, promise ) => {
    console.error( 'Unhandled Rejection at:', promise, 'reason:', reason );
} );