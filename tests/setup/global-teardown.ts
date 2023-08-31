import { sequelize } from "../../src/db/index";

export default async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log("Successfully closed the database connection.");
  } catch (error) {
    console.error("An error occurred during cleanup:", error);
  }
};
