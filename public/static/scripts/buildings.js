var Buildings = null;


var Constructor = function () {

	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
		$('.controller').remove();
		return true;
	}
	var avgArray = Array(128).fill(0);
	var maxArray = Array(128).fill(0);

	// Some useful functions

	var rgb2vec = function (r, g, b) {
		return new THREE.Vector3(r / 255, g / 255, b / 255);
	};

	// Ugliest hack for generations to come.
	var generateGetAtForShaderBecauseGLSLisDumbAF = function (length) {
		var string = "int getAt(int index) {\n";
		for (var i = 0; i < length; i++) {
			string += "\tif(index == " + i + ") return timeDomainData[" + i + "];\n";
		}
		string += "}\n";
		return string;
	};

	var getSmoothArray = function (input) {
		var output = [];
		var percent = 2;
		var len = input.length;
		for (var i = 2; i < len - 2; i++) {
			input[i] = (5 * input[i] + 3 * input[(i - 1) % len] + 3 * input[(i + 1) % len]) / 11;
			input[i] = (3 * input[i] + 1 * input[(i - 2) % len] + 1 * input[(i + 2) % len]) / 5;
		}
		var max = 1;
		var avg = 0;
		for (i = 0; i < len; i++) {
			if (maxArray[i] > max) {
				max = maxArray[i];
			}
			avg = avg + maxArray[i];
		}
		avg = avg / len;
		if (max > 600) {
			percent = 20;
		}
		for (i = 0; i < len; i++) {
			input[i] = Math.max(30, (input[i] - 90)) * 2;
			avgArray[i] = (2 * avgArray[i] + 3 * input[i]) / 5;
			maxArray[i] = Math.max(maxArray[i] * (100 - percent) / 100, avgArray[i] * (100 + percent * 5) / 100) * (0.95 + Math.random() * 0.1);
		}
		return maxArray;
	};

	// Declare globals

	// Input streams
	var inputs = {};
	var audio = manager.getAudio();
	inputs.video = $('#video-stream')[0];
	inputs.audio = audio.domElement;

	// Scene resources
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
	camera.focus = 20;
	var renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	var init = true;
	var composer = new THREE.EffectComposer(renderer);
	composer.setSize(window.innerWidth, window.innerHeight);
	var textures = {};
	var targets = {};
	var state = {
		bokeh: {
			maxblur: 0.01,
			focus: 400,
			aperture: Math.pow(10, 5),
		},
		play: false,
		radius: 5000,
		time: 0,
		freeroam: false,
	};
	var timeline = {};
	var geometries = {};
	var materials = {};
	var buildings = [];
	var city = [];
	var world = {};
	var passes = {};

	var timeout;
	var LAMPPOST = {
			thickness: 0.5,
			height: 25
		},
		CENTRAL = {
			radius: 100,
			height: 100,
			res: 100,
			sector: Math.PI,
		},
		MINHEIGHT = 150,
		MINWIDTH = 140,
		MINLENGTH = 120,
		LAYERS = 5,
		SPEED = 0.5,
		TILE_LENGTH = 2000;
	TILE_SPACING = 3 * TILE_LENGTH / 16;
	ANIMATING_FACTOR = 50;
	KHALIFA = {
		height: 0
	};
	// Mapping frames to the screen.
	var screen = document.createElement('canvas');
	screen.width = 1024;
	screen.height = screen.width / 2;
	screen.style.position = "fixed";
	screen.style.boxShadow = "0px 0px 5px rgba(255,255,255,0.2)";
	screen.style.zIndex = "+100000";
	screen.style.left = 0;
	screen.style.top = 0;
	var ctx = screen.getContext('2d');

	var startImmersion = function () {
		// Initialize renderer

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 1);
		// scene.matrixAutoUpdate = false;
		// renderer.autoClear = false;
		$('#fallback').remove();
		$('.immersive-wrapper').append(renderer.domElement);
		initTargets();
		initTextures();
		initGeometries();
		initMaterials();
		initCity();
		initLights();
		initTimeline();
		audio.init();
		make();
		postProcess();
		start();
	};

	// Constructs all meshes from combined buildings geometry
	var make = function () {
		// Make buildings from combined Geometry
		var Buildings = new THREE.Mesh(geometries.buildings, materials.buildings);
		scene.add(Buildings);

		// Logo
		var Logo = new THREE.Mesh(geometries.logo, materials.logo);
		scene.add(Logo);
		Logo.lookAt(new THREE.Vector3(1, 0, 1));
		Logo.position.x = KHALIFA.building.position.x;
		Logo.position.y = KHALIFA.building.position.y + KHALIFA.height / 2 + MINWIDTH / 9;
		Logo.position.z = KHALIFA.building.position.z;

		var Stage = new THREE.Mesh(geometries.stage, materials.screen);
		scene.add(Stage);
		Stage.position.x = -TILE_LENGTH;
		Stage.position.y = MINHEIGHT * 4;
		Stage.position.z = TILE_SPACING / 2;

		var Stars = new THREE.Points(geometries.stars, materials.stars);
		Stars.frustumCulled = true;
		scene.add(Stars);

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		camera.position.x = 350;
		camera.position.y = 500;
		camera.position.z = -450;

		// City Centre
		var central = new THREE.Mesh(geometries.central, materials.central);
		central.position.set(-100, 70, -100);
		scene.add(central);
		var upperBevel = new THREE.Mesh(geometries.centralBevel, materials.buildings);
		upperBevel.position.set(-100, 70 + CENTRAL.height / 2, -100);
		var lowerBevel = new THREE.Mesh(geometries.centralBevel, materials.buildings);
		lowerBevel.position.set(-100, 70 - CENTRAL.height / 2, -100);
		scene.add(upperBevel);
		scene.add(lowerBevel);
		upperBevel.rotateY(-Math.PI / 2);
		lowerBevel.rotateY(-Math.PI / 2);
		world.update = function () {
			// All the updates to the meshes generated here are updated here.
			materials.central.uniforms.time.value += 0.001;
			materials.stars.uniforms.time.value += 1;
			materials.stars.uniforms.camera.value = camera.position;
			materials.buildings.uniforms.camera.value = camera.position;
			materials.buildings.uniforms.intensity.value = 0.75 + camera.position.y * 0.00001;
			var audioDataArray = getSmoothArray(Array.from(audio.dataArray.slice(0, 128)));
			// console.log(audioDataArray);
			materials.buildings.uniforms.timeDomainData.value = audioDataArray;
			materials.ground.uniforms.intensity.value = 1 + camera.position.y * 0.00006;
			materials.ground.uniforms.camera.value = camera.position;

			ctx.drawImage(inputs.video, (screen.width / 2) - ((screen.height * 16) / 18), 0, ((screen.height * 16) / 9), screen.height);
			textures.screen.needsUpdate = true;
		};
	};

	var postProcess = function () {
		passes.renderPass = new THREE.RenderPass(scene, camera);
		passes.glitchPass = new THREE.GlitchPass(1);
		passes.bokehPass = new THREE.BokehPass(scene, camera, state.bokeh);
		passes.glitchPass.renderToScreen = true;
		passes.update = function () {
			var bomb;
			if (audio.high && audio.high > 190) {
				// console.log(audio.high);
				clearTimeout(bomb);
				bomb = setTimeout(function () {
					passes.glitchPass.uniforms.byp.value = 1;
				}, 1000);
				this.glitchPass.uniforms.byp.value = 0;
			}
		};
		composer.addPass(passes.renderPass);
		composer.addPass(passes.glitchPass);
		// composer.addPass(passes.bokehPass);
	};

	var start = function (texture) {

		state.time = 0;
		var initFrame = 0;
		var starttime = Date.now();
		inputs.video.play();
		camera.position.set(150, 8000, 150);
		camera.follow = new THREE.Vector3(0, 0, 0);
		timeline.moveto(0);
		passes.glitchPass.uniforms.byp.value = 1;

		function animate() {
			requestAnimationFrame(animate);
			state.time++;
			// renderer.render(scene, camera);
			composer.render(0.1);
			camera.lookAt(camera.follow);
			audio.update();
			world.update();
			targets.update();
			passes.update();
		}
		animate();
	};

	var initGeometries = function () {
		geometries.buildings = new THREE.Geometry();
		geometries.logo = new THREE.PlaneBufferGeometry(MINWIDTH, MINWIDTH / 4, 1, 1);
		geometries.ground = new THREE.PlaneBufferGeometry(TILE_LENGTH + TILE_SPACING, TILE_LENGTH + TILE_SPACING, 1, 1);
		geometries.screen = new THREE.PlaneBufferGeometry(MINWIDTH, MINWIDTH, 1, 1);
		geometries.screenbase = new THREE.BoxBufferGeometry(MINWIDTH + 5, 10, 10);
		geometries.stage = new THREE.CylinderGeometry(TILE_SPACING, 0, MINHEIGHT, 4);
		geometries.lights = new THREE.Geometry();
		geometries.stars = new THREE.Geometry();
		geometries.lamppost = new THREE.CylinderGeometry(LAMPPOST.thickness, LAMPPOST.thickness, LAMPPOST.height);
		geometries.lamppost.translate(0, -0.5, 0);
		geometries.lightbulb = new THREE.PlaneBufferGeometry(3, 3);
		geometries.central = new THREE.CylinderGeometry(CENTRAL.radius, CENTRAL.radius, CENTRAL.height, CENTRAL.res, 1, true, (5 * Math.PI / 2) + CENTRAL.sector, (5 * Math.PI / 2) - CENTRAL.sector);
		geometries.centralBevel = new THREE.CylinderGeometry(CENTRAL.radius + 5, CENTRAL.radius + 5, 5, CENTRAL.res, 1, false);
	};

	var initMaterials = function () {
		var buildingUniforms = {
			camera: {
				type: 'v3',
				value: new THREE.Vector3(0, 0, 0)
			},
			shade: {
				type: 'v3',
				value: rgb2vec(0, 0, 0)
			},
			light: {
				type: 'v3',
				value: rgb2vec(200, 80, 150)
			},
			lowFire: {
				type: 'v3',
				value: rgb2vec(50, 100, 200)
			},
			highFire: {
				type: 'v3',
				value: rgb2vec(20, 150, 250)
			},
			intensity: {
				type: 'f',
				value: 0.8
			},
			timeDomainData: {
				type: '1iv',
				value: []
			},
		};
		materials.buildings = new THREE.ShaderMaterial({
			uniforms: buildingUniforms,
			vertexShader: $('#buildings-vertex').text(),
			fragmentShader: $('#buildings-frag').text().replace('$insertUglyAssGetAtHere', generateGetAtForShaderBecauseGLSLisDumbAF(128)),
		});

		var groundUniforms = {
			streaks: {
				type: 'v2v',
				value: [
					new THREE.Vector2(0.0, 0.0),
					new THREE.Vector2(0.01, 0.01),
					new THREE.Vector2(0.02, 0.02),
					new THREE.Vector2(0.03, 0.03),
					new THREE.Vector2(0.04, 0.04)
				]
			},
			camera: {
				type: 'v3',
				value: new THREE.Vector3(0, 0, 0)
			},
			shade: {
				type: 'v3',
				value: rgb2vec(55, 105, 200)
			},
			size: {
				type: 'f',
				value: TILE_LENGTH + TILE_SPACING
			},
			intensity: {
				type: 'f',
				value: 0.75
			},
		};
		materials.ground = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			uniforms: groundUniforms,
			vertexShader: $('#ground-vertex').text(),
			fragmentShader: $('#ground-frag').text(),
		});
		var screenUniforms = {
			time: {
				type: 'f',
				value: 0.0
			}
		};
		materials.screen = new THREE.ShaderMaterial({
			transparent: true,
			side: THREE.DoubleSide,
			uniforms: screenUniforms,
			vertexShader: $('#screen-vertex').text(),
			fragmentShader: $('#screen-frag').text(),
		});
		materials.screenbase = new THREE.ShaderMaterial({
			vertexShader: $('#screenbase-vertex').text(),
			fragmentShader: $('#screenbase-frag').text(),
		});

		var logoUniforms = {
			texture: {
				type: 't',
				value: textures.logo
			},
			time: {
				type: 't',
				value: 0.0
			},
		};
		materials.logo = new THREE.ShaderMaterial({
			transparent: true,
			side: THREE.DoubleSide,
			uniforms: logoUniforms,
			vertexShader: $('#logo-vertex').text(),
			fragmentShader: $('#logo-frag').text(),
		});

		var particleUniforms = {
			texture: {
				type: 't',
				value: textures.lamp
			},
			camera: {
				type: 't',
				value: new THREE.Vector3(0, 0, 0)
			},
		};

		materials.stars = new THREE.ShaderMaterial({
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			uniforms: {
				texture: {
					type: 't',
					value: textures.stars
				},
				time: {
					type: 'f',
					value: 0.0
				},
				camera: {
					type: 'v3',
					value: new THREE.Vector3(0, 0, 0)
				},
			},
			vertexShader: $('#stars-vertex').text(),
			fragmentShader: $('#stars-frag').text(),
			transparent: true,
		});

		var centralUniforms = {
			time: {
				type: 'f',
				value: 0.0
			},
			mid: {
				type: 'f',
				value: 40.0
			},
			texture: {
				type: 't',
				value: textures.screen
			},
			textureScale: {
				type: 'v2',
				value: new THREE.Vector2(2.0, 1.0)
			},
			textureOffset: {
				type: 'v2',
				value: new THREE.Vector2(-0.5, 0.0)
			},
			halftone: {
				type: 't',
				value: textures.halftoneMap
			},
			halftoneScale: {
				type: 'v2',
				value: new THREE.Vector2(60.0, 10.0)
			},
		};
		materials.central = new THREE.ShaderMaterial({
			uniforms: centralUniforms,
			vertexShader: $("#central-vertex").text(),
			fragmentShader: $("#central-frag").text(),
			shading: THREE.SmoothShading,
			side: THREE.DoubleSide,
		});
	};

	var initTextures = function () {
		var loader = new THREE.TextureLoader();

		textures.stars = loader.load('/static/buildings/textures/star.png');
		textures.logo = loader.load('/static/buildings/textures/logo.png');
		textures.lamp = loader.load('/static/buildings/textures/lamp.png');
		textures.lamp.wrapS = textures.lamp.wrapT = THREE.RepeatWrapping;

		textures.halftoneMap = loader.load('/static/buildings/textures/halftoneBlur.jpg');
		textures.halftoneMap.wrapS = textures.halftoneMap.wrapT = THREE.RepeatWrapping;
		textures.centralMap = loader.load('/static/images/meta.jpg');
		textures.screen = new THREE.Texture(screen);
	};

	var initCity = function () {
		city.push(getTile(new THREE.Vector3(0, 0, 0), new THREE.Vector2(-1, -1), true));
		city.push(getTile(new THREE.Vector3(TILE_SPACING, 0, 0), new THREE.Vector2(1, -1), true));
		city.push(getTile(new THREE.Vector3(-TILE_LENGTH - TILE_SPACING, 0, 0), new THREE.Vector2(-1, -1), true));
		city.push(getTile(new THREE.Vector3(0, 0, TILE_SPACING), new THREE.Vector2(-1, 1), true));
		city.push(getTile(new THREE.Vector3(0, 0, -TILE_LENGTH - TILE_SPACING), new THREE.Vector2(-1, -1), true));
		city.push(getTile(new THREE.Vector3(TILE_SPACING, 0, -TILE_LENGTH - TILE_SPACING), new THREE.Vector2(1, -1), true));
		city.push(getTile(new THREE.Vector3(-TILE_LENGTH - TILE_SPACING, 0, TILE_SPACING), new THREE.Vector2(-1, 1), true));
		city.push(getTile(new THREE.Vector3(TILE_SPACING, 0, TILE_SPACING), new THREE.Vector2(1, 1), true));
		for (i = 0; i < city.length; i++) {
			scene.add(city[i]);
		}
	};

	var getTile = function (origin, direction, isDeveloped) {
		var tile = new THREE.Object3D();
		// Make ground from PlaneGeometry
		var plane = new THREE.Mesh(geometries.ground, materials.ground);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = 0.0;
		plane.position.x = origin.x + direction.x * TILE_LENGTH / 2;
		plane.position.z = origin.z + direction.y * TILE_LENGTH / 2;
		tile.add(plane);

		if (isDeveloped) {
			for (i = 0; i < LAYERS + 2; i++) {
				insertTrack(TILE_LENGTH, direction.x * (MINWIDTH / 2 + 2 * i * MINWIDTH), MINWIDTH, MINLENGTH, MINHEIGHT, 50 + MINWIDTH * i * 2, false, origin, direction.y);
				insertTrack(TILE_LENGTH, direction.y * (MINWIDTH / 2 + 2 * i * MINWIDTH), MINWIDTH, MINLENGTH, MINHEIGHT, 50 + MINWIDTH * i * 2, true, origin, direction.x);
			}
		}
		return tile;
	};

	var insertTrack = function (tracklength, trackcenter, minwidth, minlength, minheight, from, axis, origin, direction) {
		var mainDirection = axis ? 'x' : 'z';
		var secondDirection = !axis ? 'x' : 'z';
		var trackdone = from ? from : 0;
		var makeBuilding = function (length, height) {
			var box = null;
			if (axis) {
				box = new THREE.BoxGeometry(length, height, minwidth);
			} else box = new THREE.BoxGeometry(minwidth, height, length);
			// box.faces.splice(6, 2);
			var building = new THREE.Mesh(box, new THREE.MeshPhongMaterial(0x3555EE));
			building.castShadow = true;
			building.receiveShadow = true;
			building.position[secondDirection] = origin[secondDirection] + trackcenter;
			building.position.y = origin.y + height / 2;
			building.position[mainDirection] = origin[mainDirection] + direction * (trackdone + length / 2);
			return building;
		};
		var mesh;
		while (tracklength - trackdone > 45) {
			var length = Math.floor(minlength + Math.random() * 10);
			var distance = Math.pow(Math.pow(trackcenter + TILE_LENGTH / 2, 10) + Math.pow(trackdone - tracklength / 2, 10), 0.1);
			var height = Math.floor(minheight + Math.random() * Math.pow(1.083712, (TILE_LENGTH / 2 - distance) / 9) + Math.random() * 70);
			trackdone += length + 10;
			mesh = makeBuilding(length, height);
			if (height > KHALIFA.height && origin.x == 0 && origin.z == 0) {
				KHALIFA.height = height;
				KHALIFA.building = mesh.clone();
			}
			mesh.updateMatrix();
			geometries.buildings.merge(mesh.geometry, mesh.matrix);
		}
		mesh = makeBuilding(tracklength - trackdone);
		mesh.updateMatrix();
		geometries.buildings.merge(mesh.geometry, mesh.matrix);
		var track = new THREE.Mesh(geometries.buildings, materials.building);
		return track;
	};

	var initLights = function () {
		for (i = 0; i < 5000; i++) {
			var theta = Math.random() * Math.PI - Math.PI / 2;
			var phi = Math.random() * Math.PI;
			var radius = 20000 * Math.random() + 20000;
			var pos = new THREE.Vector3(radius * Math.cos(theta) * Math.cos(phi), radius * Math.sin(phi), radius * Math.cos(phi) * Math.sin(theta));
			geometries.stars.vertices.push(pos);
		}
	};

	/// Keyframing on timeline

	var initTargets = function () {
		targets.animating = [];
		targets.add = function (id, target, property, to, through) {
			targets.animating[id] = {
				target: target,
				property: property,
				to: to,
				through: through || to,
				mid: (target[property] + to) / 2,
			};
		};
		targets.update = function () {
			for (var id in targets.animating) {
				if (targets.animating.hasOwnProperty(id)) {
					var animation = targets.animating[id];
					if (Math.abs(animation.target[animation.property] - animation.to) +
						Math.abs(animation.through - animation.to) < 0.1) {
						delete targets.animating[id];
						if (!targets.animating.length) ANIMATING = false;
						continue;
					}
					animation.through += (animation.to - animation.through) / ANIMATING_FACTOR;
					var diff = (animation.through - animation.target[animation.property]) / ANIMATING_FACTOR;
					animation.target[animation.property] += diff;
				}
			}
		};
	};

	var initTimeline = function () {
		timeline.keyframes = [];
		timeline.now = 0;
		timeline.moveto = function (index) {
			audio.domElement.play();
			if (timeline.keyframes[index]) {
				if (index == 0) {
					state.freeroam = false;
					$('.controller').removeClass('active');
				} else {
					$('.controller').addClass('active');
					state.freeroam = true;
				}
				timeline.now = index;
				$('.slider .slide').eq(timeline.now).addClass('now').siblings().removeClass('now');
				var frame = timeline.keyframes[index];
				frame.position.through = frame.position.through || {};
				frame.lookAt.through = frame.lookAt.through || {};
				targets.add('cameraX', camera.position, 'x', frame.position.to.x, frame.position.through.x);
				targets.add('cameraY', camera.position, 'y', frame.position.to.y, frame.position.through.y);
				targets.add('cameraZ', camera.position, 'z', frame.position.to.z, frame.position.through.z);
				targets.add('lookAtX', camera.follow, 'x', frame.lookAt.to.x, frame.lookAt.through.x);
				targets.add('lookAtY', camera.follow, 'y', frame.lookAt.to.y, frame.lookAt.through.y);
				targets.add('lookAtZ', camera.follow, 'z', frame.lookAt.to.z, frame.lookAt.through.z);
				if (frame.aperture)
					targets.add('aperture', passes.bokehPass.uniforms.aperture, 'value', frame.aperture.to, frame.aperture.through);
				if (frame.focus)
					targets.add('focus', passes.bokehPass.uniforms.focus, 'value', frame.focus.to, frame.focus.through);
			}
		};
		timeline.next = function () {
			timeline.moveto((timeline.now + 1) % timeline.keyframes.length);
		};
		timeline.prev = function () {
			timeline.moveto((timeline.now - 1 + timeline.keyframes.length) % timeline.keyframes.length);
		};
		// Timeline for camera
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(150, 5000, 150),
			},
			lookAt: {
				to: new THREE.Vector3(-150, 50, -150),
			},
			aperture: {
				to: Math.pow(10, 5),
			},
			focus: {
				to: 5 * Math.pow(10, 3)
			}
		});
		timeline.keyframes.push({
			position: {
				to: KHALIFA.building.position.clone().add(new THREE.Vector3(200, KHALIFA.height / 2 + 20, 200)),
			},
			lookAt: {
				to: KHALIFA.building.position.clone().add(new THREE.Vector3(0, KHALIFA.height / 2, 0)),
			},
			aperture: {
				to: Math.pow(10, 6),
			},
			focus: {
				to: 400,
			}
		});
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(120, 15, 120),
			},
			lookAt: {
				to: new THREE.Vector3(-150, 70, -150),
			}
		});
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(-TILE_LENGTH * 0.75, MINHEIGHT * 5, TILE_SPACING * 2),
			},
			lookAt: {
				to: new THREE.Vector3(-TILE_LENGTH, MINHEIGHT * 4, -150),
			}
		});
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(150 - (TILE_LENGTH + TILE_SPACING), 80, 150),
			},
			lookAt: {
				to: new THREE.Vector3(-150 - (TILE_LENGTH + TILE_SPACING), 50, TILE_SPACING),
			}
		});
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(-150 - (TILE_LENGTH + TILE_SPACING), 500, -100),
			},
			lookAt: {
				to: new THREE.Vector3(-400 - (TILE_LENGTH + TILE_SPACING), 50, -400),
			}
		});
		timeline.keyframes.push({
			position: {
				to: new THREE.Vector3(-500 - 1.5 * (TILE_LENGTH + TILE_SPACING), 0, -150 - 1.5 * (TILE_LENGTH + TILE_SPACING)),
				through: new THREE.Vector3(-1500 - (3 * TILE_LENGTH + TILE_SPACING), 2000, -1500 - (TILE_LENGTH + TILE_SPACING)),
			},
			lookAt: {
				to: new THREE.Vector3(150, 700, 150),
			},
			focus: {
				to: 1.5 * TILE_LENGTH
			},
			aperture: {
				to: Math.pow(10, 8)
			}
		});
	};

	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener('keyup', function (e) {
		if(init == true) return;
		if ([40].indexOf(e.keyCode || e.which) != -1)
			timeline.next();
		if ([38].indexOf(e.keyCode || e.which) != -1)
			timeline.prev();
	}, false);

	renderer.domElement.addEventListener('mousemove', function (e) {
		if (!state.freeroam) return;
		if (ANIMATING) return;
		var xdiff, ydiff;
		if (e.pageX != undefined && e.pageY != undefined) {
			xdiff = (e.pageX - window.innerWidth / 2) / window.innerWidth;
			ydiff = (e.pageY - window.innerHeight / 2) / window.innerHeight;
		}
		var frame = timeline.keyframes[timeline.now];
		var lineOfSight = frame.lookAt.to.clone().add(frame.position.to.clone().negate());
		camera.right = lineOfSight.clone().cross(camera.up).normalize();
		var position = frame.lookAt.to.clone()
			.add(camera.right.clone().multiplyScalar(lineOfSight.length() * xdiff))
			.add(camera.up.clone().multiplyScalar(-lineOfSight.length() * ydiff));
		targets.add('lookAtX', camera.follow, 'x', position.x);
		targets.add('lookAtY', camera.follow, 'y', position.y);
		targets.add('lookAtZ', camera.follow, 'z', position.z);
	}, true);

	var toggle = function (e) {
		if ($('.immersive-wrapper .container').hasClass('out')) {
			$('.immersive-wrapper .container').removeClass('out');
		} else {
			$('.immersive-wrapper .container').addClass('out');
		}
	};
	renderer.domElement.addEventListener('click', toggle, true);
	startImmersion();

	Buildings = {
		toggle: toggle,
		next: timeline.next,
		prev: timeline.prev,
		start: function() {
			init = false;
			timeline.next();
			toggle();
			setTimeout(function() {$('#slide1 .button, #slide1 .calling').remove();},1000);
		},
		mute: function() {
			if(inputs.audio.muted) {
				inputs.audio.muted = false;
				$('.mute').html("MUTE");
			}
			else {
				inputs.audio.muted = true;
				$('.mute').html("UNMUTE");
			}
		}
	};
};
Constructor();