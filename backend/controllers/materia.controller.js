const Materia = require('../models/materia.model');

// Crear una nueva materia
exports.createMateria = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const materia = new Materia({
      name,
      description,
      category,
    });
    await materia.save();
    res.status(201).json(materia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener todas las materias
exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();
    res.status(200).json(materias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una materia por su ID
exports.getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });
    res.status(200).json(materia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar una materia
exports.updateMateria = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { name, description, category },
      { new: true }
    );
    if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });
    res.status(200).json(materia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar una materia
exports.deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);
    if (!materia) return res.status(404).json({ message: 'Materia no encontrada' });
    res.status(200).json({ message: 'Materia eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
