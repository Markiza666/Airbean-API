import Order from '../models/Order.js';
import { format, addHours, isBefore, isAfter } from 'date-fns'; // Importerar datum/tid-funktioner från npm-paketet date-fns

//JSDoc-kommentarer (/** ... */): Jag har lagt till JSDoc-kommentarer ovanför varje funktion som beskriver funktionen, routen, och accessnivån.
/**
 * @desc    Skapar en ny beställning
 * @route   POST /api/orders
 * @access  Private (kräver autentisering)
 */

const createOrder = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Felaktig data' });
  }

  try {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const newOrder = new Order({
      userId, 
      items,
      total,
      deliveryAddress, 
      orderedAt: new Date(),
      status: 'Pending',
      eta: addHours(new Date(), 0.5), 
    });
    await newOrder.save();
    res.json({ orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte skapa order' });
  }
};

/**
 * @desc    Hämtar status för en specifik beställning
 * @route   GET /api/orders/:orderId/status
 * @access  Private (kräver autentisering)
 */
const getOrderStatus = async (req, res) => {
  const userId = req.user.userId; // Hämta användar-ID från autentiserad token
  const { orderId } = req.params; // Hämta order-ID från URL-parametrarna

  try {
    // 1. Hitta beställningen i databasen
    // Sök efter beställningen med både användar-ID och order-ID för att säkerställa att användaren äger ordern.
    const order = await Order.findOne({ userId, orderId });

    // 2. Hantera om beställningen inte hittas
    if (!order) {
      return res.status(404).json({ error: "Beställningen hittades inte eller tillhör inte dig." });
    }

    // 3. Beräkna aktuell tid och hämta relevanta tidsstämplar från beställningen
    const now = new Date();
    const etaTime = new Date(order.eta);
    const orderedAtTime = new Date(order.orderedAt);

    let currentStatus = order.status;    // Starta med den status som finns i DB
    let deliveryMessage = "";            // Meddelande till användaren om leverans

    // 4. Logik för att bestämma den *visade* statusen och meddelandet dynamiskt
    if (order.status === "Delivered") {
      // Om status redan är "Delivered" i DB
      deliveryMessage = "Din beställning är levererad!";
    } else if (isBefore(now, etaTime)) {
      // Om aktuell tid är FÖRE den uppskattade leveranstiden (ETA)
      currentStatus = "Pågående"; // Uppdaterar status för visning
      deliveryMessage = `Förväntad leverans: ${format(etaTime, 'HH:mm')}`;
    } else {
      // Om aktuell tid är EFTER den uppskattade leveranstiden (ETA) och den inte är "Delivered" i DB
      // Antar vi att den borde vara levererad. (I en verklig app skulle status uppdateras på serversidan av t.ex. en leveransprocess)
      currentStatus = "Levererad"; // Uppdaterar status för visning
      deliveryMessage = "Din beställning är levererad!";
    }

    // 5. Skicka tillbaka den detaljerade orderstatusen till klienten
    res.json({
      orderId: order.orderId,
      status: currentStatus, // Den dynamiskt bestämda statusen
      eta: order.eta.toISOString(), // ETA i ISO-format
      deliveryMessage,
      orderedAt: format(orderedAtTime, 'yyyy-MM-dd HH:mm:ss'), // Beställningstidpunkt formaterad
      items: order.items, // Inkludera beställda varor
      total: order.total, // Inkludera totalpris
      deliveryAddress: order.deliveryAddress, // Inkludera leveransadress
    });

  } catch (error) {
    // 6. Felhantering
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
    // 1. Hämta alla beställningar för det specifika användar-ID:t
    // Använder .sort({ orderedAt: -1 }) för att få de senaste beställningarna först.
    const orders = await Order.find({ userId }).sort({ orderedAt: -1 });

    const now = new Date(); // Aktuell tid för dynamisk statusberäkning

    // 2. Bearbeta varje beställning för att formatera data och bestämma visningsstatus
    const processedOrders = orders.map(order => {
      const etaTime = new Date(order.eta);
      const orderedAtTime = new Date(order.orderedAt);

      let statusDisplay = order.status; // Börja med statusen från DB
      // Om ordern fortfarande är "Pending" men ETA har passerats, visa den som "Levererad" i historiken.
      if (order.status === "Pending" && isAfter(now, etaTime)) {
        statusDisplay = "Levererad";
      }

      // 3. Returnera ett objekt med de relevanta detaljerna för historikvisning
      return {
        orderId: order.orderId,
        items: order.items,                      // Alla beställda varor
        total: order.total,                      // Totalpris
        orderedAt: format(orderedAtTime, 'yyyy-MM-dd HH:mm:ss'), // Beställningstidpunkt formaterad
        eta: format(etaTime, 'HH:mm'),           // ETA formaterad (bara tid)
        status: statusDisplay,                   // Den dynamiskt uppdaterade statusen för visning
        deliveryAddress: order.deliveryAddress,  // Leveransadress
      };
    });

    // 4. Skicka tillbaka den bearbetade beställningshistoriken
    res.json(processedOrders);

  } catch (error) {
    // 5. Felhantering
    console.error("Fel vid hämtning av orderhistorik:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod vid hämtning av orderhistorik." });
  }
};

export default { createOrder, getOrderStatus, getOrderHistory };