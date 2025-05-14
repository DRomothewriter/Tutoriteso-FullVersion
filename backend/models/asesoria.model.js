const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AsesoriaSchema = new Schema({
  materia: {
    type: Schema.Types.ObjectId,
    ref: 'Materia', // Modelo de materias
    required: true,
  },
  asesor: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Modelo de usuarios, en donde se incluye el rol de "asesor"
    required: true,
  },
  plataforma: {
    type: String,
    enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'WhatsApp', "Discord", 'Otro'],
    required: true,
  },  
  plataformaPersonalizada: {
    type: String,
    required: false,  // Solo si la plataforma es "Otro"
    validate: {
      validator: function(v) {
        return this.plataforma !== 'Otro' || (v && v.length > 0);
      },
      message: props => `La plataforma personalizada es requerida si la plataforma es "Otro".`
    }
  },
  sesiones: [{
    fecha:{
      type: Date,
      required: true,  // Fecha y hora específica para la sesión
    },
    posiblesAsesorados: [{
      type: Schema.Types.ObjectId, ref: 'Usuario',
      required: false
    }],
    activa: {
      type: Boolean,
      default: true,  // Marca si la sesión está activa o si ya se completó/canceló
    },
  }],
  duracion: {
    type: Number,
    required: false,
    default: 60  // Duración de la sesión en minutos
  },  
});

module.exports = mongoose.model('Asesoria', AsesoriaSchema);
