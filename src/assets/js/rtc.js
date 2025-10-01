/**
 * @author gajendra gouda <gajendragouda254@gmail.com>
 * @date 2nd October, 2025
 */
'use strict';

let myPeerConnection = null;
let turnReady = null;

let pcConfig = {
    'iceServers': []
};


// Set up audio and video regardless of what devices are present.
let sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
};


// This is the correct place for your Xirsys ICE server configuration
let getIceServer = () => {
    let turnServer = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"] // Public STUN server as a fallback
            },
            {
                urls: [
                    "turn:global.xirsys.net:80?transport=udp",
                    "turn:global.xirsys.net:3478?transport=tcp"
                ],
                username: "gajjuthecreator",
                credential: "9d80b218-9d3c-11f0-8c60-0242ac140002"
            }
        ]
    };

    return turnServer;
};


function createPeerConnection(isInitiator, localStream, remoteStream, remoteVideo, sendSignal) {
    pcConfig.iceServers = getIceServer().iceServers;

    try {
        myPeerConnection = new RTCPeerConnection(pcConfig);

        myPeerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal({
                    type: 'candidate',
                    candidate: event.candidate
                });
            }
        };


        myPeerConnection.ontrack = (event) => {
            if (remoteVideo.srcObject !== event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };


        if (isInitiator) {
            if (localStream) {
                localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
            }

            myPeerConnection.createOffer().then(sdp => {
                myPeerConnection.setLocalDescription(sdp);

                sendSignal(sdp);
            });
        } else {
            if (localStream) {
                localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
            }
        }
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}


function closePeerConnection() {
    if (myPeerConnection) {
        myPeerConnection.close();
        myPeerConnection = null;
    }
}
