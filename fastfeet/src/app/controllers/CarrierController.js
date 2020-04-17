import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class CarrierController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliverer_id: req.params.id,
        end_date: null,
        canceled_at: null,
      },
      limit: 2,
      offset: (page - 1) * 2,
    });

    return res.status(200).json(deliveries);
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliverer_id: req.params.id,
        end_date: {
          [Op.not]: null,
        },
      },
      limit: 2,
      offset: (page - 1) * 2,
    });

    return res.status(200).json(deliveries);
  }
}

export default new CarrierController();
