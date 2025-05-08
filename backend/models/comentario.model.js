const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
  content: {
    type: String,
    required: true,  // El contenido del comentario es obligatorio
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',  // Relacionado con el modelo de Usuario (quién hizo el comentario)
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'PostForo',  // Relacionado con el post en el que se hizo el comentario
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Fecha de creación del comentario
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Fecha de la última actualización del comentario
  },
});

comentarioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();  // Actualiza la fecha de modificación cuando se guarde el comentario
  next();
});

module.exports = mongoose.model('Comentario', comentarioSchema);
