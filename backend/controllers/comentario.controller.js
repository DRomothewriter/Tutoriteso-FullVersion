const Comentario = require('../models/comentario.model');

// Crear un nuevo comentario
exports.createComentario = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comentario = new Comentario({
      content,
      author: req.user.userId,  // Asumimos que el usuario está autenticado
      post: postId,
    });
    await comentario.save();
    res.status(201).json(comentario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener comentarios de un post
exports.getComentariosByPost = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ post: req.params.postId }).populate('author', 'name');
    res.status(200).json(comentarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
