import "dotenv/config";

import { CreateListConsumer } from "./consumers/create-list.consumer";
import { initKafka } from "@repo/kafka";



const consumers = [
  new CreateListConsumer(),
]

const f = async () => {
  await initKafka();
  for (const consumer of consumers) {
    await consumer.start();
  }
}

f();