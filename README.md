# Mediasoup cluster

Cluster uses PostgreSQL server to save data of slave servers

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

Build code (must use node **v18+**)

```
npm install
npm run build
```

Copy env.dev file to .env

```
cp .env.dev .env
```

Update config in .env file. Detail in [example](https://github.com/woody146/mediasoup-cluster/issues/1#issuecomment-1689558894)

```js
// your PostgreSQL server info
DATABASE_URL = "postgresql://postgres:123456@localhost:5432/mediasoup"
...
// your ip in internet network
// https://mediasoup.org/documentation/v3/mediasoup/api/#TransportListenIp
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
      <td>/rooms/:roomId/producer_transports<br /><i>create producer transport</i></td>
      <td>
        <ul>
         <li>userId: string</li>
       </ul>
      </td>
      <td>
       <ul>
         <li>id: transport id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceCandidate">iceCandidates</a<</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceParameters">iceParameters</a<</li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/producer_transports/:transportId/connect<br /><i>make transport connect</i></td>
      <td>
        <ul>
          <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
        </ul>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/producer_transports/:transportId/produce<br /><i>make transport produce</i></td>
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
      <td>POST</td>
      <td>/producers/:producerId/pause<br /><i>pause producer</i></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/producers/:producerId/resume<br /><i>resume producer</i></td>
      <td></td>
      <td></td>
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
      <td>/rooms/:roomId/producer_transports<br /><i>get producer transport list</i></td>
      <td>
      </td>
      <td>
      <ul>
        <li>items: array of objects</li>
        <ul>
          <li>id: transport id</li>
          <li>userId: user id</li>
          <li>producers: { id: string; kind: string }[]</li>
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
      <td>/rooms/:roomId/consumer_transports<br /><i>create consumer transport</i></td>
      <td>
        <ul>
         <li>userId: string</li>
       </ul>
      </td>
      <td>
       <ul>
         <li>id: transport id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceCandidate">iceCandidates</a<</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceParameters">iceParameters</a<</li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/router/:routerId/consumer_transports<br /><i>create consumer transport</i></td>
      <td>
        <ul>
         <li>userId: string</li>
       </ul>
      </td>
      <td>
       <ul>
         <li>id: transport id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceCandidate">iceCandidates</a<</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportIceParameters">iceParameters</a<</li>
       </ul>
      </td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/consumer_transports/:transportId/connect<br /><i>make transport connect</i></td>
      <td>
        <ul>
          <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportDtlsParameters">dtlsParameters</a</li>
        </ul>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/consumer_transports/:transportId/consume<br /><i>make transport consume</i></td>
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
      <td>/consumers/:consumerId/resume<br /><i>make consumer resume after connected</i></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th colspan="4" align="center">Utils</th>
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
    <tr>
      <td>DELETE</td>
      <td>/transports/:transportId<br /><i>close producer or consumer transport</i></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/rooms<br /><i>get room list in system</i></td>
      <td>
        <ul>
         <li>page?: number</li>
         <li>pageSize?: number</li>
         <li>orderBy?: string</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>items: room objects</li>
          <ul>
            <li>id: string</li>
            <li>createDate: Date</li>
          </ul>
          <li>pagination</li>
          <ul>
            <li>page: number</li>
            <li>pageSize: number</li>
            <li>total: number</li>
          </ul>
        </ul>
      </td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/rooms/:roomId<br /><i>get room detail</i></td>
      <td></td>
      <td>
        <ul>
         <li>id: room id</li>
         <li><a href="https://mediasoup.org/documentation/v3/mediasoup/api/#router-rtpCapabilities">rtpCapabilities</a></li>
       </ul>
      </td>
    </tr>
  </tbody>
</table>

## License

mediasoup-cluster is [MIT Licensed](https://github.com/woody146/mediasoup-cluster/blob/master/LICENSE).
