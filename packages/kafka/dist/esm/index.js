import { Kafka } from 'kafkajs';
import { Topics } from '@repo/core';
let kafka;
let producer;
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
};
export const produceMessage = async (message) => {
    await producer.connect();
    await producer.send({
        topic: message.topic,
        messages: [{ value: JSON.stringify(message.message) }],
    });
};
export class KafkaConsumer {
    async start() {
        this.consumer = kafka.consumer({ groupId: this.groupId });
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                await this.onMessage(JSON.parse(message.value.toString()));
            },
        });
    }
    async stop() {
        this.consumer.stop();
    }
}
//# sourceMappingURL=index.js.map