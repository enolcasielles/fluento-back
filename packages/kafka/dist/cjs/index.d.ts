import { Topics } from '@repo/core';
export declare const initKafka: () => Promise<void>;
interface IMessage<T> {
    topic: Topics;
    message: T;
}
export declare const produceMessage: <T>(message: IMessage<T>) => Promise<void>;
export declare abstract class KafkaConsumer<T> {
    abstract topic: string;
    abstract groupId: string;
    private consumer;
    abstract onMessage(message: T): Promise<boolean>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map