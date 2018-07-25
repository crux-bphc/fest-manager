/**
 * Polyfills
 */
(function()
{
    var x, v = ['ms', 'moz', 'webkit', 'o'];

    for( x = 0; x < v.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[ v[x]+'RequestAnimationFrame' ];
        window.cancelAnimationFrame  = window[ v[x]+'CancelAnimationFrame' ] || window[ v[x]+'CancelRequestAnimationFrame' ];
    }
    if( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function( callback ) {
            return window.setTimeout( callback, 1000/60 );
        };
    }
    if( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function( timeout ) {
            return clearTimeout( timeout );
        };
    }
    if( window.THREE && !THREE.Math.randPie ) {
        THREE.Math.randPie = function( radius, count, total ) {
            var pi = Math.PI, rand = Math.random(), angle = ( count && total ) ? ( count * ( pi * 2 ) / total ) : ( rand * pi * 2 );
            return {
                x : Math.cos( angle - Math.PI / 2 ) * radius,
                y : Math.sin( angle - Math.PI / 2 ) * radius,
                z : Math.sin( angle - Math.PI / 2 ) * radius,
            };
        };
    }
})();