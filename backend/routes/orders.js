const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const logger = require('../utils/logger');
const { sendSMS, sendEmail } = require('../services/NotificationService');

// Get all orders for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        o.order_id,
        o.order_number,
        o.order_status,
        o.payment_status,
        o.total_amount,
        o.delivery_date,
        o.delivery_time_slot,
        o.created_at,
        COUNT(oi.order_item_id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.user_id = ?
    `;

    const params = [userId];

    if (status) {
      sql += ' AND o.order_status = ?';
      params.push(status);
    }

    sql += ' GROUP BY o.order_id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const orders = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams = [userId];
    
    if (status) {
      countSql += ' AND order_status = ?';
      countParams.push(status);
    }

    const [{ total }] = await query(countSql, countParams);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get specific order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;

    // Get order details
    const orderSql = `
      SELECT 
        o.*,
        ua.address_line1,
        ua.address_line2,
        ua.city,
        ua.state,
        ua.postal_code,
        ua.phone
      FROM orders o
      JOIN user_addresses ua ON o.delivery_address_id = ua.address_id
      WHERE o.order_id = ? AND o.user_id = ?
    `;

    const [order] = await query(orderSql, [orderId, userId]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order items
    const itemsSql = `
      SELECT 
        oi.*,
        p.product_image,
        p.product_description
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `;

    const items = await query(itemsSql, [orderId]);

    // Get tracking information
    const trackingSql = `
      SELECT * FROM order_tracking 
      WHERE order_id = ? 
      ORDER BY created_at ASC
    `;

    const tracking = await query(trackingSql, [orderId]);

    res.json({
      success: true,
      data: {
        order,
        items,
        tracking
      }
    });
  } catch (error) {
    logger.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// Create new order
router.post('/', [
  body('delivery_address_id').isInt().withMessage('Valid delivery address is required'),
  body('payment_method').isIn(['cod', 'online', 'card', 'upi', 'wallet']).withMessage('Valid payment method is required'),
  body('delivery_date').isDate().withMessage('Valid delivery date is required'),
  body('delivery_time_slot').notEmpty().withMessage('Delivery time slot is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product_id').isInt().withMessage('Valid product ID is required'),
  body('items.*.quantity').isFloat({ min: 0.1 }).withMessage('Valid quantity is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.user_id;
    const { delivery_address_id, payment_method, delivery_date, delivery_time_slot, special_instructions, items } = req.body;

    // Validate delivery address belongs to user
    const addressSql = 'SELECT * FROM user_addresses WHERE address_id = ? AND user_id = ?';
    const [address] = await query(addressSql, [delivery_address_id, userId]);

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery address'
      });
    }

    // Check inventory availability for all items
    for (const item of items) {
      const inventorySql = `
        SELECT COALESCE(SUM(quantity_available), 0) as available
        FROM product_inventory 
        WHERE product_id = ? AND is_active = TRUE AND expiry_date > CURDATE()
      `;
      const [result] = await query(inventorySql, [item.product_id]);
      
      if (result.available < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for product ID ${item.product_id}`
        });
      }
    }

    // Create order using transaction
    const result = await transaction(async (connection) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create order
      const orderSql = `
        INSERT INTO orders (order_number, user_id, delivery_address_id, payment_method, 
                          delivery_date, delivery_time_slot, special_instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [orderResult] = await connection.execute(orderSql, [
        orderNumber, userId, delivery_address_id, payment_method,
        delivery_date, delivery_time_slot, special_instructions
      ]);
      
      const orderId = orderResult.insertId;
      let subtotal = 0;

      // Add order items
      for (const item of items) {
        // Get product details
        const productSql = 'SELECT * FROM products WHERE product_id = ? AND is_active = TRUE';
        const [product] = await connection.execute(productSql, [item.product_id]);
        
        if (!product) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        // Get available inventory
        const inventorySql = `
          SELECT inventory_id, quantity_available 
          FROM product_inventory 
          WHERE product_id = ? AND quantity_available >= ? AND is_active = TRUE
          ORDER BY expiry_date ASC LIMIT 1
        `;
        const [inventory] = await connection.execute(inventorySql, [item.product_id, item.quantity]);
        
        if (!inventory) {
          throw new Error(`Insufficient inventory for product ${item.product_id}`);
        }

        const unitPrice = product.sale_price || product.base_price;
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        // Add order item
        const itemSql = `
          INSERT INTO order_items (order_id, product_id, inventory_id, product_name, 
                                 unit_price, quantity, unit_type, total_price, final_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await connection.execute(itemSql, [
          orderId, item.product_id, inventory.inventory_id, product.product_name,
          unitPrice, item.quantity, product.unit_type, totalPrice, totalPrice
        ]);

        // Update inventory
        const updateInventorySql = `
          UPDATE product_inventory 
          SET quantity_available = quantity_available - ?,
              quantity_reserved = quantity_reserved + ?
          WHERE inventory_id = ?
        `;
        
        await connection.execute(updateInventorySql, [
          item.quantity, item.quantity, inventory.inventory_id
        ]);
      }

      // Calculate totals
      const taxAmount = subtotal * 0.05; // 5% tax
      const deliveryFee = 30; // Fixed delivery fee
      const totalAmount = subtotal + taxAmount + deliveryFee;

      // Update order totals
      const updateOrderSql = `
        UPDATE orders 
        SET subtotal = ?, tax_amount = ?, delivery_fee = ?, total_amount = ?
        WHERE order_id = ?
      `;
      
      await connection.execute(updateOrderSql, [
        subtotal, taxAmount, deliveryFee, totalAmount, orderId
      ]);

      // Add initial tracking entry
      const trackingSql = `
        INSERT INTO order_tracking (order_id, tracking_status, status_description)
        VALUES (?, 'order_placed', 'Order has been placed successfully')
      `;
      
      await connection.execute(trackingSql, [orderId]);

      return { orderId, orderNumber, totalAmount };
    });

    // Send notifications
    const userSql = 'SELECT mobile, email, first_name FROM users WHERE user_id = ?';
    const [user] = await query(userSql, [userId]);

    // Send SMS notification
    if (user.mobile) {
      await sendSMS(user.mobile, `Your order #${result.orderNumber} has been placed successfully. Total: ₹${result.totalAmount}`);
    }

    // Send email notification
    if (user.email) {
      await sendEmail(user.email, 'Order Confirmation', `Your order #${result.orderNumber} has been placed successfully.`);
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('order-created', {
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      totalAmount: result.totalAmount
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        totalAmount: result.totalAmount
      }
    });

  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Cancel order
