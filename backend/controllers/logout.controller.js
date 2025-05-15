const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/'
  });
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = { logout };