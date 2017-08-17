var Scanner = function() {
    var worker = null;

    var launchScanner = function(x) {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                var device = devices.filter(function(device) {
                    var deviceLabel = device.label.split(',')[1];
                    if (device.kind == "videoinput") {
                        return device;
                    }
                });

                if (device.length > 1) {
                    var constraints = {
                        video: {
                            mandatory: {
                                sourceId: device[1].deviceId ? device[1].deviceId : null
                            }
                        },
                        audio: false
                    };

                    return navigator.mediaDevices.getUserMedia(constraints);
                }
                else if (device.length) {
                    var constraints = {
                        video: {
                            mandatory: {
                                sourceId: device[0].deviceId ? device[0].deviceId : null
                            }
                        },
                        audio: false
                    };
                    return navigator.mediaDevices.getUserMedia(constraints);
                }
                else {
                    return navigator.mediaDevices.getUserMedia({video:true})
                }
            })
            .then(function(stream) {
                playback = document.createElement('video');
                playback.srcObject = stream;
                playback.classList.add("_overlay");
                document.body.appendChild(playback);
            })
            .catch(function (error) {
                console.error("Error occurred : ", error);
                swal({
                    title: "Failed!",
                    text: error
                })
            });
    }

    $(document).ready(function() {
        worker = new Worker("/static/lib/decoder.min.js");
    })
    return {
        launch: launchScanner,
    }
}();