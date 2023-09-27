import amqp from 'amqplib';

const QUEUE_HOST = 'amqp://queue:5672';
const QUEUE_NAME = 'default-2';

export class Queue {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    this.connection = await amqp.connect(QUEUE_HOST);
    this.channel = await this.connection.createChannel();
  }

  async send(data: any) {
    const message = JSON.stringify(data);
    await this.channel.assertQueue(QUEUE_NAME, { durable: false });
    this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    console.log(" [x] Sent message", message);
  }

  async consume(callback: (data: any) => void) {
    await this.channel.assertQueue(QUEUE_NAME, { durable: false });
    await this.channel.prefetch(1);

    const ackStrategy = { noAck: false };
    
    this.channel.consume(QUEUE_NAME, async (msg) => {
      const data = JSON.parse(msg.content.toString());
      
      await callback(data);
      this.channel.ack(msg);
    }, ackStrategy);
  }
}

export const queue = new Queue();