import express from 'express';
import routes from './routes/index';
import { sequelize } from "./db/index";

export const app = express();
app.use(express.json());
app.use('/', routes);

export const startServer = async (): Promise<void> => {
  let retries = 0;
  const MAX_RETRIES = 5;
  const RETRY_INTERVAL = 3000;
  const PORT = 5000;

  const tryConnecting = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connected to database.');

      try {
        await sequelize.query('SELECT 1 FROM `urls` LIMIT 1;');
        console.log('Database schema exists, syncing...');
      } catch (err) {
        console.log('Database schema does not exist, creating...');
        await sequelize.sync({ force: true });
      }

      app.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
      });
    } catch (error) {
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Failed to connect to database. Retrying in ${RETRY_INTERVAL / 1000} seconds... (${retries}/${MAX_RETRIES})`);
        setTimeout(tryConnecting, RETRY_INTERVAL);
      } else {
        console.log('Max retries reached. Exiting...');
        await sequelize.close();
        process.exit(1);
      }
    }
  };

  await tryConnecting();
};

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  setTimeout(() => {
    console.log("Exiting");
    sequelize.close();
    process.exit(0);
  }, 500);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Start the server only if this script is the main module
if (require.main === module) {
  startServer();
}
