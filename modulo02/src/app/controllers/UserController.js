import User from '../models/User';

class UserController {
  async store(req, res) {
    const usuarioExistente = await User.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExistente) {
      return res
        .status(400)
        .json({
          error: 'Usuário já existe.',
          usuario: {
            id: usuarioExistente.id,
            nome: usuarioExistente.name,
            email: usuarioExistente.email,
            provider: usuarioExistente.provider,
          },
        });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
