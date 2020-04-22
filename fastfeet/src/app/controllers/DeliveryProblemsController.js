import * as Yup from 'yup';
import { parseISO } from 'date-fns';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

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

    const deliveryExists = await Delivery.findByPk(deliveryId);
    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    if (deliveryExists.end_date) {
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

    const deliveryExists = await Delivery.findByPk(deliveryId);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    deliveryExists.canceled_at = parseISO(new Date());

    // console.log(parseISO(new Date('YYYY-mm-DD')));

    // deliveryExists.save();

    return res.status(200).json({ ok: `Delivery ID ${deliveryId} cancelled.` });
  }
}

export default new DeliveryProblemsController();
