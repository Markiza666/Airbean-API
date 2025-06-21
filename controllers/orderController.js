import Order from '../models/Order.js';
import { format, addHours, isBefore, isAfter } from 'date-fns'; // Importerar datum/tid-funktioner från npm-paketet date-fns

// Jag har lagt till JSDoc-kommentarer ovanför varje funktion som beskriver funktionen, routen, och accessnivån.
/**
 * @desc    Skapar en ny beställning
 * @route   POST /api/orders
 * @access  Private (kräver autentisering)
 */

const createOrder = async (req, res) => {
  // req.user.userId kommer från autentiserings-middleware.
  const userId = req.user.userId;
  const { items, deliveryAddress} = req.body;

  if (!items || !Array.isArray(items) || items.length===0) {
    return res.status(400).json({ error: 'Beställningen måste innehålla minst en vara' });
  }

  if (!deliveryAddress || typeof deliveryAddress !== 'object' || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zip) {
    return res.status(400).json({ error: 'Leveransadress är obligatorisk och måste vara komplett (gata, stad, postnummer'})
  }
  // Validerar att 'items' arrayen innehåller objekt med 'product' och 'quantity' och att 'product' har ett 'price'. Annars kan reduce-funktionen krascha eller ge felaktiga totaler.
  for (const item of items) {
      if (!item.product || !item.product.price || typeof item.quantity !== 'number' || item.quantity <= 0) {
          return res.status(400).json({ error: 'Alla varor måste ha ett pris och en giltig kvantitet.' });
      }
  }

  try {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
    const orderId =`order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = await Order.create({
      userId,                    
      orderId,                   
      items,                     
      total,                     
      deliveryAddress,          
      orderedAt: new Date(),     
      status: "Pending",         
      eta: addHours(new Date(), 0.5), 
    });

    res.status(201).json({
      message: "Din beställning är nu skickad!",
      orderId: newOrder.orderId,
      eta: newOrder.eta.toISOString(), // ETA i standard ISO-format
      status: newOrder.status,
      userId: newOrder.userId, 
      total: newOrder.total,
    });

  } catch (error) {
    console.error("Fel vid skapande av beställning:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod när beställningen skulle skapas. Försök igen senare." });
  }
};

/**
 * @desc    Hämtar status för en specifik beställning
 * @route   GET /api/orders/:orderId/status
 * @access  Private (kräver autentisering)
 */
const getOrderStatus = async (req, res) => {
  const userId = req.user.userId; 
  const { orderId } = req.params; 

  // Kontrollerar att orderId i params är i ett förväntat format
  if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Ogiltigt beställnings-ID.' });
  }

  try { 
    const order = await Order.findOne({ userId, orderId });

    if (!order) {
      return res.status(404).json({ error: "Beställningen hittades inte eller tillhör inte dig." });
    }

    // Beräknar aktuell tid och hämtar relevanta tidsstämplar från beställningen
    const now = new Date();
    const etaTime = new Date(order.eta);
    const orderedAtTime = new Date(order.orderedAt);

    let currentStatus = order.status; // Startar med statusen från databasen
    let deliveryMessage = "";

    if (order.status === "Delivered") { // Om statusen redan är satt till Delivered i DB
        deliveryMessage = "Din beställning är levererad!";
    } else if (isBefore(now, etaTime)) { // Om nuvarande tid är före ETA
        currentStatus = "Pågående"; // Behåll status som Pending/Pågående
        deliveryMessage = `Förväntad leverans: ${format(etaTime, 'HH:mm')}`;
    } else { // Om nuvarande tid är efter ETA (och status inte redan Delivered)
        currentStatus = "Levererad";
        deliveryMessage = "Din beställning är levererad!";
        order.status = "Delivered"; // Sätt den faktiska statusen till "Delivered"
        await order.save();  // Spara ändringen i databasen
    }

    // Skicka tillbaka den detaljerade orderstatusen till klienten
    res.json({
      orderId: order.orderId,
      status: currentStatus, 
      eta: order.eta.toISOString(), // ETA i ISO-format
      deliveryMessage,
      orderedAt: format(orderedAtTime, 'yyyy-MM-dd HH:mm:ss'), 
      items: order.items,
      total: order.total, 
      deliveryAddress: order.deliveryAddress, 
    });

  } catch (error) {
    console.error("Fel vid hämtning av orderstatus:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod vid hämtning av orderstatus." });
  }
};

/**
 * @desc    Hämtar en användares beställningshistorik
 * @route   GET /api/orders/history
 * @access  Private (kräver autentisering)
 */
const getOrderHistory = async (req, res) => {
  const userId = req.user.userId; // Hämta användar-ID från autentiserad token

  try {   
    // Sorterar efter senast beställda först
    const orders = await Order.find({ userId }).sort({ orderedAt: -1 });

    const now = new Date(); // Aktuell tid för dynamisk statusberäkning

    const processedOrders = orders.map(order => {
      const etaTime = new Date(order.eta);
      const orderedAtTime = new Date(order.orderedAt);

      let statusDisplay = order.status; 
      if (order.status === "Pending" && isAfter(now, etaTime)) {
        statusDisplay = "Levererad";
      }

      return {
        orderId: order.orderId,
        items: order.items, // Alla beställda varor
        total: order.total, // Totalpris
        orderedAt: format(orderedAtTime, 'yyyy-MM-dd HH:mm:ss'), // Beställningstidpunkt formaterad
        eta: format(etaTime, 'HH:mm'), // ETA formaterad
        status: statusDisplay, // Den dynamiskt uppdaterade status
        deliveryAddress: order.deliveryAddress, 
      };
    });

    res.json(processedOrders);

  } catch (error) {
    console.error("Fel vid hämtning av orderhistorik:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod vid hämtning av orderhistorik." });
  }
};

export { createOrder, getOrderStatus, getOrderHistory };