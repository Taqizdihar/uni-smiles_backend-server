require('dotenv').config();

const express = require('express');
const cors = require('cors');

const publicRoutes = require('./routes/v1/publicRoutes');
const kioskRoutes = require('./routes/v1/kioskRoutes');
const adminRoutes = require('./routes/v1/adminRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Uni-Smiles API Server is running' });
});

app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/kiosk', kioskRoutes);
app.use('/api/v1/admin', adminRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Uni-Smiles API Server is running on port ${PORT}`);
});
