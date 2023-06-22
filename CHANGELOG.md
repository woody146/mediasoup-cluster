# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/woody146/mediasoup-cluster/compare/v1.1.0...v1.2.0) (2023-06-22)


### Features

* add env LISTEN_HOST ([a23a617](https://github.com/woody146/mediasoup-cluster/commit/a23a6175ae7f625a65437cbd5fb8ebd364242115))

## 1.1.0 (2023-06-22)


### Features

* add docker file ([c8e0e6b](https://github.com/woody146/mediasoup-cluster/commit/c8e0e6b496c551ebfdc68c2af0b36c6db1c7b0fe))
* add MediaRouter model ([484bbbd](https://github.com/woody146/mediasoup-cluster/commit/484bbbdd0f576861338a7a24a77d0e9d194638ca))
* add MediasoupPipeTransportManager ([1f92849](https://github.com/woody146/mediasoup-cluster/commit/1f92849d1e1c5f5a3cc5f84f2768662e703b09f3))
* add MediasoupRoom ([e4b00d1](https://github.com/woody146/mediasoup-cluster/commit/e4b00d1ed23de2b48d9c5bb7f5d8358e690c9bb0))
* add MediasoupRouterService ([c6647fb](https://github.com/woody146/mediasoup-cluster/commit/c6647fb0d65c0ddf9a1c468ee32750da9dadaaaf))
* add MediasoupSlave entity ([e689de1](https://github.com/woody146/mediasoup-cluster/commit/e689de17a69bd5f7b233d608ff160558b5a9bb20))
* add MediasoupSlaveService.addFromEnv() ([957e14a](https://github.com/woody146/mediasoup-cluster/commit/957e14a8b9d5e3fb5a22d882f976685c4600e2e5))
* add MediasoupWorkerManager ([b31f7a3](https://github.com/woody146/mediasoup-cluster/commit/b31f7a3244beca59fd2c765f1c503907d2d1b32c))
* add PeerService.consume ([03faa58](https://github.com/woody146/mediasoup-cluster/commit/03faa5839bcd7d5d4a561e8c0667a25ff1a689b0))
* add PeerService.createConsumer ([af48260](https://github.com/woody146/mediasoup-cluster/commit/af48260a1430a7223794ebb356d621600ae69b76))
* add PeerService.getProducers ([9ba9b16](https://github.com/woody146/mediasoup-cluster/commit/9ba9b16ebc933cae52dd333c6c269a97596d8195))
* add PeerService.produce ([9c8d086](https://github.com/woody146/mediasoup-cluster/commit/9c8d086a5576e99d0a0802bdf1d0abf29433b20b))
* add PeerService.resume() ([e3f6175](https://github.com/woody146/mediasoup-cluster/commit/e3f61751ece94d60587338f0d99c76fb743a1eff))
* add producer_peers api ([c3ef9b5](https://github.com/woody146/mediasoup-cluster/commit/c3ef9b53129302e9ca3b1dfe8ed996ad32ff09f1))
* add room router ([be253cd](https://github.com/woody146/mediasoup-cluster/commit/be253cd71732824fe3cee14871eb6157662146d1))
* add RoomService.close() ([7f4344b](https://github.com/woody146/mediasoup-cluster/commit/7f4344b5606af78b7ba09e361428686a2e6fa057))
* add router api ([2d20281](https://github.com/woody146/mediasoup-cluster/commit/2d20281c24fc62ec46c7e95628dd581fafd17ecd))
* add RouterService ([993d192](https://github.com/woody146/mediasoup-cluster/commit/993d19274767a48aea2fb0964a73cb12992a0035))
* add RouterService.checkToPipe ([286bdc2](https://github.com/woody146/mediasoup-cluster/commit/286bdc2302558dbabb78179addc7a7483451e9bb))
* add run_slave ([68ad8ed](https://github.com/woody146/mediasoup-cluster/commit/68ad8ed7cf28bc9f65e8115f618704be9bb26827))
* add start master script ([a812572](https://github.com/woody146/mediasoup-cluster/commit/a81257213661da4f82c724a5136e0bef27114098))
* add UserService ([371f760](https://github.com/woody146/mediasoup-cluster/commit/371f7608809f5e0bba5e52c87d6f2a531fcdfdb3))
* add WebRTCTransportManager ([38d3a72](https://github.com/woody146/mediasoup-cluster/commit/38d3a726cd592c05aafaf7568c2133f580a80d2f))
* auto remove room if no peer ([a07e34b](https://github.com/woody146/mediasoup-cluster/commit/a07e34b15256b92a821f6c00d2dad2dfbf9199a4))
* create connect_consumer/producer api ([c20e346](https://github.com/woody146/mediasoup-cluster/commit/c20e346cd9d853b1295b8467adeec77ea12df98c))
* create MediaConsumer and MediaProducer ([ff1e8da](https://github.com/woody146/mediasoup-cluster/commit/ff1e8da5ceed9efb98aad2945a78e9318a624731))
* increase peerCount when create a transport ([c1243c8](https://github.com/woody146/mediasoup-cluster/commit/c1243c8c788e623f5a7fa69b18eed2ebe62577de))
* save user id when create transport ([445251c](https://github.com/woody146/mediasoup-cluster/commit/445251c7e0c939baf953790384df27d945a77a96))


### Bug Fixes

* return router id instead of room id ([6623d57](https://github.com/woody146/mediasoup-cluster/commit/6623d574d6e66247aa3765c0c9d49d00b3ac697d))
* save multiple consumers in a peer ([97e2031](https://github.com/woody146/mediasoup-cluster/commit/97e2031cdba7361de6b22c0ecc70f47cf2cf5c41))
* wrong ip address ([13c4406](https://github.com/woody146/mediasoup-cluster/commit/13c44064328716fb8559b6764be99c51e93d540f))
* wrong json ([8c202d2](https://github.com/woody146/mediasoup-cluster/commit/8c202d264e15691100095272cfb4b3adbe0dadfc))
