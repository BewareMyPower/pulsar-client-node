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

const Pulsar = require('../');

(async () => {

  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
    operationTimeoutSeconds: 30,
  });

  const schemaInfo = {
    schemaType: "Json",
    schema: JSON.stringify({
      type: 'record',
      name: 'Example',
      namespace: 'test',
      fields: [
        {
          name: 'a',
          type: 'int',
        },
        {
          name: 'b',
          type: 'int',
        },
      ],
    }),
  };

  const message = {
    a: 1,
    b: 2,
  };

// Create a producer
  const producer = await client.createProducer({
    topic: 'persistent://public/default/schema-test',
    sendTimeoutMs: 30000,
    batchingEnabled: true,
    schema: schemaInfo,
  });

// Send messages
  for (let i = 0; i < 100; i += 1) {
    message.a = i;
    message.b = i * 2;
    const data = JSON.stringify(message);
    producer.send({
      data: Buffer.from(data),
    });
    console.log(`Sent message: ${data}`);
  }
  await producer.flush();

  await producer.close();
  await client.close();;
})();
