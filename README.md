## Mediasoup cluster

Cluster use PostgreSQL server to save data of slave servers

```
                                                           +----------------+
        +-----------------+          webrtc                |  slave server  |
        | producer client |------------------------------->|  for producer  |
        +-----------------+                                +----------------+
                  |                                             ^      |
                  |                +---------------+            |      |
                  +--------------->|               |------------+      | mediasoup
                       http        | master server |   http            |   pipe
                  +--------------->|               |------------+      | transport
                  |                +---------------+            |      |
                  |                                             v      v
                  |                                        +----------------+
        +-----------------+                                |  slave server  |
        | consumer client |<-------------------------------|  for consumer  |
        +-----------------+         webrtc                 +----------------+
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

## Documentation

#### Master server API

<table>
  <tbody>
    <tr>
      <th >Method</th>
      <th >Path</th>
      <th >Request</th>
      <th >Response</th>
    </tr>
    <tr>
      <td>POST</td>
      <td>
        /rooms<br />create rooms
      </td>
      <td></td>
      <td>
       <ul>
         <li>id: room id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/rooms/:roomId<br />get room information</td>
      <td></td>
      <td>
        <ul>
         <li>id: room id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/rooms/:roomId<br />delete the room if no one is in the room</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/rooms/:roomId/producer_peers<br />create producer peer</td>
      <td>
        <ul>
         <li>userId (string): user id</li>
       </ul>
      </td>
      <td>
       <ul>
         <li>id: peer id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceCandidate">iceCandidates</a<</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceParameters">iceParameters</a<</li>
       </ul>
      </td>
    </tr>
  </tbody>
</table>

## License

mediasoup-cluster is [MIT Licensed](https://github.com/woody146/mediasoup-cluster/blob/master/LICENSE).
