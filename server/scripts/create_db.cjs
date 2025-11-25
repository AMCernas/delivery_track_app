const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: './.env' });

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error('No DATABASE_URL found in server/.env');
  process.exit(2);
}

const url = raw.replace(/^"|"$/g, '');

try {
  const parsed = new URL(url);
  const targetDb = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname.slice(1) : 'deliverydb';
  // connect to default 'postgres' database to create target database
  parsed.pathname = '/postgres';
  const adminConn = parsed.toString();

  console.log('Attempting to connect to', parsed.hostname, 'as', parsed.username, 'port', parsed.port);

  const client = new Client({ connectionString: adminConn });

  client.connect()
    .then(() => {
      console.log('Connected to server, creating database', targetDb);
      return client.query(`CREATE DATABASE "${targetDb}"`);
    })
    .then(() => {
      console.log('Database created successfully (or already exists).');
      return client.end();
    })
    .catch((err) => {
      console.error('Error creating database:', err.message || err);
      process.exit(1);
    });
} catch (err) {
  console.error('Invalid DATABASE_URL format:', err.message || err);
  process.exit(2);
}
