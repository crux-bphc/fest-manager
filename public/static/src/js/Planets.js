/**
 * Planets object.
 * Adds random planets to the scene.
 */
(function( name, factory )
{
    if( typeof define === 'function' && define.amd ){ define( [], factory ); } else
    if( typeof exports === 'object' ){ module.exports = factory; } else
    if( window ){ window[ name ] = factory(); }

})( "Planets", function()
{
    // class constructor
    var Factory = function()
    {
        this.total    = 3;
        this.loaded   = 0;
        this.ease     = 18;
        this.radius   = 180;
        this.distance = -100;
        this.move     = { x: 0, y: 0, z: this.distance };
        this.look     = { x: 0, y: 0, z: 0 };
        this.planets  = [];
        this.group    = null;
        this.ready    = false;
        this.hyper    = false;
    };

    // class prototype
    Factory.prototype = {
        constructor: Factory,

        // on add to stage
        onSetup: function( stage )
        {
            stage.preloadTexture( "planet1", "dist/images/planet1.jpg" );
            stage.preloadTexture( "planet2", "dist/images/planet2.jpg" );
            stage.preloadTexture( "planet3", "dist/images/planet3.jpg" );
            stage.preloadTexture( "planet4", "dist/images/planet4.jpg" );
            stage.preloadTexture( "planet5", "dist/images/planet5.jpg" );
            stage.preloadTexture( "water",   "dist/images/water.jpg" );
            stage.preloadTexture( "moon",    "dist/images/moon.jpg" );
        },

        // on stage ready
        onInit: function( stage )
        {
            this.createPlanets( stage );
            this.addPlanets( stage );
            this.ready = true;
        },

        // on mouse move
        onMouse: function( stage, mouse )
        {
            if( !this.hyper )
            {
                this.move.x = -( mouse.centerX * 0.4 );
                this.move.y =  ( mouse.centerY * 0.4 );
            }
        },

        // on device orientation
        onOrientation: function( stage, device )
        {
            if( !this.hyper )
            {
                this.move.x = -( device.centerX * 6.5 );
                this.move.y =  ( device.centerY * 6.5 );
            }
        },

        // on aimation frame
        onFrame: function( stage, now )
        {
            if( this.ready )
            {
                if( !this.hyper )
                {
                    var time   = ( now * 0.00006 );
                    var angle  = ( time * Math.PI );
                    var radius = 250;

                    for ( var i = 0; i < this.group.children.length; i++ )
                    {
                        // rotate planet
                        this.group.children[ i ].rotation.z -= 0.0005;

                        if( this.group.children[ i ].children.length )
                        {
                            // rotate atmosphere
                            if( this.group.children[ i ].children[ 0 ] )
                            {
                                this.group.children[ i ].children[ 0 ].rotation.y -= 0.0025;
                            }
                            // orbit moon
                            if( this.group.children[ i ].children[ 1 ] )
                            {
                                //this.group.children[ i ].children[ 1 ].position.x = Math.cos( angle ) * radius;
                                this.group.children[ i ].children[ 1 ].position.y = Math.sin( angle ) * radius;
                                this.group.children[ i ].children[ 1 ].position.z = Math.cos( angle ) * radius;
                                this.group.children[ i ].children[ 1 ].rotation.z += 0.01;
                            }
                        }
                    }
                }
                this.group.position.x += ( this.move.x - this.group.position.x ) / this.ease;
                this.group.position.y += ( this.move.y - this.group.position.y ) / this.ease;
                this.group.position.z += ( this.move.z - this.group.position.z ) / this.ease;
                this.group.rotation.x += ( this.look.x - this.group.rotation.x ) / this.ease;
                this.group.rotation.y += ( this.look.y - this.group.rotation.y ) / this.ease;
                this.group.rotation.z += ( this.look.z - this.group.rotation.z ) / this.ease;

                this.look.z += 0.0003; // rotate group
            }
        },

        // create list of planets for each loaded texture
        createPlanets: function( stage )
        {
            this.planets = [];

            var radius = 100;

            for ( var i = 0; i < 5; i++ )
            {
                var planet = new THREE.Mesh(
                    new THREE.SphereGeometry( radius, 40, 40 ),
                    new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        map: stage.getTexture( "planet" + ( i + 1 ) ),
                        side: THREE.FrontSide,
                        blending: THREE.AdditiveBlending,
                        transparent: false,
                        depthTest: true,
                }));

                var atmos = new THREE.Mesh(
                    new THREE.SphereGeometry( radius + 4, 40, 40 ),
                    new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        opacity: 1,
                        map: stage.getTexture( "water" ),
                        side: THREE.FrontSide,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        depthTest: true,
                }));
                planet.add( atmos );

                if( THREE.Math.randInt( 1, 3 ) === 3 )
                {
                    var moon = new THREE.Mesh(
                        new THREE.SphereGeometry( radius * 0.15, 30, 30 ),
                        new THREE.MeshLambertMaterial({
                            color: 0xffffff,
                            map: stage.getTexture( "moon" ),
                            side: THREE.FrontSide,
                            blending: THREE.AdditiveBlending,
                            transparent: false,
                            depthTest: true,
                    }));
                    planet.add( moon );
                }

                this.planets.push( planet );
            }
        },

        // add planets to scene
        addPlanets: function( stage )
        {
            this.group = new THREE.Object3D();
            this.group.position.set( this.move.x, this.move.y, this.move.z + 1000 );
            this.group.rotation.set( this.look.x, this.look.y, this.look.z );

            var length = this.planets.length;
            var total  = THREE.Math.randInt( 1, 2 );
            var index  = THREE.Math.randInt( 0, length - 1 );

            for ( var i = 0; i < length; i++ )
            {
                if( ( i + 1 ) > total ) continue;

                index = ( index + 1 );
                index = ( index > length - 1 ) ? 0 : index;

                var distance = THREE.Math.randFloat( -1000, -500 );
                var position = THREE.Math.randPie( 500, ( i + 1 ), total );
                var planet   = this.planets[ index ];

                planet.position.set( position.x, position.y, distance );
                planet.rotation.set( position.x, position.y, distance );

                this.group.add( planet );
            }
            stage.addToScene( this.group );
        },

        // remove planets to scene
        removePlanets: function( stage )
        {
            stage.removeFromScene( this.group );
        },

        // move group in
        zoomIn: function()
        {
            if( this.hyper ) return;
            this.move.z = ( this.distance + 800 );
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
            this.removePlanets( stage );
            this.hyper = true;
        },

        // on hyper stop
        hyperStop: function( stage )
        {
            this.addPlanets( stage );
            this.hyper = false;
        },
    };

    // export
    return Factory;
});