"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumer = exports.produceMessage = exports.initKafka = void 0;
const kafkajs_1 = require("kafkajs");
const core_1 = require("@repo/core");
let kafka;
let producer;
const initKafka = async () => {
    kafka = new kafkajs_1.Kafka({
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
    });
    producer = kafka.producer();
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [{ topic: core_1.Topics.CREATE_LIST }],
    });
    await admin.disconnect();
};
exports.initKafka = initKafka;
const produceMessage = async (message) => {
    await producer.connect();
    await producer.send({
        topic: message.topic,
        messages: [{ value: JSON.stringify(message.message) }],
    });
};
exports.produceMessage = produceMessage;
class KafkaConsumer {
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
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=index.js.map