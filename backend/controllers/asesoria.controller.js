const Asesoria = require('../models/asesoria.model');
const Materia = require('../models/materia.model');

// Crear una nueva asesoría
exports.createAsesoria = async (req, res) => {
  try {
    const { materia, plataforma, plataformaPersonalizada, sesiones, duracion } = req.body;

    // Validar materia existente
    const materiaExistente = await Materia.findById(materia);
    if (!materiaExistente) {
      return res.status(400).json({ message: 'Materia no encontrada' });
    }

    // Validar plataforma y plataforma personalizada
    const plataformasValidas = ['Google Meet', 'Zoom', 'Microsoft Teams', 'WhatsApp', 'Discord', 'Otro'];
    if (!plataformasValidas.includes(plataforma)) {
      return res.status(400).json({ message: 'Plataforma no válida' });
    }

    if (plataforma === 'Otro' && (!plataformaPersonalizada || plataformaPersonalizada.trim() === '')) {
      return res.status(400).json({ message: 'Debe especificar una plataforma personalizada si eligió "Otro"' });
    }

    // Validar duración en rango 30-180
    if (duracion !== undefined && (duracion < 30 || duracion > 180)) {
      return res.status(400).json({ message: 'La duración debe estar entre 30 y 180 minutos' });
    }

    // Crear nueva asesoría
    const asesoria = new Asesoria({
      materia,
      asesor: req.user.userId,
      plataforma,
      plataformaPersonalizada: plataforma === 'Otro' ? plataformaPersonalizada : undefined,
      sesiones,
      duracion: duracion ?? 60 // Usa 60 si no se envió nada
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
    const asesorias = await Asesoria.find()
      .populate('asesor', 'name')
      .populate('sesiones.posiblesAsesorados')
      .populate('materia', 'name')
      .populate('materia', 'url'); // <- corregido aquí

    res.status(200).json(asesorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener asesorías del asesor autenticado
exports.getAsesoriasByAsesor = async (req, res) => {
  try {
    const asesorId = req.user.userId; // <- lo tomamos del token decodificado

    const asesorias = await Asesoria.find({ asesor: asesorId })
      .populate('materia', 'name')
      .populate('asesor', 'name')
      .populate('sesiones.posiblesAsesorados')
      .populate('materia', 'url'); // <- corregido aquí

    res.status(200).json(asesorias);
  } catch (err) {
    console.error("Error al obtener asesorías del asesor:", err);
    res.status(500).json({ message: 'Error al obtener asesorías del asesor' });
  }
};

// Obtener una asesoría por su ID
exports.getAsesoriaById = async (req, res) => {
  try {
    const asesoria = await Asesoria.findById(req.params.id).populate('asesor', 'name').populate('sesiones.posiblesAsesorados').populate('materia', 'name').populate('materia', 'url');
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