router.patch('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;
    const { reason } = req.body;

    // Check if order exists and belongs to user
    const orderSql = 'SELECT * FROM orders WHERE order_id = ? AND user_id = ?';
    const [order] = await query(orderSql, [orderId, userId]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.order_status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    // Cancel order using transaction
    await transaction(async (connection) => {
      // Update order status
      const updateOrderSql = `
        UPDATE orders 
        SET order_status = 'cancelled', cancellation_reason = ?
        WHERE order_id = ?
      `;
      
      await connection.execute(updateOrderSql, [reason, orderId]);

      // Restore inventory
      const restoreInventorySql = `
        UPDATE product_inventory pi
        JOIN order_items oi ON pi.inventory_id = oi.inventory_id
        SET pi.quantity_available = pi.quantity_available + oi.quantity,
            pi.quantity_reserved = pi.quantity_reserved - oi.quantity
        WHERE oi.order_id = ?
      `;
      
      await connection.execute(restoreInventorySql, [orderId]);

      // Add tracking entry
      const trackingSql = `
        INSERT INTO order_tracking (order_id, tracking_status, status_description)
        VALUES (?, 'cancelled', ?)
      `;
      
      await connection.execute(trackingSql, [orderId, `Order cancelled: ${reason}`]);
    });

    // Send notification
    const userSql = 'SELECT mobile, email FROM users WHERE user_id = ?';
    const [user] = await query(userSql, [userId]);

    if (user.mobile) {
      await sendSMS(user.mobile, `Your order #${order.order_number} has been cancelled successfully.`);
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user-${userId}`).emit('order-cancelled', {
      orderId,
      orderNumber: order.order_number
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    logger.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// Track order in real-time
router.get('/:orderId/track', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.user_id;

    // Get order tracking information
    const trackingSql = `
      SELECT 
        ot.*,
        o.order_number,
        o.delivery_date,
        o.delivery_time_slot
      FROM order_tracking ot
      JOIN orders o ON ot.order_id = o.order_id
      WHERE ot.order_id = ? AND o.user_id = ?
      ORDER BY ot.created_at ASC
    `;

    const tracking = await query(trackingSql, [orderId, userId]);

    if (tracking.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Join user to order tracking room for real-time updates
    const io = req.app.get('io');
    req.socket.join(`order-${orderId}`);

    res.json({
      success: true,
      data: tracking
    });

  } catch (error) {
    logger.error('Error tracking order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track order'
    });
  }
});

module.exports = router; 