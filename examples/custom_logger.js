/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const Pulsar = require('..');

(async () => {
    // Create a client
    const client = new Pulsar.Client({
        serviceUrl: 'pulsar://localhost:6650',
        operationTimeoutSeconds: 30,
        log: (level, file, line, message) => {
            console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
        },
        logLevel: Pulsar.LogLevel.DEBUG,
    });

    // Create a producer
    const producer = await client.createProducer({
        topic: 'persistent://public/default/my-topic',
        sendTimeoutMs: 30000,
        batchingEnabled: true,
    });

    // Create a consumer
    const consumer = await client.subscribe({
        topic: 'persistent://public/default/my-topic',
        subscription: 'sub1',
        subscriptionType: 'Shared',
        ackTimeoutMs: 10000,
    });

    const msg = `my-message`;
    await producer.send({
        data: Buffer.from(msg),
    });

    const receivedMsg = await consumer.receive();
    console.log(receivedMsg.getData().toString());
    await consumer.acknowledge(receivedMsg);

    await producer.close();
    await consumer.close();
    await client.close();
})();
