var selfVideoEle = document.getElementById('selfVideo');
var remoteVideoEle = document.getElementById('remoteVideo');

var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

var selfPc = new RTCPeerConnection(null);
var remotePc = new RTCPeerConnection(null);

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(function(stream) {
  selfVideoEle.srcObject = stream;

  selfPc.onicecandidate = function(ev) {
    remotePc.addIceCandidate(ev.candidate);
  };

  remotePc.onicecandidate = function(ev) {
    selfPc.addIceCandidate(ev.candidate);
  };

  remotePc.ontrack = function(ev) {
    remoteVideoEle.srcObject = ev.streams[0];
  };

  stream.getTracks().forEach(function(track) {
    selfPc.addTrack(track, stream);
  });

  selfPc.createOffer(offerOptions).then(function(offer) {
    selfPc.setLocalDescription(offer);
    remotePc.setRemoteDescription(offer);

    remotePc.createAnswer().then(function(answer) {
      selfPc.setRemoteDescription(answer);
      remotePc.setLocalDescription(answer);
    })
  });
});
