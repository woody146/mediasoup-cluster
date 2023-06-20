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

Then, navigate to https://localhost:4430

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
      <th colspan="4" align="center">For producer client</th>
    </tr>
    <tr>
      <td>POST</td>
      <td>/rooms<br /><i>create room</i></td>
      <td></td>
      <td>
       <ul>
         <li>id: room id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/rooms/:roomId/producer_peers<br /><i>create producer peer</i></td>
      <td>
        <ul>
         <li>userId: string</li>
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
    <tr>
      <td>POST</td>
      <td>/producer_peers/:peerId/connect<br /><i>make peer connect</i></td>
      <td>
        <ul>
          <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
        </ul>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/producer_peers/:peerId/produce<br /><i>make peer produce</i></td>
      <td>
        <ul>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#MediaKind">kind</a</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpParameters">rtpParameters</a</li>
        </ul>
      </td>
      <td>
        <ul>
         <li>id: producer id</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/rooms/:roomId<br /><i>delete the room if no one is in the room</i></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th colspan="4" align="center">For consumer client</th>
    </tr>
    <tr>
      <td>GET</td>
      <td>/rooms/:roomId/producer_peers<br /><i>get producer peer list</i></td>
      <td>
      </td>
      <td>
       <ul>
         <li>id: peer id</li>
         <li>producerId: producer id</li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/rooms/:roomId/consumer_routers<br /><i>get or create router in this room</i></td>
      <td>
        <ul>
         <li>userId: string</li>
        </ul>
      </td>
      <td>
        <ul>
         <li>id: router id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/router/:routerId/consumer_peers<br /><i>create consumer peer</i></td>
      <td>
        <ul>
         <li>userId: string</li>
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
    <tr>
      <td>POST</td>
      <td>/consumer_peers/:peerId/connect<br /><i>make peer connect</i></td>
      <td>
        <ul>
          <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
        </ul>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/consumer_peers/:peerId/consume<br /><i>make peer consume</i></td>
      <td>
        <ul>
         <li>producerId: string</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
        </ul>
      </td>
      <td>
        <ul>
         <li>id: consumer id</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/consumer_peers/:peerId/resume<br /><i>make consumer resume after connected</i></td>
      <td>
        <ul>
         <li>consumerId: string</li>
        </ul>
      </td>
      <td></td>
    </tr>
    <tr>
      <th colspan="4" align="center">For both</th>
    </tr>
    <tr>
      <td>POST</td>
      <td>/user/:userId/logout<br /><i>make user logout</i></td>
      <td>
        <ul>
         <li>roomId?: string</li>
        </ul>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>

## License

mediasoup-cluster is [MIT Licensed](https://github.com/woody146/mediasoup-cluster/blob/master/LICENSE).
