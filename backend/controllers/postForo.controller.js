const PostForo = require('../models/postForo.model');
const User = require('../models/usuario.model');

// Crear un nuevo post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Verifica si req.user.id está disponible

    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: 'Usuario no autenticado o ID de usuario no disponible' });
    }

    const post = new PostForo({
      title,
      content,
      author: req.user.userId,  // Usa req.user.id para el ID del usuario autenticado
      category,
      tags,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Obtener todos los posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await PostForo.find().populate('author', 'name').populate('comments');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un post por su ID
exports.getPostById = async (req, res) => {
  try {
    const post = await PostForo.findById(req.params.id).populate('author', 'name').populate('comments');
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await PostForo.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un post
exports.deletePost = async (req, res) => {
  try {
    const post = await PostForo.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.status(200).json({ message: 'Post eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
