/*
 
 * 作者：1617567859@qq.com
	时间：2018-06-29
	描述：heart 
 * */
var container;

	var camera, scene, renderer;

	var group, text, plane;

	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseX = 0;
	var mouseXOnMouseDown = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var heartShape, particleCloud, sparksEmitter, emitterPos;
	var _rotation = 0;
	var timeOnShapePath = 0;
	function browserRedirect() {  
	    var sUserAgent = navigator.userAgent.toLowerCase();  
	    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
	    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
	    var bIsMidp = sUserAgent.match(/midp/i) == "midp";  
	    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  
	    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";  
	    var bIsAndroid = sUserAgent.match(/android/i) == "android";  
	    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";  
	    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";  
	    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){  
	       
	    } else {  
	        alert("因手机客户端无法承载资源，请使用电脑客户端浏览器加载，否则可能影响效果！");  
	    }  
	}  
  
	init();
	animate();

	function init() {
		browserRedirect();
		
		container = document.createElement('div');
		document.body.appendChild(container);


		//相机
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.set(0, 150, 800);

		//场景
		scene = new THREE.Scene();

		group = new THREE.Group();
		scene.add(group);

		// Get text from hash

		var string = "xuemei";
		var hash = document.location.hash.substr(1);

		if (hash.length !== 0) {

			string = hash;

		}

		var text3d = new THREE.TextGeometry(string, {
			size: 80,
			height: 20,
			curveSegments: 2,
			font: "helvetiker"

		});

		text3d.computeBoundingBox();
		var centerOffset = -0.5 * (text3d.boundingBox.max.x - text3d.boundingBox.min.x);

		var textMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, overdraw: 0.5});

		text = new THREE.Mesh(text3d, textMaterial);

		

		text.position.x = centerOffset;
		text.position.y = 100;
		text.position.z = 0;

		text.rotation.x = 0;
		text.rotation.y = Math.PI * 2;

		group.add(text);


		particleCloud = new THREE.Object3D(); 
		particleCloud.y = 800;
		group.add(particleCloud);

		var x = 0, y = 0;

		heartShape = new THREE.Shape();

		heartShape.moveTo(x + 25, y + 25);
		heartShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
		heartShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
		heartShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
		heartShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
		heartShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
		heartShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

		var hue = 0;

		var hearts = function(context) {

			context.globalAlpha = 0.5;
			var x = 0, y = 0;
			context.scale(0.05, -0.05); 
			context.beginPath();
			
			context.bezierCurveTo(x + 2.5, y + 2.5, x + 2.0, y, x, y);
			context.bezierCurveTo(x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5);
			context.bezierCurveTo(x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5);
			context.bezierCurveTo(x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5);
			context.bezierCurveTo(x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y);
			context.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
			context.fill();
			context.lineWidth = 0.5; 
			context.stroke();

		}

		var setTargetParticle = function() {

			var material = new THREE.SpriteCanvasMaterial({
				program: hearts
			});

			material.color.setHSL(hue, 1, 0.75);
			hue += 0.001;
			if (hue > 1)
				hue -= 1;

			particle = new THREE.Sprite(material);

			particle.scale.x = particle.scale.y = Math.random() * 40 + 40;
			particleCloud.add(particle);

			return particle;

		};

		var onParticleCreated = function(p) {

			p.target.position.copy(p.position);

		};

		var onParticleDead = function(particle) {

			particle.target.visible = false;
			particleCloud.remove(particle.target);

		};

		sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(160));

		emitterpos = new THREE.Vector3();

		sparksEmitter.addInitializer(new SPARKS.Position(new SPARKS.PointZone(emitterpos)));
		sparksEmitter.addInitializer(new SPARKS.Lifetime(0, 2));
		sparksEmitter.addInitializer(new SPARKS.Target(null, setTargetParticle));

		sparksEmitter.addInitializer(new SPARKS.Velocity(new SPARKS.PointZone(new THREE.Vector3(0, -50, 10))));


		sparksEmitter.addAction(new SPARKS.Age());

		sparksEmitter.addAction(new SPARKS.Move());
		sparksEmitter.addAction(new SPARKS.RandomDrift(50, 50, 2000));

		sparksEmitter.addCallback("created", onParticleCreated);
		sparksEmitter.addCallback("dead", onParticleDead);
		sparksEmitter.addCallback("updated", function(particle) {

			particle.target.position.copy(particle.position);

		});

		sparksEmitter.start();

		

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xf0f0f0);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		document.addEventListener('mousedown', onDocumentMouseDown, false);
		document.addEventListener('touchstart', onDocumentTouchStart, false);
		document.addEventListener('touchmove', onDocumentTouchMove, false);

		//

		window.addEventListener('resize', onWindowResize, false);

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	//

	document.addEventListener('mousemove', onDocumentMouseMove, false);

	function onDocumentMouseDown(event) {

		event.preventDefault();

		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

		if (sparksEmitter.isRunning()) {

			sparksEmitter.stop();

		} else {

			sparksEmitter.start();

		}

	}

	function onDocumentMouseMove(event) {

		mouseX = event.clientX - windowHalfX;

		targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

	}

	function onDocumentTouchStart(event) {

		if (event.touches.length == 1) {

			event.preventDefault();

			mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
			targetRotationOnMouseDown = targetRotation;

		}

	}

	function onDocumentTouchMove(event) {

		if (event.touches.length == 1) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

		}

	}

	//

	function animate() {//更新场景

		requestAnimationFrame(animate);

		render();

	}

	function render() {

		timeOnShapePath += 0.0337;

		if (timeOnShapePath > 1)
			timeOnShapePath -= 1;

		
		var pointOnShape = heartShape.getPointAt(timeOnShapePath);

		emitterpos.x = pointOnShape.x * 5 - 100;
		emitterpos.y = -pointOnShape.y * 5 + 400;

		group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
		renderer.render(scene, camera);
	}