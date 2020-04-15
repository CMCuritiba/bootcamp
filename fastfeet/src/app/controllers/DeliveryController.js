import * as Yup from 'yup';

// import { startOfDay, endOfDay } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliverer from '../models/Deliverer';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const delivery = await Delivery.findAll({
      where: {
        canceled_at: null,
      },
      // order: [['start_date'], ['deliverer']],
      order: [['start_date']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.status(200).json({ delivery });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliverer_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const delivererExists = await Deliverer.findByPk(req.body.deliverer_id);

    if (!delivererExists) {
      return res.status(404).json({ error: 'Deliverer not found.' });
    }

    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    const { recipient_id, deliverer_id, product } = req.body;
    const delivery = await Delivery.create({
      recipient_id,
      deliverer_id,
      product,
    });

    /** Caso salvo ok, enviar e-mail para o entregador notificando-o */

    return res.status(200).json(delivery);
  }
}

export default new DeliveryController();
