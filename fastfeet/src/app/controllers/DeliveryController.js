import * as Yup from 'yup';

// import { startOfDay, endOfDay } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliverer from '../models/Deliverer';
import Recipient from '../models/Recipient';

import NotifyDelivererMail from '../jobs/NotifyDelivererMail';
import Queue from '../../lib/Queue';

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
    /* Resolver questão de acesso aos atributos da encomenda para passar no corpo da mensagem */
    const deliveryMail = await Delivery.findByPk(delivery.id, {
      include: [
        { model: Deliverer, as: 'deliverer', attributes: ['name', 'email'] },
        { model: Recipient, as: 'recipient', attributes: ['name'] },
      ],
    });

    await Queue.add(NotifyDelivererMail.key, {
      deliveryMail,
    });

    return res.status(200).json(deliveryMail);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliverer_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string(),
      canceled_at: Yup.date().nullable(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const deliveryId = req.params.id;

    const deliveryExists = await Delivery.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    const delivererExists = await Deliverer.findByPk(req.body.deliverer_id);

    if (!delivererExists) {
      return res.status(404).json({ error: 'Deliverer not found.' });
    }

    const recipientExists = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExists) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    const { recipient_id, deliverer_id, product, canceled_at } = req.body;

    await deliveryExists.update({
      recipient_id,
      deliverer_id,
      product,
      canceled_at,
    });

    return res.json({ recipient_id, deliverer_id, product, canceled_at });
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exist.' });
    }
    await delivery.destroy();
    return res.status(200).json({ ok: 'Delivery deleted.' });
  }
}

export default new DeliveryController();
