import Mail from '../../lib/Mail';

class NotifyDelivererMail {
  get key() {
    return 'NotifyDelivererMail';
  }

  /* Resolver questão de acesso aos atributos da encomenda para passar no corpo da mensagem */
  async handle(delivery) {
    await Mail.sendMail({
      to: `${delivery.delivererName} <${delivery.delivererEmail}>`,
      subject: 'Nova encomenda para retirada',
      template: 'notifyDeliverer',
      context: {
        deliverer: delivery.delivererName,
        recipient: delivery.recipientName,
        product: delivery.product,
      },
    });

    console.log('A fila executou');
  }
}

export default new NotifyDelivererMail();
