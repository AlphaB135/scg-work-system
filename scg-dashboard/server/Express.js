const express = require('express');
const cors = require('cors');

const app = express();
const { calculateTax, calculateProgressiveTax } = require('./ai/taxAI');
const { calculateSocialSecurity, calculateTieredSocialSecurity } = require('./ai/socialSecurityAI');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.post('/api/calculateTax', (req, res) => {
  const { salary } = req.body;
  const tax = calculateTax(salary);
  res.json({ tax });
});

app.post('/api/calculateSocialSecurity', (req, res) => {
  const { salary } = req.body;
  const socialSecurity = calculateSocialSecurity(salary);
  res.json({ socialSecurity });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
