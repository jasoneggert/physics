/* ===================== active your plugin here ========================= */

(function($) {
    "use strict";


    /* ==========================================================================
   window laod function
   ========================================================================== */
    
    $(window).load(function() {
        $(window).trigger("scroll");
        $(window).trigger("resize");
        (function() {

          var support = { animations : Modernizr.cssanimations },
            container = document.getElementById( 'ip-container' ),
            header = container.querySelector( 'div.ip-header' ),
            loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
            animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
            // animation end event name
            animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

          function PRE_init() {
            var onEndInitialAnimation = function() {
              if( support.animations ) {
                this.removeEventListener( animEndEventName, onEndInitialAnimation );
              }

              startLoading();
            };

            // disable scrolling
            window.addEventListener( 'scroll', noscroll );

            // initial animation
            classie.add( container, 'loading' );

            if( support.animations ) {
              container.addEventListener( animEndEventName, onEndInitialAnimation );
            }
            else {
              onEndInitialAnimation();
            }
          }

          function startLoading() {
            // simulate loading something..
            var simulationFn = function(instance) {
              var progress = 0,
                interval = setInterval( function() {
                  progress = Math.min( progress + Math.random() * 0.175, 1 );

                  instance.setProgress( progress );

                  // reached the end
                  if( progress === 1 ) {
                    classie.remove( container, 'loading' );
                    classie.add( container, 'loaded' );
                    clearInterval( interval );

                    var onEndHeaderAnimation = function(ev) {
                      if( support.animations ) {
                        if( ev.target !== header ) return;
                        this.removeEventListener( animEndEventName, onEndHeaderAnimation );
                      }

                      classie.add( document.body, 'layout-switch' );
                      window.removeEventListener( 'scroll', noscroll );
                    };

                    if( support.animations ) {
                      header.addEventListener( animEndEventName, onEndHeaderAnimation );
                    }
                    else {
                      onEndHeaderAnimation();
                    }
                  }
                }, 80 );
            };

            loader.setProgressFn( simulationFn );
            var typed = new Typed('.typed-container', {
              strings: [ "Designer", "Developer"],
              startDelay: 50,
              typeSpeed: 50,
              loop: true,
              backSpeed: 20,
            });
          }

          function noscroll() {
            window.scrollTo( 0, 0 );
          }

          PRE_init();

          })();
    });
    

    $(window).resize(function() {
        
    });

    /* ==========================================================================
   document ready function
   ========================================================================== */
    
    $(document).ready(function() {

        $(window).trigger("resize");

        $(".mobile-menu").click(function() {
            $(this).toggleClass("open");
            $("header nav > ul").slideToggle("slow");
        });

        $.stellar({
            horizontalScrolling: false,
            verticalOffset: 40
          });

        var pageSection = $(".page-content, .fixed-bg");
          pageSection.each(function(indx){
              
              if ($(this).attr("data-background")){
                  $(this).css("background-image", "url(" + $(this).data("background") + ")");
              }
          });
          
        initWorkFilter();
        init_masonry();
       // gmap_init();

         // smooth scroll 
        // $(function() {
        //       $('#atom-scroll-to-top').click(function() {
        //       if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        //         var target = $(this.hash);
        //         target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        //         if (target.length) {
        //         $('html,body').animate({
        //           scrollTop: target.offset().top
        //         }, 1000);
        //         return false;
        //         }
        //       }
        //       });
        //     });
    });

/* ---------------------------------------------
 Portfolio section
 --------------------------------------------- */

// Projects filtering
var fselector = 0;
var work_grid = $("#atom-works-grid");

function initWorkFilter(){
     var isotope_mode;
     if (work_grid.hasClass("masonry")){
         isotope_mode = "masonry";
     } else{
         isotope_mode = "fitRows";
     }
     work_grid.imagesLoaded(function(){
            work_grid.isotope({
                itemSelector: '.atom-work-item',
                layoutMode: isotope_mode,
                filter: fselector
            });
        });
        
        $(".atom-portfolio-filter > li > a").click(function(){
            $(".atom-portfolio-filter > li > a").removeClass("active");
            $(this).addClass("active");
            fselector = $(this).attr('data-filter');
            
            work_grid.isotope({
                itemSelector: '.atom-work-item',
                layoutMode: isotope_mode,
                filter: fselector
            });
            return false;
        });
}

/* ---------------------------------------------
 Masonry
 --------------------------------------------- */

function init_masonry(){    
    $(".masonry").imagesLoaded(function(){
        $(".masonry").masonry();
    });
}

/* Google Map 
================================================== */

// function gmap_init() {
// var mapOptions = {
//   scrollwheel: false,
// zoom: 16,
// center: new google.maps.LatLng(44.7679455, 17.1909169), // New York
// styles: [{featureType:"landscape",stylers:[{saturation:-100},{lightness:65},{visibility:"on"}]},{featureType:"poi",stylers:[{saturation:-100},{lightness:51},{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"road.arterial",stylers:[{saturation:-100},{lightness:30},{visibility:"on"}]},{featureType:"road.local",stylers:[{saturation:-100},{lightness:40},{visibility:"on"}]},{featureType:"transit",stylers:[{saturation:-100},{visibility:"simplified"}]},{featureType:"administrative.province",stylers:[{visibility:"off"}]/**/},{featureType:"administrative.locality",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"on"}]/**/},{featureType:"water",elementType:"labels",stylers:[{visibility:"on"},{lightness:-25},{saturation:-100}]},{featureType:"water",elementType:"geometry",stylers:[{hue:"#ffff00"},{lightness:-25},{saturation:-97}]}]
// };
//   var contentString = '<div id="mapcontent">'+
//                       '<p>Yup, we are here!</p></div>';
//   var infowindow = new google.maps.InfoWindow({
//       maxWidth: 320,
//       content: contentString
//   });
// var mapElement = document.getElementById('google-map');
// var map = new google.maps.Map(mapElement, mapOptions);
//   var image = new google.maps.MarkerImage('images/pin.png',
//       null, null, null, new google.maps.Size(50,71));

//   var myLatLng = new google.maps.LatLng(44.7679455, 17.1909169);
//   var marker = new google.maps.Marker({
//       position: myLatLng,
//       map: map,
//       icon: image,
//       title: 'Hello World!'
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//       infowindow.open(map,marker);
//   });

// }




})(jQuery);