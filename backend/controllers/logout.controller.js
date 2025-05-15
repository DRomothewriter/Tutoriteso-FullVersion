const logout = async (req, res) => {
  res.clearCookie('token'); // Cambia 'token' por el nombre de tu cookie de sesión/JWT
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
}
module.exports = { logout };
