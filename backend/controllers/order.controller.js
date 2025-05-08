
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress, items } = req.body;

        // Verifica que el usuario exista
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let subtotal = 0;

        // Construir los items y calcular subtotal
        const orderItems = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.id);
            if (!product) throw new Error(`Product ID ${item.id} not found in DB`);

            const totalPrice = product.price * item.quantity;
            subtotal += totalPrice;

            return {
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        }));

        const tax = subtotal * 0.16;
        const total = subtotal + tax;

        // Crear orden con items + arreglo de IDs de productos
        const order = new Order({
            user: user._id,
            shippingAddress,
            items: orderItems,
            products: orderItems.map(item => item.product), // <-- nuevo campo
            subtotal,
            tax,
            total,
            date: new Date() // <- este campo ya tiene default, pero puedes forzarlo si quieres
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const orders = await Order.find({user: userId}).populate('user', 'name email').populate('items.product', 'description price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'description price');
        if (!order) return res.status(404).json({ message: 'Order no found.' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
