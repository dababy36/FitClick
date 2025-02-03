const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3301,
    user: 'clickfit_user',
    password: 'clickfit_password',
    database: 'click_fit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Successfully connected to database.');
});

// Handle errors after initial connection
connection.on('error', function(err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Lost connection to MySQL server. Reconnecting...');
        connection.connect();
    } else {
        throw err;
    }
});

module.exports = connection;
