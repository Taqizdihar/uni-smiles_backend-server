require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Uni-Smiles API Server is running' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Uni-Smiles API Server is running on port ${PORT}`);
});
