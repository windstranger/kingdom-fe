type PlayerConnectionType = {
    myId: string;
    webrtcHandlers: string;
    remoteId: string;
    sendMessage: (msg: string)=>void
    pc: string;
}

export class PlayerConnection {
    myId: string;
    webrtcHandlers: (data: any)=>void;
    remoteId: string;
    sendMessage: (msg: string)=>void
    pc: any;
    dataChannel: any;

    constructor(myId:string, remoteId:string, sendMessage:(msg: string)=>void, isAnswer:boolean, webrtcHandlers:(data:any)=>void) {
        this.myId = myId
        this.webrtcHandlers = webrtcHandlers;
        this.remoteId = remoteId
        this.sendMessage = sendMessage
        this.pc = new RTCPeerConnection({
            iceServers: [
                {urls: ["stun:194.87.235.155"]},
            ]
        });
        this.pc.oniceconnectionstatechange = () => console.log("connection state", this.pc.iceConnectionState);
        if (isAnswer) {
            this.pc.ondatachannel = (event:any) => {
                this.dataChannel = event.channel;
                this.dataChannel.onopen = this.onDataChannelOpen;
                this.dataChannel.onclose = () => console.log("data channel closed");
                this.dataChannel.onmessage = (msg:{data:string}) => {
                    const data = JSON.parse(msg.data);
                    webrtcHandlers(data)
                }
            };
        } else {
            this.dataChannel = this.pc.createDataChannel('chat');
            this.dataChannel.onopen = this.onDataChannelOpen;
            this.dataChannel.onclose = () => console.log("data channel closed");
            this.dataChannel.onmessage = (msg: {data:string}) => {
                const data = JSON.parse(msg.data);
                webrtcHandlers(data)
            }
        }
        this.pc.onicecandidate = ({candidate}:{candidate:any}) => {
            console.log("new ice candidate", candidate);
            if (candidate) {
                sendMessage(JSON.stringify({fromId: myId, remoteId, type: "icecandidate", data: candidate}))
            }
        }
    }

    async sendDataChannelMessage(msg: string) {
        console.log("datachannel ready state", this.dataChannel.readyState);
        console.log(this.remoteId);
        try {
            this.dataChannel.send(JSON.stringify({type: "message", data: msg, fromId: this.myId}))
        } catch (e) {
            console.log(e);
        }
    }

    async onDataChannelOpen() {
        console.log("datachannel open");
    }

    onDataChannelMessage = (msg: {data:string}) => {
        const data = JSON.parse(msg.data);
        this.webrtcHandlers(data)
    }

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.getDescription(offer);
            console.log("sending offer", offer);
        } catch (e) {
            console.log(e);
        }
        return this
    }

    async createAnswer(sdp: any) {
        try {
            await this.pc.setRemoteDescription(sdp);
            const answer = await this.pc.createAnswer();
            await this.getDescription(answer);
        } catch (e) {
            console.log(e);
        }
        return this
    }

    async getDescription(desc: any) {
        await this.pc.setLocalDescription(desc)
        this.sendMessage(JSON.stringify({fromId: this.myId, remoteId: this.remoteId, type: "sdp", data: desc}))
        return this
    }

    async setRemoteDescription(desc:any) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(desc))
        return this
    }

    async addIceCandidate(candidate:any) {
        // кандидат может быть пустой строкой
        if (candidate) {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate))
        }

        return this
    }
}