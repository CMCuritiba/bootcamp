import { Op } from 'sequelize';
import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  parseISO,
  addHours,
  isBefore,
  isAfter,
} from 'date-fns';

import Delivery from '../models/Delivery';
import File from '../models/File';

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
      limit: 10,
      offset: (page - 1) * 2,
    });

    return res.status(200).json(deliveries);
  }

  async catch(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return req.status(400).json({ error: 'Invalid parameter' });
    }

    // passa id da entrega
    const delivery = await Delivery.findByPk(req.params.id);

    // verifica se a encomenda existe

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    const parseDate = parseISO(req.body.start_date);

    // Retirada deve ocorrer entre 8 e 18h.
    const workDayStart = addHours(startOfDay(parseDate), 8);
    const workDayEnd = addHours(startOfDay(parseDate), 18);

    if (isBefore(parseDate, workDayStart) || isAfter(parseDate, workDayEnd)) {
      return res
        .status(400)
        .json({ error: 'Start date should be at commercial time' });
    }

    const checkDeliveriesLimit = await Delivery.findAndCountAll({
      where: {
        deliverer_id: delivery.deliverer_id,
        start_date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
    });

    if (checkDeliveriesLimit.count > 4) {
      return res.status(400).json({ error: 'Day delivery limit exceeded.' });
    }

    delivery.start_date = parseDate;
    delivery.save();

    return res.status(200).json(delivery);
  }

  async drop(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return req.status(400).json({ error: 'Invalid parameter' });
    }

    // passa id da entrega
    const delivery = await Delivery.findByPk(req.params.id);

    // verifica se a encomenda existe

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    if (!delivery.start_date) {
      return res.status(401).json({ error: 'Delivery not picked-up yet.' });
    }

    if (isAfter(delivery.start_date, delivery.end_date)) {
      return res
        .status(401)
        .json({ error: "Delivery date can't be before the pick-up." });
    }

    const parseDate = parseISO(req.body.end_date);

    // verificar se o ID do arquivo realmente existe
    const file = await File.findByPk(req.body.signature_id);
    if (!file) {
      return res.status(404).json({ error: 'Signature file not found.' });
    }

    delivery.end_date = parseDate;
    delivery.signature_id = req.body.signature_id;

    delivery.save();

    return res.status(200).json(delivery);
  }
}

export default new CarrierController();
