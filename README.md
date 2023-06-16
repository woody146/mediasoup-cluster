## Mediasoup cluster

Cluster use PostgreSQL server to save data of slave servers

```
                                                            +----------------+
         +-----------------+          webrtc                |  slave server  |
         | produver client |------------------------------->|  for producer  |
         +-----------------+                                +----------------+
                  |                                             ^      |
                  |                +---------------+            |      |
                  +--------------->|               |------------+      | mediasoup
                       http        | master server |   http            |   pipe
                  +--------------->|               |------------+      | transport
                  |                +---------------+            |      |
                  |                                             v      v
                  |                                         +----------------+
          +-----------------+                               |  slave server  |
          | consumer client |<------------------------------|  for consumer  |
          +-----------------+        webrtc                 +----------------+

```

## Quickstart

Build code

```
npm install
npm run build
```

Copy env.dev file to .env

```
cp .env.dev .env
```

Update config in .env file

```js
// your PostgreSQL server info
DATABASE_URL = "postgresql://postgres:123456@localhost:5432/mediasoup"
...
// your ip in lan network
MEDIASOUP_WEBRTC_TRANSPORT_LISTEN_IPS = '[
   {
      "ip": "192.168.6.143",
      "announcedIp": null
   }
]'
```

Create a master server

```
npm run start:master
```

Create a slave server to produce

```
npm run start:slave:producer
```

Create a slave server to consume

```
npm run start:slave:consumer
```

Run demo app

```
cd examples/rooms/
npm install
npm run dev
```

## License

mediasoup-cluster is [MIT Licensed](https://github.com/woody146/mediasoup-cluster/blob/master/LICENSE).
