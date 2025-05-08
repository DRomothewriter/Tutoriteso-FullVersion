// middleware/roles.js
exports.isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

exports.isOwnerOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin' || req.user?.userId === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Not authorized.' });
};
