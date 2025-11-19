require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/candidates', require('./routes/candidates'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
  if (err.message && err.message.includes('Only .pdf files are allowed')) {
    return res.status(400).json({ message: 'Only .pdf files are allowed as resume' });
  }
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next(err);
});

app.get('/', (req, res) => res.send('Candidate Referral API running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
