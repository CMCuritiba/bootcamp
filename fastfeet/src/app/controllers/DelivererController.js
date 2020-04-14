import * as Yup from 'yup';

import { Op } from 'sequelize';

import Deliverer from '../models/Deliverer';
import File from '../models/File';

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

    const { id, name, email, avatar } = await Deliverer.create(req.body);

    return res.json({ id, name, email, avatar });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { id } = req.params;

    const deliverer = await Deliverer.findByPk(id);

    if (!deliverer) {
      return res.status(404).json({ error: 'Deliverer not found.' });
    }

    const { avatar_id, email } = req.body;

    const delivererDupEmail = await Deliverer.findOne({
      where: {
        email,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (delivererDupEmail) {
      return res.status(404).json({ error: 'Email already exists' });
    }

    if (avatar_id) {
      const file = await File.findByPk(avatar_id);

      if (!file) {
        return res.status(401).json({ error: 'Avatar file not found!!!' });
      }
    }

    if (req.body.avatar_id === 0) {
      req.body.avatar_id = null;
    }
    const { name } = await deliverer.update(req.body);

    return res.json({ name, email, avatar_id });
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivererExists = await Deliverer.findByPk(id);

    if (!delivererExists) {
      return res.status(404).json({ error: 'Deliverer not found' });
    }

    delivererExists.active = false;

    await delivererExists.save();

    return res.status(200).json({ message: 'Deliverer deleted!' });
  }
}

export default new DelivererController();
