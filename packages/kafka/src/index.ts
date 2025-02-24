import { Consumer, Kafka, Producer } from 'kafkajs';
import { Topics } from '@repo/core';
let kafka: Kafka;
let producer: Producer;

export const initKafka = async () => {
  kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
  });
  producer = kafka.producer();
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic: Topics.CREATE_LIST }],
  });
  await admin.disconnect();
}

interface IMessage<T> {
  topic: Topics;
  message: T;
}

export const produceMessage = async <T>(message: IMessage<T>) => {
  await producer.connect();
  await producer.send({
    topic: message.topic,
    messages: [{ value: JSON.stringify(message.message) }],
  });
};


export abstract class KafkaConsumer<T> {
  abstract topic: string;
  abstract groupId: string;
  private consumer: Consumer;

  abstract onMessage(message: T): Promise<boolean>;

  async start() {
    this.consumer = kafka.consumer({ groupId: this.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await this.onMessage(JSON.parse(message.value.toString()) as T);
      },
    });
  }

  async stop() {
    this.consumer.stop();
  }
}