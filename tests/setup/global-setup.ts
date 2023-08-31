import { sequelize } from "../../src/db/index";

export default async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("An error occurred during initialization:", error);
    process.exit(1);
  }
};
