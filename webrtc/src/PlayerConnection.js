export class PlayerConnection {
    constructor(myId, remoteId, sendMessage, isAnswer) {
        this.myId = myId
        this.remoteId = remoteId
        this.sendMessage = sendMessage
        this.pc = new RTCPeerConnection({});
        this.pc.oniceconnectionstatechange = e => console.log("connection state", this.pc.iceConnectionState);
        if (isAnswer) {
            this.pc.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.dataChannel.onopen = this.onDataChannelOpen;
                this.dataChannel.onclose = () => console.log("data channel closed");
                this.dataChannel.onmessage = this.onDataChannelMessage;
            };
        } else {
            this.dataChannel = this.pc.createDataChannel('chat');
            this.dataChannel.onopen = this.onDataChannelOpen;
            this.dataChannel.onclose = () => console.log("data channel closed");
            this.dataChannel.onmessage = this.onDataChannelMessage;
        }
        this.pc.onicecandidate = ({candidate}) => {
            console.log("new ice candidate");
            if (candidate) {
                sendMessage(JSON.stringify({fromId: myId, remoteId, type: "icecandidate", data: candidate}))
            }
        }
    }

    async sendDataChannelMessage() {
        console.log("datachannel ready state", this.dataChannel.readyState);
        try {
            this.dataChannel.send("sasha")
        } catch (e) {
            console.log(e);
        }
    }

    async onDataChannelOpen() {
        console.log("datachannel open");
    }

    async onDataChannelMessage(msg) {
        console.log("datachannel message");
        console.log(msg);
    }

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.getDescription(offer);
        } catch (e) {
            console.log(e);
        }
        return this
    }

    async createAnswer(sdp) {
        try {
            await this.pc.setRemoteDescription(sdp);
            const answer = await this.pc.createAnswer();
            await this.getDescription(answer);
        } catch (e) {
            console.log(e);
        }
        return this
    }

    async getDescription(desc) {
        await this.pc.setLocalDescription(desc)
        this.sendMessage(JSON.stringify({fromId: this.myId, remoteId: this.remoteId, type: "sdp", data: desc}))
        return this
    }

    async setRemoteDescription(desc) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(desc))
        return this
    }

    async addIceCandidate(candidate) {
        // кандидат может быть пустой строкой
        if (candidate) {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        }

        return this
    }
}