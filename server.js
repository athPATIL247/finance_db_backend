import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synced.");

    app.listen(PORT, () => {
      const externalUrl =
        process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      console.log(`Server running on ${externalUrl}`);
      console.log(`Swagger docs at ${externalUrl}/api/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
