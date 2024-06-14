// type PlayerConnectionType = {
//     myId;
//     webrtcHandlers;
//     remoteId;
//     sendMessage: (msg)=>void
//     pc;
// }

import { toast } from 'react-toastify';
import { hasServerAtom, store } from './atoms/stateAtom.js';

export class PlayerConnection {
  myId;
  remoteId;
  pc;
  dataChannel;
  onConnected;

  constructor(myId, remoteId, sendMessage, isAnswer, webrtcHandlers, onConnected) {
    this.myId = myId;
    this.webrtcHandlers = webrtcHandlers;
    this.remoteId = remoteId;
    this.sendMessage = sendMessage;
    this.onConnected = onConnected;
    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:194.87.235.155'] }],
    });

    this.pc.oniceconnectionstatechange = () =>
      console.log('connection state', this.pc.iceConnectionState);

    this.pc.onicecandidate = ({ candidate }) => {
      console.log('new ice candidate', candidate);
      if (candidate) {
        sendMessage(
          JSON.stringify({ fromId: myId, remoteId, type: 'icecandidate', data: candidate }),
        );
      }
    };

    if (isAnswer) {
      this.pc.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.initializeDataChannel();
      };
    } else {
      this.dataChannel = this.pc.createDataChannel('chat');
      this.initializeDataChannel();
    }
  }

  initializeDataChannel() {
    this.dataChannel.onopen = this.onDataChannelOpen;
    this.dataChannel.onclose = () => console.log('data channel closed');
    this.dataChannel.onmessage = this.onDataChannelMessage;
  }

  async sendDataChannelMessage(msg) {
    console.log('datachannel ready state', this.dataChannel.readyState);
    console.log(this.remoteId);
    try {
      this.dataChannel.send(JSON.stringify({ type: 'message', data: msg, fromId: this.myId }));
    } catch (e) {
      console.log(e);
    }
  }

  onDataChannelOpen = () => {
    console.log('datachannel open');
    const hasServer = store.get(hasServerAtom);
    if (hasServer) {
      this.sendDataChannelMessage('hi from server');
    }
    toast.success('connected to player: ' + this.remoteId); // Updated to concatenate strings correctly
  };

  onDataChannelMessage = (msg) => {
    const data = JSON.parse(msg.data);
    this.webrtcHandlers(data);
  };

  async createOffer() {
    try {
      const offer = await this.pc.createOffer();
      await this.getDescription(offer);
      console.log('sending offer', offer);
    } catch (e) {
      console.log(e);
    }
    return this;
  }

  async createAnswer(sdp) {
    try {
      await this.pc.setRemoteDescription(sdp);
      const answer = await this.pc.createAnswer();
      await this.getDescription(answer);
    } catch (e) {
      console.log(e);
    }
    return this;
  }

  async getDescription(desc) {
    await this.pc.setLocalDescription(desc);
    this.sendMessage(
      JSON.stringify({ fromId: this.myId, remoteId: this.remoteId, type: 'sdp', data: desc }),
    );
    return this;
  }

  async setRemoteDescription(desc) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(desc));
    return this;
  }

  async addIceCandidate(candidate) {
    // кандидат может быть пустой строкой
    if (candidate) {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    }

    return this;
  }
}
