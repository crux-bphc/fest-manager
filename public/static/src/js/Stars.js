/**
 * Stars object.
 * Adds background stars to the scene.
 */
(function( name, factory )
{
    if( typeof define === 'function' && define.amd ){ define( [], factory ); } else
    if( typeof exports === 'object' ){ module.exports = factory; } else
    if( window ){ window[ name ] = factory(); }

})( "Stars", function()
{
    // class constructor
    var Factory = function()
    {
        this.total    = 600;
        this.spread   = 3000;
        this.near     = 140;
        this.size     = 54;
        this.ease     = 12;
        this.distance = -3000;
        this.move     = { x: 0, y: 0, z: this.distance };
        this.look     = { x: 0, y: 0, z: 0 };
        this.group    = null;
        this.geometry = null;
        this.material = null;
        this.colors   = [];
        this.rands    = [];
        this.ready    = false;
        this.hyper    = false;
    };

    // class prototype
    Factory.prototype = {
        constructor: Factory,

        // on add to stage
        onSetup: function( stage )
        {
            stage.preloadTexture( "star", "dist/images/star.png" );
        },

        // on stage ready
        onInit: function( stage )
        {
            this.group = new THREE.Object3D();
            this.group.position.set( this.move.x, this.move.y, this.move.z - 1000 );
            this.group.rotation.set( this.look.x, this.look.y, this.look.z );

            this.createStars( stage );
            stage.addToScene( this.group );
            this.ready = true;
        },

        // on mouse move
        onMouse: function( stage, mouse )
        {
            if( !this.hyper )
            {
                this.move.x = -( mouse.centerX * 0.2 );
                this.move.y =  ( mouse.centerY * 0.2 );
                this.look.y = -( mouse.centerX * 0.0002 );
                this.look.x = -( mouse.centerY * 0.0002 );
            }
        },

        // on device orientation
        onOrientation: function( stage, device )
        {
            if( !this.hyper )
            {
                this.move.x = -( device.centerX * 0.6 );
                this.move.y =  ( device.centerY * 0.6 );
                this.look.y = -( device.centerX * 0.002 );
                this.look.x = -( device.centerY * 0.002 );
            }
        },

        // on aimation frame
        onFrame: function( stage, now )
        {
            if( this.ready )
            {
                // if( !this.hyper )
                // {
                //     var time   = ( now * 0.0005 );
                //     var angle  = ( time * Math.PI );
                //     var radius = 2;

                //     for( var i = 0; i < this.total; i++ ) // pulse stars
                //     {
                //         this.geometry.vertices[ i ].z += Math.sin( this.rands[ i ].angle + angle ) * radius;
                //     }
                //     this.geometry.verticesNeedUpdate = true;
                // }
                this.group.position.x += ( this.move.x - this.group.position.x ) / this.ease;
                this.group.position.y += ( this.move.y - this.group.position.y ) / this.ease;
                this.group.position.z += ( this.move.z - this.group.position.z ) / this.ease;
                this.group.rotation.x += ( this.look.x - this.group.rotation.x ) / this.ease;
                this.group.rotation.y += ( this.look.y - this.group.rotation.y ) / this.ease;
                this.group.rotation.z += ( this.look.z - this.group.rotation.z ) / this.ease;

                this.look.x += 0.0008; // keep it spinning
                
            }
        },

        // create new star field group
        createStars: function( stage )
        {
            this.colors   = [];
            this.rands    = [];
            this.geometry = new THREE.Geometry();
            this.material = new THREE.PointsMaterial({
                size: this.size,
                color: 0xffffff,
                opacity: 1,
                map: stage.getTexture( "star" ),
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                depthTest: true,
            });

            for ( var i = 0; i < this.total; i++ )
            {
                var radius = THREE.Math.randInt( 0, this.spread );
                var angle  = ( Math.random() * Math.PI * 2 );

                var color = new THREE.Color();
                color.setHSL( THREE.Math.randFloat( 0.5, 0.6 ), 1, 0.8 );

                var star = new THREE.Vector3(
                    Math.cos( angle ) * radius,
                    Math.sin( angle ) * radius,
                    THREE.Math.randInt( -this.spread, 0 )
                );
                this.colors.push( color );
                this.rands.push( { angle: Math.random() * Math.PI } );
                this.geometry.vertices.push( star );
            }
            this.geometry.colors = this.colors;
            this.group.add( new THREE.Points( this.geometry, this.material ) );
        },

        // move group in
        zoomIn: function()
        {
            if( this.hyper ) return;
            this.move.z = ( this.distance + 400 );
        },

        // move group out
        zoomOut: function()
        {
            if( this.hyper ) return;
            this.move.z = this.distance;
        },

        // on hyper start
        hyperStart: function( stage )
        {
            this.ease += 100;
            this.move.z -= 5000;
            this.hyper = true;
        },

        // on hyper stop
        hyperStop: function( stage )
        {
            this.ease -= 100;
            this.move.z += 5000;
            this.hyper = false;
        },
    };

    // export
    return Factory;
});