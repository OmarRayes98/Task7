require("dotenv").config();
const express = require('express');
const connectDB = require("./config/dbConnection");
const cors = require('cors');
var compression = require('compression')

const app = express();


// Middleware to parse JSON
app.use(express.json());

// compress all responses
app.use(compression({
  level:6,
  threshold:100 *1000 // less than 100KB no need to compression
}));


// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

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