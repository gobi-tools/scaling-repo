import amqp from 'amqplib';

const QUEUE_HOST = 'amqp://queue:5672';
const QUEUE_NAME = 'default-2';

export class Queue {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isConnected: boolean = false;

  private async connect() {
    this.connection = await amqp.connect(QUEUE_HOST);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE_NAME, { durable: false });
    this.isConnected = true;
  }

  async send(data: any) {
    if (!this.isConnected) {
      await this.connect();
    }

    const message = JSON.stringify(data);
    this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    // console.log(" [x] Sent message", message);
  }

  async consume(callback: (data: any) => void) {
    if (!this.isConnected) {
      await this.connect();
    }
    
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