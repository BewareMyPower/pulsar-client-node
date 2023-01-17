#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

# NOTE: This script should only run inside a Node.js docker container.
# See ./load-test.sh for details.
set -ex

# Create an empty directory to test
mkdir -p /app && cd /app
tar zxf /pulsar-client-node/pulsar-client-node.tar.gz
cp /pulsar-client-node/build/Release/Pulsar.node .

# Import the Pulsar.node instead of the node-gyp binding
sed -i 's/src\/pulsar-binding/Pulsar/' index.js
grep -n "require" index.js
find src/ -name "*.js" | xargs sed -i 's/\.\/pulsar-binding/..\/Pulsar/'
find src/ -name "*.js" | xargs grep -n "require"
find . -name "*.node"

# Test if Pulsar.node can be loaded
node pkg/load_test.js
