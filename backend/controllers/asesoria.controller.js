const Asesoria = require('../models/asesoria.model');

// Crear una nueva asesoría
exports.createAsesoria = async (req, res) => {
  try {
    const { materia, sesiones } = req.body;
    console.log(req.user)
    console.log(req.user.userId)
    const asesoria = new Asesoria({
      materia,
      asesor: req.user.userId,  // Se asume que el usuario está autenticado
      sesiones,
    });
    await asesoria.save();
    res.status(201).json(asesoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener todas las asesorías
exports.getAsesorias = async (req, res) => {
  try {
    const asesorias = await Asesoria.find().populate('asesor', 'name').populate('sesiones.posiblesAsesorados');
    res.status(200).json(asesorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una asesoría por su ID
exports.getAsesoriaById = async (req, res) => {
  try {
    const asesoria = await Asesoria.findById(req.params.id).populate('asesor', 'name').populate('sesiones.posiblesAsesorados');
    if (!asesoria) return res.status(404).json({ message: 'Asesoría no encontrada' });
    res.status(200).json(asesoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar una asesoría
exports.updateAsesoria = async (req, res) => {
  try {
    const { materia, sesiones } = req.body;
    const asesoria = await Asesoria.findByIdAndUpdate(
      req.params.id,
      { materia, sesiones },
      { new: true }
    );
    if (!asesoria) return res.status(404).json({ message: 'Asesoría no encontrada' });
    res.status(200).json(asesoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar una asesoría
exports.deleteAsesoria = async (req, res) => {
  try {
    const asesoria = await Asesoria.findByIdAndDelete(req.params.id);
    if (!asesoria) return res.status(404).json({ message: 'Asesoría no encontrada' });
    res.status(200).json({ message: 'Asesoría eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
