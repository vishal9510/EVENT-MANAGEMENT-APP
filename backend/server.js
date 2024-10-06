const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// / Serve static files (event images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const router = require('./routes/authRoutes');
const eventrouter = require('./routes/eventRoutes');


// Use Routes
app.use('/api/auth', router);
app.use('/api/event', eventrouter);




// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

