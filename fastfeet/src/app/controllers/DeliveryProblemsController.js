import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliverer from '../models/Deliverer';

class DeliveryProblemsController {
  async index(req, res) {
    // const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      include: [{ model: DeliveryProblem, as: 'problems', required: true }],
    });
    return res.status(200).json(deliveries);
  }

  async show(req, res) {
    const delivery_id = req.params.id;

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id,
      },
      order: ['created_at'],
    });
    return res.status(200).json(problems);
  }

  async store(req, res) {
    const deliveryId = req.params.id;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Description does not exist.' });
    }

    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already concluded.' });
    }

    const { description } = req.body;
    const problem = await DeliveryProblem.create({
      delivery_id: deliveryId,
      description,
    });

    return res.status(200).json(problem);
  }

  async delete(req, res) {
    const deliveryId = req.params.id;

    const delivery = await Delivery.findByPk(deliveryId, {
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliverer, as: 'deliverer' },
      ],
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(401).json({ error: 'Delivery already canceled' });
    }

    delivery.canceled_at = new Date();

    delivery.save();

    Queue.add(DeliveryCancellationMail.key, { delivery });

    return res.status(200).json(delivery);
  }
}

export default new DeliveryProblemsController();
