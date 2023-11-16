import QrScanner from 'qr-scanner';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {useRef, useState} from "react";
import UnityComponent from "./UnityComponent.jsx";
import WebSocketHandler from "./WebSocketHandler.jsx";
import EnterLobby from "./EnterLobby.jsx";

const configuration = {
    iceServers: [
        // {
        //     urls: "stun:stun.stunprotocol.org"
        // }
    ]
};

function datachannelopen() {
    console.log('datachannelopen');
    // alert("open channel");
}

function datachannelmessage(message) {
    console.log('datachannelmessage');
    console.log(message);
    alert("message", message)
}

function App() {
    // const [toggle, setToggle] = useState(false);
    // const peerConnectionRef = useRef();
    // const dataChannelRef = useRef();
    //
    // const qrScannerRef = useRef();
    // const videoElemRef = useRef();
    // const offerRef = useRef();
    // const answerRef = useRef();
    //
    // const lasticecandidate = () => {
    //     console.log("last ice candidate");
    //     console.log(peerConnectionRef.current.localDescription);
    //
    // }
    // const handleicecandidate = (lasticecandidate) => {
    //     return function (event) {
    //         if (event.candidate != null) {
    //             console.log('new ice candidate');
    //             console.log(event.candidate);
    //         } else {
    //             console.log('all ice candidates');
    //             lasticecandidate();
    //         }
    //     }
    // }
    //
    // function handleconnectionstatechange(event) {
    //     console.log('handleconnectionstatechange');
    //     console.log(event);
    //     // alert('handleconnectionstatechange ', JSON.stringify(event))
    // }
    //
    // function handleiceconnectionstatechange(event) {
    //     console.log('ice connection state: ' + event.target.iceConnectionState);
    //     // alert('ice connection state: ' + event.target.iceConnectionState);
    //     // alert('handleconnectionstatechange ', JSON.stringify(event))
    // }
    //
    // const scanField = async () => {
    //     offerRef.current.value;
    // }
    //
    // function handledatachannel(event) {
    //     console.log('handledatachannel');
    //     dataChannelRef.current = event.channel;
    //     dataChannelRef.current.onopen = datachannelopen;
    //     dataChannelRef.current.onmessage = datachannelmessage;
    // }
    //
    // const processOffer = async (offerObj) => {
    //     try {
    //         const peerConnection = new RTCPeerConnection(configuration);
    //
    //         peerConnection.ondatachannel = handledatachannel;
    //         // const dataChannel = peerConnection.createDataChannel('chat');
    //         peerConnection.onicecandidate = handleicecandidate(clientIceCandidate);
    //         peerConnection.onconnectionstatechange = handleconnectionstatechange;
    //         peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
    //
    //         await peerConnection.setRemoteDescription(offerObj);
    //         const answer = await peerConnection.createAnswer()
    //         // alert(JSON.stringify(answer))
    //         await peerConnection.setLocalDescription(answer);
    //         // answerRef.current.value = JSON.stringify(answer);
    //         // var qrcode = new QRCode(document.getElementById("qrcode"), JSON.stringify(answer));
    //         console.log("answer created");
    //
    //         peerConnectionRef.current = peerConnection;
    //         dataChannelRef.current = dataChannel;
    //     } catch (e) {
    //         console.log("ERRRRRRRRRRORRRRRRRRRRRRR");
    //     }
    // }
    //
    // const scanServerText = async () => {
    //     await processOffer(JSON.parse(offerRef.current.value))
    // }
    // const scanClientText = async () => {
    //     const answerText = answerRef.current.value
    //
    //     try {
    //         await peerConnectionRef.current.setRemoteDescription(JSON.parse(answerText));
    //     } catch (e) {
    //         console.log("ERRRRRRRRRRRRRRRRRRORRRRRRRRRRRR");
    //         console.log(e);
    //     }
    //     // alert(answerText)
    // }
    // const scanServer = async () => {
    //     if (!toggle) {
    //         qrScannerRef.current = new QrScanner(
    //             videoElemRef.current,
    //             async result => {
    //                 alert(result.data)
    //                 offerRef.current.value = result.data;
    //                 await processOffer(JSON.parse(result.data))
    //                 if (qrScannerRef.current) {
    //                     qrScannerRef.current.destroy();
    //                 }
    //             },
    //             {
    //                 highlightCodeOutline: true, highlightScanRegion: true, maxScansPerSecond: 5
    //             }
    //             // No options provided. This will use the old api and is deprecated in the current version until next major version.
    //         );
    //         qrScannerRef.current.start();
    //     } else {
    //         qrScannerRef.current.destroy();
    //     }
    //     // const cameras = await QrScanner.listCameras()
    //     setToggle(!toggle);
    // }
    //
    // function onScanSuccess(decodedText, decodedResult) {
    //     // handle the scanned code as you like, for example:
    //     console.log(`Code matched = ${decodedText}`, decodedResult);
    //     alert(decodedText);
    //
    //     // alert(decodedText)
    //     // console.log('decoded qr code:', JSON.stringify(result))
    //     // await peerConnection.setRemoteDescription(answer);
    // }
    //
    // function onScanFailure(error) {
    //     // handle scan failure, usually better to ignore and keep scanning.
    //     // for example:
    //     console.warn(`Code scan error = ${error}`);
    // }
    //
    // const scanQrHTML = () => {
    //     let html5QrcodeScanner = new Html5QrcodeScanner(
    //         "reader",
    //         {
    //             fps: 100,
    //             qrbox: {width: 500, height: 500},
    //             disableFlip: false,
    //             experimentalFeatures: true,
    //             formatsToSupport: ["QR_CODE"]
    //         },
    //         /* verbose= */ false);
    //     html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    //     // html5QrcodeScanner.start({ facingMode: "user" }, config, qrCodeSuccessCallback);
    // }
    // const serverIceCandidate = async () => {
    //     const offer = peerConnectionRef.current.localDescription;
    //     offerRef.current.value = JSON.stringify(offer);
    //     const qrcode = new QRCode(document.getElementById("qrcode"), {
    //         width: 320,
    //         height: 320
    //     })
    //     qrcode.makeCode(JSON.stringify(offer));
    // }
    //
    // const clientIceCandidate = async () => {
    //     const answer = peerConnectionRef.current.localDescription;
    //     answerRef.current.value = JSON.stringify(answer);
    //     const qrcode = new QRCode(document.getElementById("qrcode"),
    //         {
    //             width: 320,
    //             height: 320
    //         }
    //     )
    //     qrcode.makeCode(JSON.stringify(answer));
    // }
    //
    // const createServer = async () => {
    //
    //     try {
    //         const peerConnection = new RTCPeerConnection(configuration);
    //         const dataChannel = peerConnection.createDataChannel('chat');
    //         dataChannel.onopen = datachannelopen;
    //         dataChannel.onmessage = datachannelmessage;
    //         peerConnection.onicecandidate = handleicecandidate(serverIceCandidate);
    //         peerConnection.onconnectionstatechange = handleconnectionstatechange;
    //         peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
    //
    //         peerConnectionRef.current = peerConnection;
    //         dataChannelRef.current = dataChannel;
    //
    //         const offer = await peerConnection.createOffer();
    //         await peerConnection.setLocalDescription(offer);
    //         console.log("set local description done");
    //
    //
    //     } catch (err) {
    //         console.log('error creating server: ' + err);
    //     }
    // }
    //
    // const scanClient = async () => {
    //     if (!toggle) {
    //         qrScannerRef.current = new QrScanner(
    //             videoElemRef.current,
    //             async result => {
    //                 console.log('decoded qr code:', JSON.stringify(result.data))
    //
    //                 answerRef.current.value = JSON.stringify(result.data);
    //                 // alert(result.data)
    //                 await peerConnectionRef.current.setRemoteDescription(JSON.parse(result.data));
    //                 qrScannerRef.current.stop();
    //             },
    //             {highlightCodeOutline: true, highlightScanRegion: true}
    //             // No options provided. This will use the old api and is deprecated in the current version until next major version.
    //         );
    //         qrScannerRef.current.start();
    //     } else {
    //         qrScannerRef.current.destroy();
    //     }
    //     setToggle(!toggle);
    // }
    //
    // const sendMessage = async () => {
    //
    //     try {
    //         dataChannelRef.current.send("server");
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    return (
        <>
            {/*<textarea ref={offerRef}/>*/}
            {/*<textarea ref={answerRef}/>*/}
            {/*<video id={"videoElem"} ref={videoElemRef} style={{width: 375, height: 375}}></video>*/}
            {/*<div id="reader" width="600px"></div>*/}
            {/*<div style={{"padding": "30px"}}>*/}
            {/*    <div id="qrcode" width="1280px"></div>*/}
            {/*</div>*/}
            {/*<button onClick={scanServer}>Scan server</button>*/}
            {/*<button onClick={scanServerText}>scanServerText</button>*/}

            {/*<button onClick={scanQrHTML}>Scan qr html</button>*/}

            {/*<button onClick={createServer}>create server</button>*/}
            {/*<button onClick={scanClient}>scan client</button>*/}
            {/*<button onClick={scanClientText}>scan client text</button>*/}

            {/*<button onClick={sendMessage}>send message</button>*/}

            <UnityComponent/>
            <EnterLobby/>
        </>
    )
}

export default App
