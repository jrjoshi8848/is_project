import app from './app.js'; // Import the app from app.js
import sequelize from './config/db.js'; // Sequelize instance

const PORT = process.env.PORT || 5000;

// Test database connection and start the server
const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate(); // Check the database connection
    console.log('Database connected successfully.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

startServer();
