    function animateBG(banner){
        $('.'+banner).addClass('animate-bg');
        if(banner == 'one') {
          $('.one video')[0].play();
        }
    }

    function resetAllanimateBG(){
        $('.one').stop().animate({backgroundSize: "100%"},500);
        $('.two').stop().animate({backgroundSize: "100%"},500);
        $('.three').stop().animate({backgroundSize: "100%"},500);
        $('.four').stop().animate({backgroundSize: "100%"},500);
    }



    //ANIMATION INITIALES

    animateBG('one');

    setTimeout(function() {
        $('.one').animate({opacity : "1"}, {queue : false, duration : 800});
        $('.one video')[0].play();
    }, 1000);


    setTimeout(function() {
        $(".border-top").animate({ height: '20px'}, 700);
        $(".border-bottom").animate({ height: '20px'}, 700);
        $(".border-left").animate({ width: '20px'}, 700);
        $(".border-right").animate({ width: '20px'}, 700);
    }, 1700);



    setTimeout(function() { $(".logo-site").animate({ marginTop: '42vh'}, {queue : false, duration : 900}); }, 1900);
    setTimeout(function() { $(".logo-site").fadeIn(1200);}, 1900);
    setTimeout(function() { $(".logo-site .subtext").fadeIn(2000);}, 2500);
    setTimeout(function() { $(".precision-intro").animate({ bottom: '5px'}, {queue : false, duration : 900}); }, 2500);
    setTimeout(function() { $(".precision-intro").fadeIn("fast"); }, 2700);
    setTimeout(function() { $(".links").animate({ bottom: '20px'}, {queue : false, duration : 900}); }, 2500);
    setTimeout(function() { $(".links").fadeIn("fast"); }, 2700);
    setTimeout(function() { $(".low-band").animate({ bottom: '0'}, 700);}, 3500);





    //Utilisation du gif préférable
    /*
    function animateDivers() {
        $('.arrow-pop').animate({'bottom':'11px'},300).animate({'bottom':'5px'},100).animate({'bottom':'8px'},200).animate({'bottom':'5px'}, animateDivers);
    }
    setTimeout(animateDivers(), 4000);
    */



    $('.nav').on('click', function(){
        $('#modal').load('fragments/elements/nav.html').css('display', 'block').animate({ height: '100vh',},500);

        setTimeout(function() {
            $(".border-modal-top").animate({ height: '20px'}, 700);
            $(".border-modal-bottom").animate({ height: '20px'}, 700);
            $(".border-modal-left").animate({ width: '20px'}, 700);
            $(".border-modal-right").animate({ width: '20px'}, 700);
            $(".project-content").fadeIn(900);
        }, 600);

        setTimeout(function() {  $(".title-lines").fadeIn(400);}, 1900);
        setTimeout(function() {  $(".toggle-btn").fadeIn(300); }, 2700);
        setTimeout(function() {  $(".pop-project").fadeIn(300); }, 2700);

        setTimeout(function() {  $('.close-modal').fadeIn().css('display', 'block'); }, 300);

    });



    $('.open-project').on('click', function(){
        var projet = $(this).attr('name');
        $('#modal').load( 'fragments/projects/'+ projet +'.html' );

        $('.modal').css('display', 'block');

        //On fait apparaitre le rectangle gris
        $(".modal").animate({
              height: '100vh',
        },500);

        //On fait apparaitre le contenu en fade
        setTimeout(function() {
            $(".border-modal-top").animate({ height: '20px'}, 700);
            $(".border-modal-left").animate({ width: '20px'}, 700);
            $(".border-modal-right").animate({ width: '20px'}, 700);
            $(".project-content").fadeIn(900);
        }, 600);

        setTimeout(function() {  $(".title-lines").fadeIn(400);}, 1900);
        setTimeout(function() {  $(".toggle-btn").fadeIn(300); }, 2700);
        setTimeout(function() {  $(".pop-project").fadeIn(300); }, 2700);


        $('.close-modal').css('display', 'block');
    });





    $(document).on('click', '.change-project', function(){
        var projet = $(this).attr('name');
        console.log("Project : "+projet);

        //On ferme le modal
        $('.close-modal').css('display', 'none');

        $(".project-content").fadeOut(400, function() { $(this).remove();});

        setTimeout(function(){ $('#modal').load( 'fragments/projects/'+ projet +'.html' ); }, 500);


        //On rouvre le modal
        setTimeout(function() {
            $(".project-content").fadeIn(900);
        }, 900);

        setTimeout(function() {  $(".title-lines").fadeIn(400);}, 1900);
        setTimeout(function() {  $(".toggle-btn").fadeIn(300); }, 2700);
        setTimeout(function() {  $(".pop-project").fadeIn(300); }, 2700);


        $('.close-modal').css('display', 'block');


    });


    $('.close-modal').on('click', function(){
        $('.close-modal').css('display', 'none');

        $(".border-modal-top").animate({ height: '0px'}, 400);
        $(".border-modal-bottom").animate({ height: '0px'}, 400);
        $(".border-modal-left").animate({ width: '0px'}, 400);
        $(".border-modal-right").animate({ width: '0px'}, 400);
        $(".project-content").fadeOut(900);

        setTimeout(function() {
            $(".modal").animate({ height: '0vh', },500);
        }, 600);


        setTimeout(function() {
            $('#modal').html();
        }, 1300);
    });


    $('.logo-top').on('click', function(){
        $('.close-modal').click();
    });


    $(document).on('click', '.nav-close', function(){
        $('.close-modal').css('display', 'none');

        $(".border-modal-top").animate({ height: '0px'}, 200);
        $(".border-modal-left").animate({ width: '0px'}, 200);
        $(".border-modal-right").animate({ width: '0px'}, 200);
        $(".project-content").fadeOut(600);

        setTimeout(function() {
            $(".modal").animate({ height: '0vh', },300);
        }, 400);

        setTimeout(function() {
            $('#modal').html();
        }, 500);

    });


    //ANIMATIONS
    var
    $secondTitre = $('.second .is-animated'),
    $secondTexte = $('.second .is-animated__single'),

    $thirdLogo = $('.third .is-animated__logo'),
    $thirdTitre = $('.third .is-animated__title'),
    $thirdSlide = $('.third .is-animated__slide'),

    $fourthColumn = $('.fourth .is-animated__column'),

    $fifthClient = $('.fifth .is-animated__client'),
    $fifthTitle = $('.fifth .title'),


    $heighthLogo = $('.heighth .is-animated__logo'),
    $heighthTitre = $('.heighth .is-animated__title'),
    $heighthSlide = $('.heighth .is-animated__slide'),

    $ninethTitre = $('.nineth .is-animated__title'),
    $ninethData = $('.nineth .is-animated__data'),
    $ninethForm = $('.nineth .is-animated__form');

    $(document).ready(function() {
        $('.fullpage').fullpage({
            sectionSelector: '.fp-section',
            anchors: ['Agence', 'Expertise', 'Projets_intro', 'Projets' ,'Confiance',  'Realisations_intro', 'Realisations', 'Contact_intro', "Contact"],
            normalScrollElements: '.modal',
            responsiveWidth:1200,
             afterLoad: function(){

                 $('.second .is-animated').addClass('animated fadeInUp').css('animation-delay', '0.2s');

             },
             onLeave: function(index, nextIndex, direction){
                if(nextIndex == 2){
                    if( index == 1 && nextIndex == 2 ) {

                    $secondTexte.addClass('animated fadeInUp');
                    $secondTexte.eq(0).css('animation-delay', '.2s');
                    $secondTitre.addClass('animated fadeInUp').css('animation-delay', '0.1s');

                    setTimeout(function() { $(".logo-top").fadeIn(500); }, 400);
                        elementsInPurple();
                    }
                }

                 if (nextIndex == 1){
                    animateBG('one');
                 }

                 if (nextIndex == 2){
                 }

                 if (nextIndex == 3){
                     animateBG('two');
                 }
                 if (nextIndex == 4){}
                 if (nextIndex == 5){}
                 if (nextIndex == 6){
                     animateBG('three');
                 }
                 if (nextIndex == 7){}
                 if (nextIndex == 8){
                     animateBG('four');
                 }
                 if (nextIndex == 9){}



                 if( nextIndex == 3 || nextIndex == 6 || nextIndex == 8 ){
                      $('.line-big-title').removeClass('fadeOut')
                      setTimeout(function(){
                          $('.line-big-title').addClass('fadeIn');
                        }, 500);
                 }
                 else{
                          $('.line-big-title').addClass('fadeOut');
                          $('.line-big-title').removeClass('fadeIn');

                 }


                 /* Réinitialisation des BG pour le replay à chaque apparition d'un slide */
                 if( nextIndex == 3 || nextIndex == 6 || nextIndex == 10 || nextIndex == 7 || nextIndex == 9){
                     resetAllanimateBG();
                 }

                if( nextIndex == 2 || nextIndex == 4 || nextIndex == 5  || nextIndex == 9){
                    elementsInPurple();
                    displayElements();
                }
                else{
                    elementsInWhite();
                    if(nextIndex != 1){
                        displayElements();
                    }
                }


                if( nextIndex == 1 ){
                    if(index == 2){
                        $(".logo-top").fadeOut(200);
                        $(".text-baseline").animate({color: "#FFFFFFF" }, 500);
                        $(".follow-icon a").animate({color: "#FFFFFFF" }, 500);
                    }
                }
                if( ( index == 1 || index == 2) && nextIndex == 3 ) {
                    $thirdTitre.addClass('animated fadeIn').css('animation-delay', '0.2s');
                    animateBG("two");
                }
                if( nextIndex == 4 ){
                    if(index == 3){
                        $fourthColumn.eq(3).css('animation-delay', '.4s');
                        $fourthColumn.eq(0).css('animation-delay', '.4s');
                        $fourthColumn.eq(1).css('animation-delay', '.3s');
                        $fourthColumn.eq(2).css('animation-delay', '.3s');
                        $fourthColumn.addClass('animated fadeInUp');

                        setTimeout(function(){
                          $fourthColumn.removeClass('animated fadeInUp');
                        }, 2000);
                    }
                }
                if( nextIndex == 4 ){
                    if(index == 5){
                        $fourthColumn.eq(3).css('animation-delay', '.4s');
                        $fourthColumn.eq(0).css('animation-delay', '.4s');
                        $fourthColumn.eq(1).css('animation-delay', '.3s');
                        $fourthColumn.eq(2).css('animation-delay', '.3s');
                        $fourthColumn.addClass('animated fadeInDown');

                        setTimeout(function(){
                          $fourthColumn.removeClass('animated fadeInDown');
                        }, 2000);
                    }
                }
                if( nextIndex == 5 ){
                    if(index == 4){
                        $fifthClient.addClass('animated fadeInUp');
                        $fifthClient.eq(3).css('animation-delay', '.3s');
                        $fifthClient.eq(0).css('animation-delay', '.3s');
                        $fifthClient.eq(1).css('animation-delay', '.5s');
                        $fifthClient.eq(2).css('animation-delay', '.5s');

                        setTimeout(function(){
                          $fifthClient.removeClass('animated fadeInUp');
                        }, 2000);
                    }
                }
                if( nextIndex == 5 ){
                    if(index == 6){
                        $fifthClient.addClass('animated fadeInDown');
                        $fifthClient.eq(3).css('animation-delay', '.3s');
                        $fifthClient.eq(0).css('animation-delay', '.3s');
                        $fifthClient.eq(1).css('animation-delay', '.5s');
                        $fifthClient.eq(2).css('animation-delay', '.5s');

                        setTimeout(function(){
                          $fifthClient.removeClass('animated fadeInDown');
                        }, 2000);

                    }
                }
                if( ( index == 7 && nextIndex == 8 ) ) {
                    $heighthLogo.addClass('animated fadeInDown').css('animation-delay', '.5s');
                    $heighthSlide.addClass('animated fadeInUp').css('animation-delay', '1s');
                    $heighthTitre.addClass('animated fadeIn').css('animation-delay', '0.2s');

                }
                if( ( index == 8 && nextIndex == 9 ) ) {
                    $ninethData.addClass('animated fadeInUp').css('animation-delay', '0.9s');
                    $ninethForm.addClass('animated fadeInUp').css('animation-delay', '0.6s');
                    $ninethTitre.addClass('animated fadeInUp').css('animation-delay', '0.2s');

                    setTimeout(function(){
                          $ninethData.removeClass('animated fadeInUp');
                          $ninethForm.removeClass('animated fadeInUp');
                          $ninethTitre.removeClass('animated fadeInUp');
                    }, 2000);

                }

            }
        }); // initialization
    });

   jQuery.Color.hook( "stroke" );
   function elementsInWhite(){
          $(".text-baseline").animate({color: "#FFFFFFF" }, 500);
          $(".follow-icon a").animate({color: "#FFFFFFF"  }, 500);
          $(".nav-btn").animate({'stroke': '#C59D5F'}, 200);
    }
   function elementsInPurple(){
          $(".text-baseline").animate({color: "#2F2C4E" }, 500);
          $(".follow-icon a").animate({color: "#2F2C4E"  }, 500);
          $(".nav-btn").animate({'stroke': '#C59D5F'}, 200);
    }
   function displayElements(){
          setTimeout(function() { $(".logo-top").fadeIn(500); }, 400);
          setTimeout(function() { $(".nav").fadeIn(500); }, 400);
    }


( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );


var step = 1;

init_contact();

function init_contact(){
    $("#nextStep").on("click",function(e){
        e.preventDefault();
        $("#contactForm").removeClass("error");
        if(step == 1){
            email = $("#email").val();
            if(!validateEmail(email)){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Mail invalide");
                return false;
            }
            step = 2;
            $("#email").css("margin-top","-90px");
            $("#contactForm .progressBar span").css("width","33%");
            $(".steps strong").animate({opacity : 0},"fast",function(){
                $(this).html("02");
                $(this).animate({opacity: 1},"fast");
            });
            return true;
        }
        if(step == 2){
            tel = $("#tel").val();
            if(tel.length == 0){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ téléphone vide");
                return false;
            }
            if(!($.isNumeric(tel))){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Numéro de téléphone invalide");
                return false;
            }
            step = 3;
            $("#tel").css("margin-top","-90px");
            $("#contactForm .progressBar span").css("width","66%");
            $("#inputContainer").css("height","170px");
            $(".steps strong").animate({opacity : 0},"fast",function(){
                $(this).html("03");
                $(this).animate({opacity: 1},"fast");
            });
            return true;
        }
        if(step == 3){
            message = $("#message").val();
            $("#contactForm #inputContainer #nextStep").css("display","none");
            if(message.length == 0 || $("#message").data("empty") == true){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ message vide");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "email.php",
                data: { submitContact : true, email: email, tel: tel, message: message, comment: $("#comment").val() },
                success: function(data){
                    data = $.parseJSON(data);
                    console.log(data);
                    console.log(data.Success);
                        // message success
                        $("#message").css("margin-top","-180px");
                        $("#contactForm .progressBar span").css("width","100%");
                        $("#contactForm #inputContainer .steps").css("opacity",0);
                        $("#inputContainer").css("height","90px");
                        $("#contactForm #inputContainer #nextStep").css("opacity",0);
              }
            });
            return true;
        }
    });
    $("#contactForm").on("submit",function(e){
        e.preventDefault();
        if(isMobile){
            $("#contactForm").removeClass("error");
            email = $("#email").val();
            if(!validateEmail(email)){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ email invalide");
                return false;
            }
            tel = $("#tel").val();
            if(tel.length == 0){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ téléphone vide");
                return false;
            }
            if(!($.isNumeric(tel))){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ téléphone invalide");
                return false;
            }
            message = $("#message").val();
            if(message.length == 0 || $("#message").data("empty") == true){
                $("#contactForm").addClass("error");
                $("#contactForm .error").html("Champ message vide");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "email.php",
                data: { submitContact : true, email: email, tel: tel, message: message, comment: $("#comment").val() },
                success: function(data){
                        // message success
                        //alert("Votre message a été envoyé avec succès");
                        $("#contactForm").addClass("error");
                        $("#contactForm .error").html("Votre message a été envoyé avec succès").css("background","#C59D5F");
                        $("#contactForm #inputContainer #nextStep").hide();
                    }
              });
            return true;
        }
    });
    $("#email").on("focus",function(){
        if($(this).data("empty")) $(this).val("");
    })
    .on("blur",function(){
        if($(this).val() == ""){
            $(this).data("empty",true);
            $(this).val("Renseignez votre email");
        }
    })
    .on("keyup",function(){
        if($(this).data("empty")) $(this).data("empty",false);
    });
    $("#tel").on("focus",function(){
        if($(this).data("empty")) $(this).val("");
    })
    .on("blur",function(){
        if($(this).val() == ""){
            $(this).data("empty",true);
            $(this).val("Renseignez votre téléphone");
        }
    })
    .on("keyup",function(){
        if($(this).data("empty")) $(this).data("empty",false);
    });
    $("#message").on("focus",function(){
        if($(this).data("empty")) $(this).val("");
    })
    .on("blur",function(){
        if($(this).val() == ""){
            $(this).data("empty",true);
            $(this).val("Votre message");
        }
    })
    .on("keyup",function(){
        if($(this).data("empty")) $(this).data("empty",false);
    });
    function validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
}
function destroy_contact(){
    step = 1;
    return true;
}



document.querySelector('input').addEventListener('keydown', function (e) {
    if (e.which == 9) {
        e.preventDefault();
    }
});