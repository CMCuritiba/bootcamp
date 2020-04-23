import Mail from '../../lib/Mail';

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellationMail';
  }

  /* Resolver questão de acesso aos atributos da encomenda para passar no corpo da mensagem */
  async handle({ data }) {
    const { delivery } = data; // aqui vai dar problema por causa do nome da variável na tela anterior
    await Mail.sendMail({
      to: `${delivery.deliverer.name} <${delivery.deliverer.email}>`,
      subject: 'Delivery cancelled',
      template: 'cancelDelivery',
      context: {
        deliverer: delivery.deliverer.name,
        recipient: delivery.recipient.name,
        product: delivery.product,
      },
    });

    console.log('Queue steped');
  }
}

export default new DeliveryCancellationMail();
