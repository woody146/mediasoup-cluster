# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.1.1](https://github.com/woody146/mediasoup-cluster/compare/v4.1.0...v4.1.1) (2023-11-06)


### Bug Fixes

* component ConsumerCloner doesn't work ([4f9bda2](https://github.com/woody146/mediasoup-cluster/commit/4f9bda292100f3aeb7cd938bbd599cff2da05cd2))
* not auto remove worker if can't call api ([84923d8](https://github.com/woody146/mediasoup-cluster/commit/84923d8fb3b1a32e92dec9663043dd3ceb95d7b4))

## [4.1.0](https://github.com/woody146/mediasoup-cluster/compare/v4.0.0...v4.1.0) (2023-11-03)


### Features

* add success count in Consumer/ProducerCloner ([e56f8a0](https://github.com/woody146/mediasoup-cluster/commit/e56f8a0356711e8d523317fb32dc6f5618aef67b))
* auto remove worker if many errors ([2424648](https://github.com/woody146/mediasoup-cluster/commit/242464818b980141bd2928bc0d41928555afcfef))

## [4.0.0](https://github.com/woody146/mediasoup-cluster/compare/v3.1.0...v4.0.0) (2023-08-25)


### ⚠ BREAKING CHANGES

* remove LISTEN_HOST env

### Bug Fixes

* not update transportCount after closing room ([4123360](https://github.com/woody146/mediasoup-cluster/commit/41233603653ca334a3ded81d251a55444d901abd))


* remove LISTEN_HOST env ([4be59d0](https://github.com/woody146/mediasoup-cluster/commit/4be59d0076e08c7bef581a66980102be2e6db248))

## [3.1.0](https://github.com/woody146/mediasoup-cluster/compare/v3.0.0...v3.1.0) (2023-07-12)


### Features

* add delete transport api ([8054795](https://github.com/woody146/mediasoup-cluster/commit/8054795ac438a941c774e94a58c1a15e3d7ab089))

## [3.0.0](https://github.com/woody146/mediasoup-cluster/compare/v2.0.0...v3.0.0) (2023-07-07)


### ⚠ BREAKING CHANGES

* change api consumer resume

### Features

* add producer resume/ pause api ([162bc0b](https://github.com/woody146/mediasoup-cluster/commit/162bc0b575d1c7f0671745e31ede42163e828ea6))
* add userId to return result of getProducers() ([a79bfc7](https://github.com/woody146/mediasoup-cluster/commit/a79bfc7ea9f7e9913ae6fc06f50448fc733e5227))


### Bug Fixes

* channel already exists ([e4242a5](https://github.com/woody146/mediasoup-cluster/commit/e4242a563aa2b27cc63b9c7ab6051a8610c77bda))
* crash server if resume error ([4f0ce36](https://github.com/woody146/mediasoup-cluster/commit/4f0ce36d005991b3ccdc666cfaa1ce942d46fcc1))
* wrong folder in docker file ([33d2d66](https://github.com/woody146/mediasoup-cluster/commit/33d2d666cc52e2d0a39530488a60ae988343b172))


* change api consumer resume ([4dfb068](https://github.com/woody146/mediasoup-cluster/commit/4dfb06822bf1b39d9903e144a3f3954228dea4d6))

## [2.0.0](https://github.com/woody146/mediasoup-cluster/compare/v1.2.0...v2.0.0) (2023-07-01)


### ⚠ BREAKING CHANGES

* change peer to transport
* change return result of getProducers()

### Features

* add options.staticFolder to startServer() ([70ac1af](https://github.com/woody146/mediasoup-cluster/commit/70ac1af3800d2376c82034c6e2125b5e922d0fb4))
* change peer to transport ([927ad7a](https://github.com/woody146/mediasoup-cluster/commit/927ad7abb84cf07adc8f036791c5bfbedf2dacf5))
* get room list api ([1bbcbb3](https://github.com/woody146/mediasoup-cluster/commit/1bbcbb3faa05591754269a48fe15d1ac8fc7c045))


### Bug Fixes

* create router for inexistent room ([810116b](https://github.com/woody146/mediasoup-cluster/commit/810116b1436159fe4cd82383b6d90ed7f13b7b43))
* error import ([b096128](https://github.com/woody146/mediasoup-cluster/commit/b09612859b561a68c2be5668c2800335c8abc0e4))
* not remove empty room automatically ([9445504](https://github.com/woody146/mediasoup-cluster/commit/944550455e7a933bdfed37a417e39389ce7e5a1c))
* produce if user checks box ([8b80911](https://github.com/woody146/mediasoup-cluster/commit/8b80911ae9e55e7768902c537164b313ab6a2d54))
* record multi stream ([a69a849](https://github.com/woody146/mediasoup-cluster/commit/a69a849a45393dbb705cf0e00e4213114c2b0bab))


* change return result of getProducers() ([a611033](https://github.com/woody146/mediasoup-cluster/commit/a61103336d142ae01ff076fa4ced7568303549f8))

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
