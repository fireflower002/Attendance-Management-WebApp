import { app } from './app.js';
import dotenv from 'dotenv';
import connectToDB from './db/conn.js';

// Load environment variables
dotenv.config();  // will read .env from backend root

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });
