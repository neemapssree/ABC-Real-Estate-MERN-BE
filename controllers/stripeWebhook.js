
const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express');
const bodyParser = require('body-parser');
const { route } = require('../routes');

const router = express.Router();


// Match the raw body to content type application/json
router.use(bodyParser.raw({ type: 'application/json' }));

router.post('/webhook', async (req, res) => {
  console.log("Inside stripe webhook");
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {        
        event = stripe.webhooks.constructEvent(req.rawBody, sig, stripe);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const paymentIntentId = session.payment_intent;    
        

        console.log('PaymentIntent was successful!');
    
    break;    
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }  

  // Return a 200 response to acknowledge receipt of the event
  res.json({received: true});
});

module.exports = router