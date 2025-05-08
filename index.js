const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Koneksi ke MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rute dasar, hanya menampilkan pesan "Server is running"
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB');
});

// Menjalankan server pada port yang ditentukan
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
