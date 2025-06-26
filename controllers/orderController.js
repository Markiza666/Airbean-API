import Order from '../models/Order.js';
import { format, addHours, isBefore, isAfter } from 'date-fns'; // Import date/time functions 

/**
 * @desc    Creates a new order
 * @route   POST /api/orders
 * @access  Private (authentication needed)
 */

const createOrder = async (req, res) => {
  // req.user.userId from authentication-middleware.
  const userId = req.user.userId;
  const { items, deliveryAddress } = req.body;
  // Validates that 'items' contains at least one product
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Beställningen måste innehålla minst en vara' });
  }
  // Validates that 'deliveryAddress' is complete (street, city, zip code)
  if (!deliveryAddress || typeof deliveryAddress !== 'object' || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
    return res.status(400).json({ error: 'Leveransadress är obligatorisk och måste vara komplett (gata, stad, postnummer' })
  }
  // Validates each item has 'product' with 'price' and a positive 'quantity'
  for (const item of items) {
    if (!item.product || !item.product.price || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return res.status(400).json({ error: 'Alla varor måste ha ett pris och en giltig kvantitet.' });
    }
  }

  try {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
      eta: newOrder.eta.toISOString(), // ETA in standard ISO-format
      status: newOrder.status,
      userId: newOrder.userId,
      total: newOrder.total,
      deliveryAddress: newOrder.deliveryAddress,
    });

  } catch (error) {
    console.error("Fel vid skapande av beställning:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod när beställningen skulle skapas. Försök igen senare." });
  }
};

/**
 * @desc    Get status for specific order 
 * @route   GET /api/orders/:orderId/status
 * @access  Private (authentication required)
 */
const getOrderStatus = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  // Check if orderId in params is the expected format
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Ogiltigt beställnings-ID.' });
  }

  try {
    const order = await Order.findOne({ userId, orderId });

    if (!order) {
      return res.status(404).json({ error: "Beställningen hittades inte eller tillhör inte dig." });
    }

    // Count current time and get relevant timestamps from the order.
    const now = new Date();
    const etaTime = new Date(order.eta);
    const orderedAtTime = new Date(order.orderedAt);

    let currentStatus = order.status; // Starts with status from the database
    let deliveryMessage = "";

    if (order.status === "Delivered") { // If status is already set to Delivered in DB
      deliveryMessage = "Din beställning är levererad!";
    } else if (isBefore(now, etaTime)) { // If current time is before ETA. 
      currentStatus = "Pågående"; // Keep status as Pending
      deliveryMessage = `Förväntad leverans: ${format(etaTime, 'HH:mm')}`;
    } else { // If current time is after ETA and status not already Delivered.
      currentStatus = "Levererad";
      deliveryMessage = "Din beställning är levererad!";
      order.status = "Delivered"; // Set status to "Delivered" 
      await order.save();  // Save changes in database
    }

    // Send detailed order status to client
    res.json({
      orderId: order.orderId,
      status: currentStatus,
      eta: order.eta.toISOString(), // ETA in ISO-format
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
 * @desc    Gets users orderhistory
 * @route   GET /api/orders/history
 * @access  Private (authentication required)
 */
const getOrderHistory = async (req, res) => {
  const userId = req.user.userId; // Get user-id from authentication token

  try {
    // Get all orders for user, filtered as latest orders 
    const orders = await Order.find({ userId }).sort({ orderedAt: -1 });

    const now = new Date(); // Current time for dynamic status estimation

    // Count total amount for user for all orders
    // Use reduce to iterate through 'orders' array and sum 'total' for each order
    const totalAmountSpent = orders.reduce((sum, order) => sum + order.total, 0);

    const processedOrders = orders.map(order => {
      const etaTime = new Date(order.eta);
      const orderedAtTime = new Date(order.orderedAt);

      let statusDisplay = order.status;
      // Set status to "Delivered" if ETA has passed and is still pending 
      if (order.status === "Pending" && isAfter(now, etaTime)) {
        statusDisplay = "Levererad";
      }

      return {
        orderId: order.orderId,
        items: order.items, // All ordered items 
        total: order.total, // Total price
        orderedAt: format(orderedAtTime, 'yyyy-MM-dd HH:mm:ss'), // Time format
        eta: format(etaTime, 'HH:mm'), // ETA format
        status: statusDisplay, // Updated status
        deliveryAddress: order.deliveryAddress,
      };
    });

    // Send order history and total amount spent. 
    res.json({
      history: processedOrders, // Array with all individual orders
      totalAmountSpent: totalAmountSpent // The new totalt amount
    });

  } catch (error) {
    console.error("Fel vid hämtning av orderhistorik:", error.message);
    res.status(500).json({ error: "Ett serverfel uppstod vid hämtning av orderhistorik." });
  }
};

export { createOrder, getOrderStatus, getOrderHistory };