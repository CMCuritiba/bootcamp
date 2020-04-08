import * as Yup from 'yup';

import Deliverer from '../models/Deliverer';
// import File from '../models/File'

class DelivererController {
  async index(req, res) {
    const deliverers = await Deliverer.findAll();

    return res.json(deliverers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const delivererExists = await Deliverer.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (delivererExists) {
      return res.status(400).json({ error: 'Deliverer already exists.' });
    }

    return res.json({ error: 'TESTAR PORQUE AVATAR_ID NÃO ESTÁ SALVANDO' });

    // const { id, name, email, avatar } = await Deliverer.create(req.body);

    // return res.json({ id, name, email, avatar });
  }
}

export default new DelivererController();
