$('document').ready(function() {
    var options = {
        strings: [
            "Conference^1000",
            "Workshops^1000",
            "Code Sprints^1000",
        ],
        typeSpeed: 50,
        smartBackspace: true,
        loop: true,
    }
    var typed = new Typed('#typedholder', options);
    window.addEventListener('add-cart', function(event){
        console.log("Fired:", event);
    });
});
