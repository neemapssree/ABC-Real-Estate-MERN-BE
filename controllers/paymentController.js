const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const PROP_SCHEDULES = require('./Models/propSchedules');
const stripeWebHook = require('./stripeWebhook');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const orders = async (req,res) => {
    console.log("--------------Inside payment controller--------------");
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message: 'Authorization header is missing' });
    }
    try{
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
        const userId = decodedToken.userId;
    

    const slotData = await PROP_SCHEDULES.findOne({_id:req.body.slotid});
    if(slotData?.bookedBy){
        res.status(400).json({message:'Slot already Booked'});
    }
    else{
        const prop = req.body.property.propname;
        const propid = req.body.propid;
        const slotid = req.body._id;
        const date = req.body.date;
        const time = req.body.slot.name;
        const paymentText = `Booking for Viewing ${prop} on ${date} at ${time}`;
        // const unitAmount = calculateUnitAmount();
        const unitAmount = req.body.bookingcharge;
        //const propimg = req.body.propimg;
        // Generate a unique order ID         
        const orderId = generateOrderId();

        const line_items = [{            
            price_data: {
                currency: 'aed',
                product_data: {
                    name: paymentText,                    
                },                
                unit_amount: unitAmount*100,                
            },
            quantity: 1,
        }];

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.URL_IS}/success?orderId=${orderId}&slotDate=${date}&slotTime=${time}&prop=${prop}`,
            cancel_url: `${process.env.URL_IS}/cancel`,
            payment_intent_data: {
                metadata: {
                    orderId: orderId,
                    userId: userId,
                },
            },
        });

        await PROP_SCHEDULES.findOneAndUpdate(
            {_id:slotid},
            { bookedBy:userId, orderId:orderId }        
        );
        initiateEmail(slotid,orderId);
        
        res.send({url: session.url});
    }
} catch (error) {
    console.error('Error decoding token:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
}
};

function generateOrderId() {
    const timestamp = new Date().getTime();
    const randomId = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomId}`;
}
const initiateEmail = async (id,orderId) => {
    const slotData = await PROP_SCHEDULES.findOne({_id:id}).populate('bookedBy').populate('propId');
    const {date,slot,bookedBy,propId} = slotData;
    
    const transporter = nodemailer.createTransport({        
        secure: true, // Use SSL/TLS
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "testneema123@gmail.com",
          pass: "ntrt ktmi oekt gbtw",
        },
        port: 465, // Gmail SMTP port for SSL
        host: 'smtp.gmail.com', // Gmail SMTP server
      });
      
        const info = await transporter.sendMail({
        from: "testneema123@gmail.com",
        to: bookedBy.email,
        subject: "Booking Confirmed",
        text: "Thanks for booking with us !",
        html: `<b>Hello ${bookedBy.name}</b> <br>
                your booking for ${propId.propname} on ${new Date(date)} at ${slot.name} has been confirmed with orderid ${orderId}     
        `,
        });
        console.log("Message sent: %s", info.messageId);          
}
// const calculateUnitAmount = () => {    
//     return 10000;  
// }

// async function updateDatabaseAndSendEmail(orderId, slotid, userId) {
//     // Ensure you have access to the PROP_SCHEDULES model
//     const PROP_SCHEDULES = require('./Models/propSchedules');    

//     await PROP_SCHEDULES.findOneAndUpdate(
//         { _id: slotid },
//         { bookedBy: userId, orderId: orderId }
//     );
//     initiateEmail(slotid, orderId);
// }

module.exports = {orders, generateOrderId}