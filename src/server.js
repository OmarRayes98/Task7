require("dotenv").config();
const express = require('express');
const connectDB = require("./config/dbConnection");
const app = express();


// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const videoRoutes = require('./routes/videoRoutes');
const courseRoutes = require('./routes/courseRoutes');


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/courses', courseRoutes);


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});