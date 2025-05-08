const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postForoSchema = new Schema({
  title: {
    type: String,
    required: true,  // El título es obligatorio
  },
  content: {type: String,required: true,  // El contenido del post es obligatorio
  },
  author: {
    type: Schema.Types.ObjectId,  ref: 'Usuario', // Relación con el modelo de Usuario (quién publicó el post)
    required: true,
  },
  category: {
    type: String,  // Puedes usar una categoría para organizar los posts (ej. Tecnología, Salud, etc.)
    required: true,
  },
  tags: [{
    type: String,  // Etiquetas asociadas con el post para facilitar la búsqueda
  }],
  comments: [{
    type: Schema.Types.ObjectId, ref: 'Comentario', // Relación con el modelo de comentarios
  }],
  createdAt: {
    type: Date,
    default: Date.now,  // Fecha de creación automática
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Fecha de la última actualización
  },
  active: {
    type: Boolean, default: true,  // El estado del post (activo o inactivo)
  },
});

postForoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();  // Actualiza la fecha de modificación cuando se guarde el post
  next();
});

module.exports = mongoose.model('PostForo', postForoSchema);
