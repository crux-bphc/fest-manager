var Scanner = function() {
    var globals = {
        ready: false,
        active: false,
        constraints: {},
        playback: null,
        worker: null,
    }
    var canvas = document.createElement('canvas');

    var setCanvasProperties = function() {
        canvas.width = globals.playback.videoWidth || 200;
        canvas.height = globals.playback.videoHeight || 200;
        globals.context = canvas.getContext('2d');
    }

    var newDecoderFrame = function() {
        if(!globals.active) return;
        setCanvasProperties();
        globals.context.drawImage(globals.playback, 0, 0, canvas.width, canvas.height);
        var imgData = globals.context.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData.data) {
            globals.worker.postMessage(imgData);
        }
    }

    var stopScanner = function() {
        globals.active = false;
        globals.playback.parentNode.parentNode.removeChild(globals.playback.parentNode);
        globals.stream.getTracks()[0].stop();
    }

    var launchScanner = function(input) {
        if (globals.ready && !globals.active) {
            globals.input = input;
            navigator.mediaDevices.getUserMedia(globals.constraints)
                .then(function(stream) {
                    globals.stream = stream;
                    var overlay = document.createElement('div');
                    overlay.classList.add("_overlay");
                    overlay.onclick = stopScanner;
                    globals.playback = document.createElement('video');
                    globals.playback.setAttribute("autoplay", true);
                    globals.playback.srcObject = stream;
                    overlay.appendChild(globals.playback);
                    document.body.appendChild(overlay);
                    globals.active = true;
                    setTimeout(newDecoderFrame, 0);
                })
                .catch(function(error) {
                    console.error("Error occurred : ", error);
                    swal({
                        title: "Failed!",
                        text: error
                    })
                });
        } else {
            swal({
                title: "Not Ready",
                text: globals.ready ? "active haga" : "ready haga"
            })
        }
    }

    $(document).ready(function() {
        globals.worker = new Worker("/static/lib/qr-decoder/decoder.min.js");
        globals.worker.onmessage = function(event) {
            if (event.data.length > 0) {
                var qrid = event.data[0][2];
                stopScanner();
                globals.input.innerHTML = qrid;
            }
            setTimeout(newDecoderFrame, 0);
        }

        navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                var device = devices.filter(function(device) {
                    var deviceLabel = device.label.split(',')[1];
                    if (device.kind == "videoinput") {
                        return device;
                    }
                });

                if (device.length > 1) {
                    globals.constraints = {
                        video: {
                            mandatory: {
                                sourceId: device[1].deviceId ? device[1].deviceId : null
                            }
                        },
                        audio: false
                    };

                    globals.ready = true;
                } else if (device.length) {
                    globals.constraints = {
                        video: {
                            mandatory: {
                                sourceId: device[0].deviceId ? device[0].deviceId : null
                            }
                        },
                        audio: false
                    };
                    globals.ready = true;
                } else {
                    globals.constraints = { video: true };
                    globals.ready = true;
                }
            })
            .catch(function(error) {
                console.error("Error occurred : ", error);
                swal({
                    title: "Failed!",
                    text: error
                })
            });
    })
    return {
        launch: launchScanner,
        globals: globals
    }
}();