/**
 * Device object.
 * Provides information about the screen, document, input and orientation.
 */
(function( name, factory )
{
    if( typeof define === 'function' && define.amd ){ define( [], factory ); } else
    if( typeof exports === 'object' ){ module.exports = factory; } else
    if( window ){ window[ name ] = factory(); }

})( "Device", function()
{
    var _w = window,
        _s = window.screen,
        _b = document.body,
        _d = document.documentElement;

    return {
        screenWidth: function()
        {
            return Math.max( 0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0 );
        },
        screenHeight: function()
        {
            return Math.max( 0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0 );
        },
        screenRatio: function()
        {
            return this.screenWidth() / this.screenHeight();
        },
        screenCenterX: function()
        {
            return this.screenWidth() / 2;
        },
        screenCenterY: function()
        {
            return this.screenHeight() / 2;
        },
        screenInfo: function()
        {
            return {
                width   : this.screenWidth(),
                height  : this.screenHeight(),
                ratio   : this.screenRatio(),
                centerX : this.screenCenterX(),
                centerY : this.screenCenterY(),
            };
        },
        pageWidth: function()
        {
            return Math.max( 0, _b.scrollWidth || 0, _b.offsetWidth || 0, _d.clientWidth || 0, _d.offsetWidth || 0, _d.scrollWidth || 0 );
        },
        pageHeight: function()
        {
            return Math.max( 0, _b.scrollHeight || 0, _b.offsetHeight || 0, _d.clientHeight || 0, _d.offsetHeight || 0, _d.scrollHeight || 0 );
        },
        pageRatio: function()
        {
            return this.pageWidth() / this.pageHeight();
        },
        pageCenterX: function()
        {
            return this.pageWidth() / 2;
        },
        pageCenterY: function()
        {
            return this.pageHeight() / 2;
        },
        pageScrollX: function()
        {
            return Math.max( 0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0 ) - ( _d.clientLeft || 0 );
        },
        pageScrollY: function()
        {
            return Math.max( 0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0 ) - ( _d.clientTop || 0 );
        },
        pageScrollMinX: function()
        {
            return 0;
        },
        pageScrollMaxX: function()
        {
            return Math.max( 0, Math.floor( this.pageWidth() - this.screenWidth() ) );
        },
        pageScrollMinY: function()
        {
            return 0;
        },
        pageScrollMaxY: function()
        {
            return Math.max( 0, Math.floor( this.pageHeight() - this.screenHeight() ) );
        },
        pageInfo: function()
        {
            return {
                width      : this.pageWidth(),
                height     : this.pageHeight(),
                ratio      : this.pageRatio(),
                centerX    : this.pageCenterX(),
                centerY    : this.pageCenterY(),
                scrollX    : this.pageScrollX(),
                scrollMinX : this.pageScrollMinX(),
                scrollMaxX : this.pageScrollMaxX(),
                scrollY    : this.pageScrollY(),
                scrollMinY : this.pageScrollMinY(),
                scrollMaxY : this.pageScrollMaxY(),
            };
        },
        mouseX: function( e )
        {
            return e ? Math.max( 0, e.pageX || e.clientX || 0 ) : 0;
        },
        mouseY: function( e )
        {
            return e ? Math.max( 0, e.pageY || e.clientY || 0 ) : 0;
        },
        mouseCenterX: function( e )
        {
            return ( this.mouseX( e ) - ( this.screenWidth() / 2 ) );
        },
        mouseCenterY: function( e )
        {
            return ( this.mouseY( e ) - ( this.screenHeight() / 2 ) );
        },
        mouseInfo: function( e )
        {
            return {
                left    : this.mouseX( e ),
                top     : this.mouseY( e ),
                centerX : this.mouseCenterX( e ),
                centerY : this.mouseCenterY( e ),
            };
        },
        deviceCenterX: function( e )
        {
            var degree = this.orientation();

            if( e && e.beta !== null && e.gamma !== null )
            {
                if( degree === 0 )   return e.gamma;  // upside up
                if( degree === 180 ) return e.gamma * -1;  // upside down
                if( degree === 90 )  return e.beta;  // upside left
                if( degree === -90 ) return e.beta * -1;  // upside right
            }
            return 0;
        },
        deviceCenterY: function( e )
        {
             var degree = this.orientation();

            if( e && e.beta !== null && e.gamma !== null )
            {
                if( degree === 0 )   return e.beta;  // upside up
                if( degree === 180 ) return e.beta;  // upside down
                if( degree === 90 )  return e.gamma * -1;  // upside left
                if( degree === -90 ) return e.gamma;  // upside right
            }
            return 0;
        },
        deviceInfo: function( e )
        {
            return {
                angle   : this.orientation(),
                centerX : this.deviceCenterX( e ),
                centerY : this.deviceCenterY( e ),
            };
        },
        orientX: function( e )
        {
            return ( _w.orientation || this.isMobile() ) ? this.deviceCenterX() : this.mouseCenterX();
        },
        orientY: function( e )
        {
            return ( _w.orientation || this.isMobile() ) ? this.deviceCenterY() : this.mouseCenterY();
        },
        orientation : function()
        {
            var output = 0;

            if( "orientation" in _w )
            {
                output = _w.orientation || 0;
            }
            else if( "orientation" in _s || "mozOrientation" in _s || "msOrientation" in _s )
            {
                switch( _s.orientation || _s.mozOrientation || _s.msOrientation || "" )
                {
                    case "portrait-primary":    output = 0;    break;
                    case "portrait-secondary":  output = 180;  break;
                    case "landscape-primary":   output = 90;   break;
                    case "landscape-secondary": output = -90;  break;
                }
            }
            else if( "matchMedia" in _w && _w.matchMedia( "(orientation: landscape)" ).matches )
            {
                output = this.isMobile() ? 90 : 0;
            }
            else if( this.screenWidth() > this.screenHeight() )
            {
                output = this.isMobile() ? 90 : 0;
            }
            return output;
        },
        isMobile : function()
        {
            var uagent = ( navigator.userAgent || navigator.vendor || window.opera || "" );
            return /^.*(android|webos|iphone|ipad|ipod|blackberry|phone|playbook|xda|xiino|silk|mobile).*$/i.test( uagent ) ? true : false;
        },
    };
});