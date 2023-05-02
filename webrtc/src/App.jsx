import QrScanner from 'qr-scanner';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {useRef, useState} from "react";

const lasticecandidate = () => {

}
const handleicecandidate = () => {

}

function handleconnectionstatechange(event) {
    console.log('handleconnectionstatechange');
    console.log(event);
    alert('handleconnectionstatechange ', JSON.stringify(event))
}

function handleiceconnectionstatechange(event) {
    console.log('ice connection state: ' + event.target.iceConnectionState);
    alert('ice connection state: ' + event.target.iceConnectionState);
    // alert('handleconnectionstatechange ', JSON.stringify(event))
}

const configuration = {
    iceServers: [
        // {
        //     urls: "stun:stun.stunprotocol.org"
        // }
    ]
};

function datachannelopen() {
    console.log('datachannelopen');
    alert("open channel");
}

function datachannelmessage(message) {
    console.log('datachannelmessage');
    console.log(message);
    alert("message", message)
}

function App() {
    const [toggle, setToggle] = useState(false);
    const peerConnectionRef = useRef();
    const dataChannelRef = useRef();

    const qrScannerRef = useRef();
    const videoElemRef = useRef();

    const scanServer = async () => {
        if (!toggle) {
            qrScannerRef.current = new QrScanner(
                videoElemRef.current,
                async result => {
                    const peerConnection = new RTCPeerConnection(configuration);
                    const dataChannel = peerConnection.createDataChannel('chat');
                    dataChannel.onopen = datachannelopen;
                    dataChannel.onmessage = datachannelmessage;
                    peerConnection.onicecandidate = handleicecandidate(lasticecandidate);
                    peerConnection.onconnectionstatechange = handleconnectionstatechange;
                    peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
                    await peerConnection.setRemoteDescription(JSON.parse(result.data));
                    const answer = await peerConnection.createAnswer()
                    alert(JSON.stringify(answer))
                    await peerConnection.setLocalDescription(answer);
                    var qrcode = new QRCode(document.getElementById("qrcode"), JSON.stringify(answer));
                    console.log("answer created");
                    qrScannerRef.current.destroy();

                    peerConnectionRef.current = peerConnection;
                    dataChannelRef.current = dataChannel;

                    dataChannel.send("client");
                },
                {highlightCodeOutline: true, highlightScanRegion: true}
                // No options provided. This will use the old api and is deprecated in the current version until next major version.
            );
            qrScannerRef.current.start();
        } else {
            qrScannerRef.current.destroy();
        }
        // const cameras = await QrScanner.listCameras()
        setToggle(!toggle);
    }

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

        alert(decodedText)
        // console.log('decoded qr code:', JSON.stringify(result))
        // await peerConnection.setRemoteDescription(answer);
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
    }

    const scanQrHTML = () => {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            {fps: 10, qrbox: {width: 250, height: 250}},
            /* verbose= */ false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        // html5QrcodeScanner.start({ facingMode: "user" }, config, qrCodeSuccessCallback);
    }

    const createServer = async () => {

        try {
            const peerConnection = new RTCPeerConnection(configuration);
            const dataChannel = peerConnection.createDataChannel('chat');
            dataChannel.onopen = datachannelopen;
            dataChannel.onmessage = datachannelmessage;
            peerConnection.onicecandidate = handleicecandidate(lasticecandidate);
            peerConnection.onconnectionstatechange = handleconnectionstatechange;
            peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
            const offer = await peerConnection.createOffer();
            console.log("offer created", offer);
            var qrcode = new QRCode(document.getElementById("qrcode"), JSON.stringify(offer));
            await peerConnection.setLocalDescription(offer);
            console.log("local description set");

            peerConnectionRef.current = peerConnection;
            dataChannelRef.current = dataChannel;

        } catch (err) {
            console.log('error creating server: ' + err);
        }
    }
    const scanClient = async () => {
        if (!toggle) {
            qrScannerRef.current = new QrScanner(
                videoElemRef.current,
                async result => {
                        console.log('decoded qr code:', JSON.stringify(result.data))
                        alert(result.data)
                        await peerConnectionRef.current.setRemoteDescription(JSON.parse(result.data));
                        qrScannerRef.current.stop();
                        dataChannelRef.current.send("server");
                },
                {highlightCodeOutline: true, highlightScanRegion: true}
                // No options provided. This will use the old api and is deprecated in the current version until next major version.
            );
            qrScannerRef.current.start();
        } else {
            qrScannerRef.current.destroy();
        }
        setToggle(!toggle);
    }

    return (
        <>
            <video id={"videoElem"} ref={videoElemRef} style={{width: 375, height: 375}}></video>
            <div id="reader" width="600px"></div>
            <div id="qrcode" width="1280px"></div>
            <button onClick={scanServer}>Scan server</button>

            <button onClick={scanQrHTML}>Scan qr html</button>

            <button onClick={createServer}>create server</button>
            <button onClick={scanClient}>scan client</button>
        </>
    )
}

export default App
