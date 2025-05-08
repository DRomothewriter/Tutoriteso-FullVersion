const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AsesoriaSchema = new Schema({
  materia: {
    type: String,
    required: true,
  },
  asesor: {
    type: Schema.Types.ObjectId,ref: 'Usuario', // Modelo de usuarios, en donde se incluye el rol de "asesor"
    required: true,
  },
  sesiones: [{
    fecha: {
      type: Date,
      required: true,  // Fecha y hora específica para la sesión
    },
    posiblesAsesorados: [{
      type: Schema.Types.ObjectId, ref: 'Usuario',
      required: true
    }],
    activa: {
      type: Boolean,
      default: true,  // Marca si la sesión está activa o si ya se completó/canceló
    },
  }],
});

module.exports = mongoose.model('Asesoria', AsesoriaSchema);
