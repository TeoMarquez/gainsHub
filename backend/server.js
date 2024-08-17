const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const appRoutes = require('./routes/appRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const wishlistRoutes = require('./routes/wishlistRoutes.js');
const historicorderRoutes = require('./routes/historicorderRoutes.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', appRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', historicorderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
