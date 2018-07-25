/**
 * Stage object.
 * Creates and manages a Three.js stage/scene.
 */
(function( name, factory )
{
    if( typeof define === 'function' && define.amd ){ define( [], factory ); } else
    if( typeof exports === 'object' ){ module.exports = factory; } else
    if( window ){ window[ name ] = factory(); }

})( "Stage", function()
{
    // class constructor
    var Factory = function( id, options )
    {
        this.id       = ( id && typeof id === "string" ) ? id : "three-stage";
        this.width    = 0;
        this.height   = 0;
        this.ease     = 20;
        this.zoom     = 600;
        this.move     = { x: 0, y: 0, z: 200 };
        this.look     = { x: 0, y: 0, z: 0 };
        this.started  = false;
        this.loaded   = false;
        this.ready    = false;
        this.camera   = null;
        this.scene    = null;
        this.renderer = null;
        this.light    = null;
        this.events   = {};
        this.objects  = [];
        this.error    = "";
        this.timer    = { last: 0, fps: 0 };
        this.preload  = { textures: {}, total: 0, loaded: 0 };
        this.keymap   = { enter: 13, tab: 9, esc: 27, return: 8, space: 32, up: 38, down: 40, left: 37, right: 39 };

        this.onResize      = this.onResize.bind( this );
        this.onScroll      = this.onScroll.bind( this );
        this.onMouse       = this.onMouse.bind( this );
        this.onClick       = this.onClick.bind( this );
        this.onPress       = this.onPress.bind( this );
        this.onRelease     = this.onRelease.bind( this );
        this.onKeyboard    = this.onKeyboard.bind( this );
        this.onOrientation = this.onOrientation.bind( this );
        this.onFrame       = this.onFrame.bind( this );
        this.triggerEvent  = this.triggerEvent.bind( this );
        this.drawFrame     = this.drawFrame.bind( this );
        this.init          = this.init.bind( this );

        try {
            this.renderer = this.resolveRenderer( options || {} );
            this.camera   = new THREE.PerspectiveCamera( 60, Device.screenInfo().ratio, 0.1, 20000 );
            this.light    = new THREE.SpotLight( 0xffffff, 1, 3000, 0.4, 0.5, 1 );
            this.scene    = new THREE.Scene();
            
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setClearColor( 0x000000, 0 );
            this.renderer.sortObjects = true;

            this.camera.position.set( this.move.x, this.move.y, this.move.z );
            this.camera.rotation.set( this.look.x, this.look.y, this.look.z );
            this.camera.lookAt( this.scene.position );

            this.light.position.set( this.move.x, this.move.y, this.move.z );
            this.scene.add( this.light );
            this.ready = true;
        }
        catch( error ) {
            this.error = error;
        }
    };

    // class prototype
    Factory.prototype = {
        constructor: Factory,

        // check WebGL support
        webglSupport: function()
        {
            try {
                var canvas = document.createElement( "canvas" );
                return !! ( window.WebGLRenderingContext && ( canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" ) ) );
            } catch( e ) { return false; }
        },

        // check Canvas2D support
        canvasSupport: function()
        {
            return !! window.CanvasRenderingContext2D;
        },

        // bind window events
        setupEvents: function()
        {
            window.addEventListener( "resize", this.onResize, false );
            window.addEventListener( "scroll", this.onScroll, false );
            window.addEventListener( "click", this.onClick, false );
            window.addEventListener( "mousemove", this.onMouse, false );
            window.addEventListener( "mousedown", this.onPress, false );
            window.addEventListener( "touchstart", this.onPress, false );
            window.addEventListener( "mouseup", this.onRelease, false );
            window.addEventListener( "touchend", this.onRelease, false );
            window.addEventListener( "keydown", this.onKeyboard, false );
            window.addEventListener( "deviceorientation", this.onOrientation, false );
            this.triggerEvent( "onEventsAdded", Date.now() );
        },

        // add renderer DOM element to the page and set default CSS for it
        setupStage: function()
        {
            if( this.renderer && this.renderer.domElement )
            {
                this.renderer.domElement.setAttribute( "id", this.id );
                this.renderer.domElement.style["display"]  = "block";
                this.renderer.domElement.style["position"] = "fixed";
                this.renderer.domElement.style["width"]    = "100%";
                this.renderer.domElement.style["height"]   = "100%";
                this.renderer.domElement.style["z-index"]  = "-1";
                this.triggerEvent( "onStageAdded", this.renderer.domElement );
                document.body.appendChild( this.renderer.domElement );
            }
        },

        // resolve renderer
        resolveRenderer: function( params )
        {
            params = params || {};

            if( this.webglSupport() && THREE.WebGLRenderer )
            {
                return new THREE.WebGLRenderer( params );
            }
            throw "" +
                "It appears that this web browser just doesn't have what is " +
                "needed to display the visual effects on this page. " +
                "This page requires WebGL technology to be available in order " +
                "to render 3D graphics in the browser. " +
                "Hop on another browser and try again later.";
        },

        // checks is preloading of textures are done
        isLoaded: function()
        {
            if( this.preload.total > 0 )
            {
                if( this.preload.loaded === this.preload.total )
                {
                    return true;
                }
                return false;
            }
            return true;
        },

        // add a texture loader to the preload list
        preloadTexture: function( key, file )
        {
            if( this.ready ) // don"t load anything unless ready
            {
                if( key && typeof key === "string" && file && typeof file === "string" )
                {
                    if( this.preload.textures.hasOwnProperty( key ) !== true )
                    {
                        this.preload.textures[ key ] = new THREE.Texture();
                        this.preload.total += 1;

                        var complete = function( texture )
                        {
                            this.triggerEvent( "onTextureLoaded", texture );
                            this.preload.textures[ key ] = texture;
                            this.preload.loaded += 1;
                        };
                        var error = function( xhr )
                        {
                            var info = "Could not pre-load texture graphic file ("+ file +").";
                            this.triggerEvent( "onTextureError", info );
                            this.preload.loaded += 1; // keep going
                        };
                        var progress = function( xhr )
                        {
                            var info = "Pre-loading file ("+ file +"), "+ ( xhr.loaded / xhr.total * 100 ) + "% complete...";
                            this.triggerEvent( "onTextureProgress", info );
                        };
                        try {
                            var loader = new THREE.TextureLoader();
                            loader.crossOrigin = "";
                            loader.load( file, complete.bind( this ), progress.bind( this ), error.bind( this ) );
                        }
                        catch( e ) {
                            this.triggerEvent( "onError", "There was a problem trying to load a texture file ("+ file +") : " + e );
                        }
                    }
                }
            }
        },

        // get loaded texture from preload list
        getTexture: function( key )
        {
            if( this.ready ) // nothing to get until ready
            {
                if( key && typeof key === "string" && this.preload.textures.hasOwnProperty( key ) )
                {
                    return this.preload.textures[ key ]; // texture for key
                }
                return new THREE.Texture(); // fallback
            }
            return null;
        },

        // add custom scene object to the list
        addObject: function( obj )
        {
            if( typeof obj === "object" )
            {
                if( typeof obj.onSetup === "function" )
                {
                    obj.onSetup.call( obj, this );
                }
                this.objects.push( obj );
            }
        },

        // add something to the scene
        addToScene: function( item )
        {
            if( this.scene && typeof item === "object" )
            {
                this.scene.add( item );
            }
        },

        // add something to the scene
        removeFromScene: function( item )
        {
            if( this.scene && typeof item === "object" )
            {
                this.scene.remove( item );
            }
        },

        // on page resize
        onResize: function( e )
        {
            var info = Device.screenInfo();
            this.width  = info.width;
            this.height = info.height;

            if( this.ready )
            {
                this.renderer.setSize( this.width, this.height );
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
            }
            this.triggerEvent( "onResize", info );
        },

        // on page scroll
        onScroll: function( e )
        {
            var info = Device.pageInfo();
            this.triggerEvent( "onScroll", info );
        },

        // on mouse move
        onMouse: function( e )
        {
            var info = Device.mouseInfo( e );
            this.triggerEvent( "onMouse", info );
        },

        // on mouse click
        onClick: function( e )
        {
            var info = Device.mouseInfo( e );
            this.triggerEvent( "onClick", info );
        },

        // on tap/click+hold
        onPress: function( e )
        {
            var info = Device.mouseInfo( e );
            this.triggerEvent( "onPress", info );
        },

        // on click/tap release
        onRelease: function( e )
        {
            var info = Device.mouseInfo( e );
            this.triggerEvent( "onRelease", info );
        },

        // on key press
        onKeyboard: function( e )
        {
            var code = e.keyCode || e.charCode || e.which || -1;
            if( code === this.keymap.enter )  this.triggerEvent( "onEnter", code );
            if( code === this.keymap.tab )    this.triggerEvent( "onTab", code );
            if( code === this.keymap.esc )    this.triggerEvent( "onEscape", code );
            if( code === this.keymap.return ) this.triggerEvent( "onReturn", code );
            if( code === this.keymap.space )  this.triggerEvent( "onSpace", code );
            if( code === this.keymap.up )     this.triggerEvent( "onUp", code );
            if( code === this.keymap.down )   this.triggerEvent( "onDown", code );
            if( code === this.keymap.left )   this.triggerEvent( "onLeft", code );
            if( code === this.keymap.right )  this.triggerEvent( "onRight", code );
            this.triggerEvent( "onKeyboard", code );
        },

        // on device orientation change
        onOrientation: function( e )
        {
            var info = Device.deviceInfo( e );
            this.triggerEvent( "onOrientation", info );
        },

        // on animation frame
        onFrame: function( time )
        {
            if( this.camera )
            {
                this.camera.position.x += ( this.move.x - this.camera.position.x ) / this.ease;
                this.camera.position.y += ( this.move.y - this.camera.position.y ) / this.ease;
                this.camera.position.z += ( this.move.z - this.camera.position.z ) / this.ease;
                this.camera.rotation.x += ( this.look.x - this.camera.rotation.x ) / this.ease;
                this.camera.rotation.y += ( this.look.y - this.camera.rotation.y ) / this.ease;
                this.camera.rotation.z += ( this.look.z - this.camera.rotation.z ) / this.ease;
            }
            this.triggerEvent( "onFrame", time );
        },

        // register a callback for an event
        onEvent: function( event, callback )
        {
            if( event && typeof event === "string" && typeof callback === "function" )
            {
                this.events[ event ] = callback;
            }
        },

        // trigger registered events and object functions
        triggerEvent: function( name, data )
        {
            if( this.ready )
            {
                var i = 0,
                    t = this.objects.length,
                    o = null;

                if( name && typeof name === "string" )
                {
                    for( i; i < t; ++i ) // on added objects
                    {
                        o = this.objects[ i ];

                        if( typeof o[ name ] === "function" )
                        {
                            o[ name ].call( o, this, data );
                        }
                    }
                    if( this.events.hasOwnProperty( name ) ) // local
                    {
                        this.events[ name ].call( this, data );
                    }
                }
            }
        },

        // get current fps number
        getFps: function( append )
        {
            append = ( typeof append === "string" ) ? append : "fps";
            return this.timer.fps + " " + append;
        },

        // render stage
        drawFrame: function( time )
        {
            if( this.ready && document.hasFocus() )
            {
                this.onFrame( time );
                this.renderer.render( this.scene, this.camera );
                this.timer.fps  = Math.floor( 1000 / ( time - this.timer.last ) );
                this.timer.last = time;
            }
            requestAnimationFrame( this.drawFrame );
        },

        // init stage
        init: function()
        {
            if( this.ready && !this.started )
            {
                this.triggerEvent( "onProgress", Math.floor( this.preload.loaded / this.preload.total * 100 ) + "%" );

                if( this.isLoaded() !== true )
                {
                    setTimeout( this.init, 100 );
                    return;
                }
                this.setupStage();
                this.setupEvents();
                this.onResize();
                this.triggerEvent( "onInit", Date.now() );
                this.drawFrame( 0 );
                this.started = true;
                return;
            }
            this.triggerEvent( "onError", this.error );
        },
    };

    // export
    return Factory;
});