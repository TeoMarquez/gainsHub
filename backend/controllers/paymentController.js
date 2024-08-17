const Stripe = require('stripe');
const { STRIPE_PRIVATE_KEY } = require('../config/stripe');

const stripe = new Stripe(STRIPE_PRIVATE_KEY);

const createSession = async (req, res) => {
  try {
    const { items } = req.body;

    // Validación básica
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        product_data: {
          name: item.title,
        },
        currency: 'usd',
        unit_amount: item.unit_price * 100, // Convierte a centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    console.log(session);
    return res.json({ url: session.url });
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession
};
