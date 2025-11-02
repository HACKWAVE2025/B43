export const authorizedRoles = (
    ...allowedRoles
) => {
    return (req, res, next) => {
        const userRoles = req.user.roles;
        const hasPermission = userRoles.some(role => allowedRoles.includes(role));
        if (!hasPermission) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    }
}

