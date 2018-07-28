/**
 * Nebula object.
 * Adds background nebula effect to the scene.
 */
(function( name, factory )
{
    if( typeof define === 'function' && define.amd ){ define( [], factory ); } else
    if( typeof exports === 'object' ){ module.exports = factory; } else
    if( window ){ window[ name ] = factory(); }

})( "Nebula", function()
{
    // class constructor
    var Factory = function()
    {
        this.group    = null;
        this.texture  = null;
        this.cylinder = null;
        this.light    = null;
        this.ready    = false;
        this.ease     = 12;
        this.cycle    = 0.0002;
        this.move     = { x: 0, y: 0, z: -4000 };
        this.look     = { x: 0, y: 0, z: 0 };
        this.hyper    = false;
    };

    // class prototype
    Factory.prototype = {
        constructor: Factory,

        // on setup
        onSetup: function( stage )
        {
            stage.preloadTexture( "nebula", "dist/images/water.jpg" );
        },

        // create objects
        onInit: function( stage )
        {
            this.group = new THREE.Object3D();
            this.group.position.set( this.move.x, this.move.y, this.move.z );
            this.group.rotation.set( this.look.x, this.look.y, this.look.z );

            this.texture = stage.getTexture( "nebula" );
            this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.wrapS = THREE.RepeatWrapping;

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                opacity: 0,
                map: this.texture,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: false,
                depthTest: false,
            });

            this.cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 2000, 0, 10000, 30, 30, true ), material );
            this.cylinder.position.set( 0, 0, 0 );
            this.cylinder.rotation.x = Math.PI / 2;

            this.light = new THREE.PointLight( 0xffffff, 1.5, 10000 );
            this.light.position.set( 0, 0, 1000 );

            this.changeColor( stage );
            this.group.add( this.cylinder );
            this.group.add( this.light );

            stage.addToScene( this.group );
            this.ready = true;
        },

        // on mouse move
        onMouse: function( stage, mouse )
        {
            if( !this.hyper )
            {
                this.move.x = -( mouse.centerX * 0.002 );
                this.move.y =  ( mouse.centerY * 0.002 );
                this.look.y = -( mouse.centerX * 0.0001 );
                this.look.x = -( mouse.centerY * 0.0001 );
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

        // update particles
        onFrame: function( stage, now )
        {
            if( this.ready )
            {
                this.look.z += this.cycle;
                this.texture.offset.y -= this.cycle;
                this.texture.needsUpdate = true;

                this.group.position.x += ( this.move.x - this.group.position.x ) / this.ease;
                this.group.position.y += ( this.move.y - this.group.position.y ) / this.ease;
                this.group.position.z += ( this.move.z - this.group.position.z ) / this.ease;
                this.group.rotation.x += ( this.look.x - this.group.rotation.x ) / this.ease;
                this.group.rotation.y += ( this.look.y - this.group.rotation.y ) / this.ease;
                this.group.rotation.z += ( this.look.z - this.group.rotation.z ) / this.ease;
            }
        },

        // change nebula color
        changeColor: function( stage )
        {
            var color = new THREE.Color();
            color.setHSL( Math.random(), 1, 0.5 );
            this.light.color = color;
        },

        // start hyper travel
        hyperStart: function( stage )
        {
            this.light.color = new THREE.Color( 0xcceeff );
            this.cycle += 0.005;
            this.move.z -= 2000;
            this.hyper = true;
        },

        // start hyper travel
        hyperStop: function( stage )
        {
            this.changeColor( stage );
            this.cycle -=  0.005;
            this.move.z += 2000;
            this.hyper = false;
        },
    };

    // export
    return Factory;
});