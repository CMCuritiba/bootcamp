import Mail from '../../lib/Mail';

class NotifyDelivererMail {
  get key() {
    return 'NotifyDelivererMail';
  }

  /* Resolver questão de acesso aos atributos da encomenda para passar no corpo da mensagem */
  async handle({ data }) {
    const { deliveryMail } = data;
    await Mail.sendMail({
      to: `${deliveryMail.deliverer.name} <${deliveryMail.deliverer.email}>`,
      subject: 'Nova encomenda para retirada',
      template: 'notifyDeliverer',
      context: {
        deliverer: deliveryMail.deliverer.name,
        recipient: deliveryMail.recipient.name,
        product: deliveryMail.product,
      },
    });

    console.log('A fila executou');
  }
}

export default new NotifyDelivererMail();
