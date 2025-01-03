// server.js

import app from './app.js'; // Import the app from app.js
import sequelize from './config/db.js'; // Sequelize instance

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }) // Sync the database
  .then(() => {
    console.log('Database synced successfully');
    // Start the server after database sync
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });