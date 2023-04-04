// import './style.css'

import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module";

import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";

var VanillaTilt = (function () {
    'use strict';
    
    /**
     * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
     * Original idea: https://github.com/gijsroge/tilt.js
     * MIT License.
     * Version 1.8.0
     */
    
    class VanillaTilt {
      constructor(element, settings = {}) {
        if (!(element instanceof Node)) {
          throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
        }
    
        this.width = null;
        this.height = null;
        this.clientWidth = null;
        this.clientHeight = null;
        this.left = null;
        this.top = null;
    
        // for Gyroscope sampling
        this.gammazero = null;
        this.betazero = null;
        this.lastgammazero = null;
        this.lastbetazero = null;
    
        this.transitionTimeout = null;
        this.updateCall = null;
        this.event = null;
    
        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);
    
        this.element = element;
        this.settings = this.extendSettings(settings);
    
        this.reverse = this.settings.reverse ? -1 : 1;
        this.resetToStart = VanillaTilt.isSettingTrue(this.settings["reset-to-start"]);
        this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
        this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
        this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
        this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
        this.gyroscopeSamples = this.settings.gyroscopeSamples;
    
        this.elementListener = this.getElementListener();
    
        if (this.glare) {
          this.prepareGlare();
        }
    
        if (this.fullPageListening) {
          this.updateClientSize();
        }
    
        this.addEventListeners();
        this.reset();
    
        if (this.resetToStart === false) {
          this.settings.startX = 0;
          this.settings.startY = 0;
        }
      }
    
      static isSettingTrue(setting) {
        return setting === "" || setting === true || setting === 1;
      }
    
      /**
       * Method returns element what will be listen mouse events
       * @return {Node}
       */
      getElementListener() {
        if (this.fullPageListening) {
          return window.document;
        }
    
        if (typeof this.settings["mouse-event-element"] === "string") {
          const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
    
          if (mouseEventElement) {
            return mouseEventElement;
          }
        }
    
        if (this.settings["mouse-event-element"] instanceof Node) {
          return this.settings["mouse-event-element"];
        }
    
        return this.element;
      }
    
      /**
       * Method set listen methods for this.elementListener
       * @return {Node}
       */
      addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
    
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.glare || this.fullPageListening) {
          window.addEventListener("resize", this.onWindowResizeBind);
        }
    
        if (this.gyroscope) {
          window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
      }
    
      /**
       * Method remove event listeners from current this.elementListener
       */
      removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.gyroscope) {
          window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
    
        if (this.glare || this.fullPageListening) {
          window.removeEventListener("resize", this.onWindowResizeBind);
        }
      }
    
      destroy() {
        clearTimeout(this.transitionTimeout);
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.reset();
    
        this.removeEventListeners();
        this.element.vanillaTilt = null;
        delete this.element.vanillaTilt;
    
        this.element = null;
      }
    
      onDeviceOrientation(event) {
        if (event.gamma === null || event.beta === null) {
          return;
        }
    
        this.updateElementPosition();
    
        if (this.gyroscopeSamples > 0) {
          this.lastgammazero = this.gammazero;
          this.lastbetazero = this.betazero;
    
          if (this.gammazero === null) {
            this.gammazero = event.gamma;
            this.betazero = event.beta;
          } else {
            this.gammazero = (event.gamma + this.lastgammazero) / 2;
            this.betazero = (event.beta + this.lastbetazero) / 2;
          }
    
          this.gyroscopeSamples -= 1;
        }
    
        const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
        const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
    
        const degreesPerPixelX = totalAngleX / this.width;
        const degreesPerPixelY = totalAngleY / this.height;
    
        const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
        const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);
    
        const posX = angleX / degreesPerPixelX;
        const posY = angleY / degreesPerPixelY;
    
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = {
          clientX: posX + this.left,
          clientY: posY + this.top,
        };
    
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
    
      onMouseEnter() {
        this.updateElementPosition();
        this.element.style.willChange = "transform";
        this.setTransition();
      }
    
      onMouseMove(event) {
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = event;
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
    
      onMouseLeave() {
        this.setTransition();
    
        if (this.settings.reset) {
          requestAnimationFrame(this.resetBind);
        }
      }
    
      reset() {
        this.onMouseEnter();
    
        if (this.fullPageListening) {
          this.event = {
            clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
            clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
          };
        } else {
          this.event = {
            clientX: this.left + ((this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width),
            clientY: this.top + ((this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height)
          };
        }
    
        let backupScale = this.settings.scale;
        this.settings.scale = 1;
        this.update();
        this.settings.scale = backupScale;
        this.resetGlare();
      }
    
      resetGlare() {
        if (this.glare) {
          this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "0";
        }
      }
    
      getValues() {
        let x, y;
    
        if (this.fullPageListening) {
          x = this.event.clientX / this.clientWidth;
          y = this.event.clientY / this.clientHeight;
        } else {
          x = (this.event.clientX - this.left) / this.width;
          y = (this.event.clientY - this.top) / this.height;
        }
    
        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);
    
        let tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
        let tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
        let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
    
        return {
          tiltX: tiltX,
          tiltY: tiltY,
          percentageX: x * 100,
          percentageY: y * 100,
          angle: angle
        };
      }
    
      updateElementPosition() {
        let rect = this.element.getBoundingClientRect();
    
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
      }
    
      update() {
        let values = this.getValues();
    
        this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
          "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
          "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
          "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
    
        if (this.glare) {
          this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
          this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
        }
    
        this.element.dispatchEvent(new CustomEvent("tiltChange", {
          "detail": values
        }));
    
        this.updateCall = null;
      }
    
      /**
       * Appends the glare element (if glarePrerender equals false)
       * and sets the default style
       */
      prepareGlare() {
        // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
        if (!this.glarePrerender) {
          // Create glare element
          const jsTiltGlare = document.createElement("div");
          jsTiltGlare.classList.add("js-tilt-glare");
    
          const jsTiltGlareInner = document.createElement("div");
          jsTiltGlareInner.classList.add("js-tilt-glare-inner");
    
          jsTiltGlare.appendChild(jsTiltGlareInner);
          this.element.appendChild(jsTiltGlare);
        }
    
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner");
    
        if (this.glarePrerender) {
          return;
        }
    
        Object.assign(this.glareElementWrapper.style, {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": "100%",
          "height": "100%",
          "overflow": "hidden",
          "pointer-events": "none",
          "border-radius": "inherit"
        });
    
        Object.assign(this.glareElement.style, {
          "position": "absolute",
          "top": "50%",
          "left": "50%",
          "pointer-events": "none",
          "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
          "transform": "rotate(180deg) translate(-50%, -50%)",
          "transform-origin": "0% 0%",
          "opacity": "0"
        });
    
        this.updateGlareSize();
      }
    
      updateGlareSize() {
        if (this.glare) {
          const glareSize = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
    
          Object.assign(this.glareElement.style, {
            "width": `${glareSize}px`,
            "height": `${glareSize}px`,
          });
        }
      }
    
      updateClientSize() {
        this.clientWidth = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth;
    
        this.clientHeight = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;
      }
    
      onWindowResize() {
        this.updateGlareSize();
        this.updateClientSize();
      }
    
      setTransition() {
        clearTimeout(this.transitionTimeout);
        this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
        if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
    
        this.transitionTimeout = setTimeout(() => {
          this.element.style.transition = "";
          if (this.glare) {
            this.glareElement.style.transition = "";
          }
        }, this.settings.speed);
    
      }
    
      /**
       * Method return patched settings of instance
       * @param {boolean} settings.reverse - reverse the tilt direction
       * @param {number} settings.max - max tilt rotation (degrees)
       * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
       * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
       * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
       * @param {string} settings.easing - Easing on enter/exit
       * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
       * @param {number} settings.speed - Speed of the enter/exit transition
       * @param {boolean} settings.transition - Set a transition on enter/exit
       * @param {string|null} settings.axis - What axis should be enabled. Can be "x" or "y"
       * @param {boolean} settings.glare - if it should have a "glare" effect
       * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
       * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
       * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
       * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
       * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
       * @param {boolean} settings.reset-to-start - true = On reset event (mouse leave) will return to initial start angle (if startX or startY is set)
       * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
       * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
       * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
       */
      extendSettings(settings) {
        let defaultSettings = {
          reverse: false,
          max: 15,
          startX: 0,
          startY: 0,
          perspective: 1000,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          scale: 1,
          speed: 300,
          transition: true,
          axis: null,
          glare: false,
          "max-glare": 1,
          "glare-prerender": false,
          "full-page-listening": false,
          "mouse-event-element": null,
          reset: true,
          "reset-to-start": true,
          gyroscope: true,
          gyroscopeMinAngleX: -45,
          gyroscopeMaxAngleX: 45,
          gyroscopeMinAngleY: -45,
          gyroscopeMaxAngleY: 45,
          gyroscopeSamples: 10
        };
    
        let newSettings = {};
        for (var property in defaultSettings) {
          if (property in settings) {
            newSettings[property] = settings[property];
          } else if (this.element.hasAttribute("data-tilt-" + property)) {
            let attribute = this.element.getAttribute("data-tilt-" + property);
            try {
              newSettings[property] = JSON.parse(attribute);
            } catch (e) {
              newSettings[property] = attribute;
            }
    
          } else {
            newSettings[property] = defaultSettings[property];
          }
        }
    
        return newSettings;
      }
    
      static init(elements, settings) {
        if (elements instanceof Node) {
          elements = [elements];
        }
    
        if (elements instanceof NodeList) {
          elements = [].slice.call(elements);
        }
    
        if (!(elements instanceof Array)) {
          return;
        }
    
        elements.forEach((element) => {
          if (!("vanillaTilt" in element)) {
            element.vanillaTilt = new VanillaTilt(element, settings);
          }
        });
      }
    }
    
    if (typeof document !== "undefined") {
      /* expose the class to window */
      window.VanillaTilt = VanillaTilt;
    
      /**
       * Auto load
       */
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
    
    return VanillaTilt;
    
    }());
document.body.style.overflow = "hidden";
let ls = 0; // a = 0;
let tr =
	navigator.userAgent.match(/Android/i) ||
	navigator.userAgent.match(/webOS/i) ||
	navigator.userAgent.match(/iPhone/i) ||
	navigator.userAgent.match(/iPad/i) ||
	navigator.userAgent.match(/iPod/i) ||
	navigator.userAgent.match(/BlackBerry/i) ||
	navigator.userAgent.match(/Windows Phone/i);
let torus;
let material;
let geometry;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector(".bg"),
	alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);
renderer.render(scene, camera);
if (!tr) {
	geometry =
		// new THREE.TorusGeometry( 15, 5, 16, 100 );
		// new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
		new THREE.SphereGeometry(15, 100, 100);
	// new THREE.DodecahedronGeometry(15,5)
	material = new THREE.MeshStandardMaterial({
		// flatShading:true,
		// depthTest: false,
		// depthWrite: false,
		color: 0x049ef4,
		// wireframe:true,
		roughness: 0.4,
	});
	torus = new THREE.Mesh(geometry, material);

	scene.add(torus);
} else {
	let geometry = new THREE.TorusGeometry(10, 4, 16, 100);
	// new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
	// new THREE.SphereGeometry(15, 64, 64);
	// new THREE.DodecahedronGeometry(15,5)
	material = new THREE.MeshToonMaterial({
		flatShading: true,
		// depthTest: false,
		// depthWrite: false,
		color: 0x049ef4,
		// wireframe:true,
		// roughness: 0.4,
	});
	torus = new THREE.Mesh(geometry, material);

	scene.add(torus);
}
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(40, 30, 90);

		let i = document.querySelector(".hh3").innerText;
		let ii = setInterval(() => {

			document.querySelector(".hh3").innerHTML = i
				.split("")
				.map((le, ind) => {
			document.querySelector(".hh3").style.opacity = 1
					console.log(le);
					if(le == " "){
						return ""
					}
					if (ind < ee) {
						// console.log(ee);
						return i[ind];
					}
					return ll[Math.floor(Math.random() * ll.length)];
				})
				.join("");
			if (ee >= i.length + 1) {
				// element.style.color = "white"
				document.body.style.overflowY = "visible";
				document.body.style.overflowX = "hidden";
				clearInterval(ii);
				ee = 0;
			}
			ee += 1 / 40;
			if (ee >= 1) {
				return "<br> ";
			}
			// console.log(element)
		}, 30);
	
// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

const controls = new OrbitControls(camera, document.querySelector(".bg"));
// const controls2 = new FlyControls(camera, document.querySelector('.bg'))

// controls2.dragToLook = true;
// controls2.autoForward = true;
// controls.controls = false;
// controls.
// if()

// console.log(navigator.storage.getDirectory("myweb"));
if (tr) {
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5;

	controls.enabled = false;
} else {
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.enableZoom = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 3;
	controls.keyPanSpeed = "20px";
}
scene.add(lightHelper, pointLight);

let mon = new THREE.TextureLoader().load(
	"https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/moon.jpg"
);

let geometry1 =
	// new THREE.TorusGeometry( 15, 3, 16, 100 );
	// new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
	new THREE.SphereGeometry(5, 100, 100);
// new THREE.DodecahedronGeometry(15,5)
const material1 = new THREE.MeshToonMaterial({
	map: mon,
	flatShading: true,
	// depthTest: false,
	// depthWrite: false,
	// color:0x049ef4 ,
	// wireframe:true,
	// roughness: 0.4
});
let moon = new THREE.Mesh(geometry1, material1);
scene.add(moon);
moon.position.x = pointLight.position.x;
moon.position.y = pointLight.position.y;
moon.position.z = pointLight.position.z;

let geometry2 =
	// new THREE.TorusGeometry( 15, 3, 16, 100 );
	// new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
	new THREE.SphereGeometry(5, 100, 100);
// new THREE.DodecahedronGeometry(15,5)
const material2 = new THREE.MeshStandardMaterial({
	// map: mon,
	flatShading: true,
	// depthTest: false,
	// depthWrite: false,
	// color:0x049ef4 ,
	// wireframe:true,
	// roughness: 0.4
});
let mouse = new THREE.Mesh(geometry2, material2);
// scene.add(mouse);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.3, 24, 24);
	const material = new THREE.MeshStandardMaterial({
		// flatShading:true,
		// depthTest: false,
		// depthWrite: false,
		// color:0x049ef4 ,
		// wireframe:true,
		roughness: 0.4,
		color: 0xffffff,
	});
	const star = new THREE.Mesh(geometry, material);

	const z = THREE.MathUtils.randFloatSpread(100);
	let x = THREE.MathUtils.randFloatSpread(window.innerWidth / 6.5);
	let y = THREE.MathUtils.randFloatSpread(window.innerHeight / 4.5);
	star.position.set(x, y, z);
	scene.add(star);
}
let b = 0;


	let h = 0; 

Array(500).fill().forEach(addStar);
let k = 0;
function animate() {
	renderer.render(scene, camera);
	
	if (tr) {
		// document.body.style.overflowX = 'hidden';
		torus.rotation.x += 0.01;
		// torus.rotation.z += 5;
		torus.rotation.y += 0.01;
		
	}
	// a = a > 10 ? 0 : c % 10 == 0 ? a+1 : a +0.01;
	// scene.remove(torus);
	controls.update();
	
	
	requestAnimationFrame(animate);
	
}
let c = 5000
animate();
async function scrollToTop() {
		const c = document.body.scrollY || document.documentElement.scrollTop || document.body.scrollTop - 1;
		
		// document.querySelector('body').scrollIntoView(c)
		// $("body").scrollTop(c)
		// .animate({ scrollTop: 5000 }, 500);
		if (c > 0) {
			console.log(c);
			h += 1
		window.focus();
		await window.scrollBy({
			top: -window.innerHeight 
			+ (-100 + window.innerHeight)
			,
			// -window.innerHeight + 147 ,
			behavior: "smooth",
		  });
		 console.trace(-window.innerHeight + (-500 + window.innerHeight))
		// setInterval(()=>{
			// document.querySelector('body').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
			// ,1)
		
		// // c = c - h / 80
		// // 
		
		
		// console.log(c - h)
		await sleep(50 + h)
		requestAnimationFrame(scrollToTop);
		}
		
		
	  };
// let tl = gsap.timeline
// import '../github/style.css'
window.onmousemove = (e) => {
	let x = e.clientX;
	let y = e.clientY;
	document.querySelector(".cur").style.opacity = `1`;
	document.querySelector(".cur").style.top = `${y}px`;
	document.querySelector(".cur").style.left = `${x}px`;
	document.querySelector(".cur").style.opacity = `1`;

};
let ee = 0;
let ll =
	// "1234567890abcdef"
	"ABDEFGHIJKLMNOPQRSTUVWXYUZabcdefghijklmnopqrstuvwxyz1234567890"
	// $₪₭₳₮₱₣₦₩€";
window.onresize = () => {
	
	if(!tr){
	location.reload();}
};
if(tr){
	document.querySelector('.mid').style.width = "100vw"
	document.querySelector('.pc').style.display = "none";
}
else{
	document.querySelector('.mob').style.display = "none";
}
// t.fromTo(controls.autoRotateSpeed, {a} ,{x:5})
AOS.init();
// let hash = md5('H')

gsap.registerPlugin(ScrollTrigger,SmoothScroll);
SmoothScroll("body");
// let sec = gsap.utils.toArray("h1")
// document.querySelector('.ele').addEventListener('click',() => {
// 	gsap.to(sec,{
// 			SmoothScroll:{
// 			smooth: 5,
// 			effects: true,
// 			smoothTouch: 0.1
// 			},
// 		})
// })
// ScrollTrigger.normalizeScroll(true)
// document.querySelector(".cen h1").innerText.split("").forEach((el) => {
// 	let t = document.createElement('span') 
// 	t.innerHTML = el
// 	document.querySelector(".cen h1").appendChild(t)
// })
// console.log(document.querySelector(".cen h1").innerHTML);
// document.querySelector(".cen h1").innerText =""
gsap.to(".cen",{
	SmoothScroll:{
					smooth: 5,
					effects: true,
					smoothTouch: 0.1
					},
	// SmoothScroll:{
	// smooth: 0.01,
	// effects: true,
	// smoothTouch: 0.1
	// },
	// ScrollTrigger: ".cen h1" ,
	scrollTrigger: {
		trigger: ".cen",
		start: "top bottom", 
		// pin: true,
		// snap: 1 ,
		scrub: 3,
		toggleAction: "restart pause reverse restart",
		// markers: true,
		end: () => "+=" + (document.querySelector(".cen").offsetWidth - 50)
	},
	opacity: 1,
	// rotation: 180,
	y: 150,
	left: 0,
	duration: 1,
})
// gsap.from(".cen h1 span",{
// 	scrollTrigger: {
// 		trigger: ".cen",
// 		// scrub: 1,
// 		markers: true,
// 	},
// 	y: 200,
// 	rotation: 180,
// 	stagger: 1,
// 	duration: 7,
// })
torus.scale.x = 0
torus.scale.z = 0
torus.scale.y = 0

// 
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
window.addEventListener("scroll", function () {
	let s = this.scrollY;
	// console.log(s);
	if (s >= 3833) {
		// console.log("hh");
	}
	// console.log(document.querySelectorAll("*"));
	// document.body.style.overflowX = 'hidden';
	let st = window.pageYOffset || document.documentElement.scrollTop;
	if (st > ls && !(st == -1)) {
		// n.style.top = "-60px"
		gsap.to("nav", {
			// duration: 0.4,
			y: -66,
			// ease: Elastic.easeOut.config(1, 0.23)
		});
	} else {
		// n.style.top = "0px"
		gsap.to("nav", {
			duration: 0.4,
			y: 0,
			// ease: Elastic.easeOut.config(1, 0.233)
		});
	}
	ls = st;

	s = Math.floor(s);
	document.querySelector(
		".main"
	).style.transform = `perspective(200px) translateZ(${-s}px) translateY(${
		s / 1
	}px ) translateX(${(s / (window.innerWidth / 2)) * 20}px)`;
	// document.querySelector(".logos").style.transform = `perspective(200px) translateZ(${0}px) translateY(${s / 4 - 300}px)`;

	// document.querySelector(".logos").style.transform = `translateY(${s / 60}px)`;
	// c = s / 200;
	// a = a > 10 ? 0 : c % 10 == 0 ? a+1 : a +0.01;
	// scene.remove(torus);
	controls.update();
	// if (c < 4) {
	// 	geometry = new THREE.SphereGeometry(15, 100, 100);
	// } else geometry = new THREE.SphereGeometry(15, 100, 100);
	// // geometry = new THREE.TorusKnotGeometry( 12,1,100,16,c + 1, c / 20 + 1 );
	// torus = new THREE.Mesh(geometry, material);
	// scene.add(torus);
});
// }
// if(window.innerWidth > 800){
let l = document.getElementById("#loder");
ee = 0;
document.querySelector('.ele').onclick = () => {
		scrollToTop();
		console.log("scrollToTop");
	  }
	  
window.addEventListener("load", async () => {
	window.scrollTo(0, 0);
	// await sleep(1500)
	gsap.to(".loder", {
		duration: 0.5,
	
		clipPath: "circle(0% at 100% 100%)",
		// ease: Power4.easeOut,
	});
	  
	document.querySelectorAll("h2").forEach(async (element) => {
		// console.log(element)

		// element.target.style.color = "green"
		let i = element.innerText;
		let ii = setInterval(() => {
			element.innerHTML = i
				.split("")
				.map((le, ind) => {
					console.log(le);
					if(le == " "){
						return ""
					}
					if (ind < ee) {
						// console.log(ee);
						return i[ind];
					}
					// if (ind > 7) {
					// 	if (ind == 7) {
					// 		return " ";
					// 	} else 
					// }
					return ll[Math.floor(Math.random() * ll.length)];
				})
				.join("");
			if (ee >= i.length + 1) {
				// element.style.color = "white"
				document.body.style.overflowY = "visible";
				document.body.style.overflowX = "hidden";
				clearInterval(ii);
				ee = 0;
			}
			ee += 1 / 4;
			if (ee >= 1) {
				return "<br> ";
			}
			// console.log(element)
		}, 30);
	});
	await sleep(2700);
	let type = new Typed(".main h1", {
		strings: ["Bros", "sis", "coder"],
		// ["bros","sis","man","dog","chad","human","wolf"],
		typeSpeed: 50,
		backSpeed: 50,
		smartBackspace: true,
		loop: true,
		// startDelay: 2,
		// shuffle: true,
		cursorChar: "",
	});
	gsap.to(
			torus.scale,
			{
				duration: 1,
				z: 1,
				x: 1,
				y: 1,
				// ease: CustomEase.create("custom", "M0,0 C0,0 0.115,-0.001 0.185,0.006 0.24,0.012 0.277,0.018 0.33,0.035 0.378,0.051 0.411,0.067 0.455,0.094 0.503,0.124 0.427,0.061 0.468,0.102 0.513,0.147 0.578,0.304 0.616,0.358 0.662,0.423 0.693,0.561 0.732,0.634 0.776,0.719 0.802,0.83 0.84,0.92 0.882,1.024 1,0.872 1,0.872 ")
			}
		);
	// await sleep(1100);
	// document.body.style.overflow = 'scroll';
	// let t = gsap.timeline({ defaults: { duration: 1 } });
	
	let n = document.querySelector("nav");
});

// document.querySelector('.side button').addEventListener("click", () => {
// 	if(	document.querySelector('.side button .bar').style.width == "0px"){
// 		gsap.to(".side button .bar",{duration: 0.01,width: "100px",opacity: 1, ease: "power4.easeInOut"});
// 	// document.querySelector('.side button .bar').style.width = "80px";
// 	// document.querySelector('.side button .bar').style.opacity = "1";
// 	}
// 	else {gsap.to(".side button .bar",{duration: 0.01,width: "0px",opacity: 0});}
// });

let o = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add("show");
		} else {
			entry.target.classList.remove("show");
		}
	});
});
// let ob = new IntersectionObserver((entries) => {
// 	entries.forEach((entry) => {
// 		if (entry.isIntersecting) {
// 			entry.target.style.display = "flex";
// 			console.log("flex", entry.target.style);
// 		} else {
// 			entry.target.style.display = "none";
// 			console.log("none", entry.target.style);
// 		}
// 	});
// });
document.querySelectorAll(".video").forEach((el) => {
	o.observe(el);
});

// document.querySelectorAll("*").forEach((e) => {
// 	ob.observe(e);
// });
// window.onmousemove = (e) => {
//   // console.log(e.target);
//   let x = e.clientX
//   let y = e.clientY
//   document.querySelector('.cur').style.top = `${y}px`
//   document.querySelector('.cur').style.left = `${x}px`
// }
// document.querySelector('.card-con').onmouseover = (e) => {

//   let x = e.clientX
//   let y = e.clientY
//   console.log(x,y);
//   // document.querySelector('.card').style.top = `${y}px`
//   document.querySelector('.card').style.transform = `perspective(700px) rotateY(${x / -720 * 100}deg) rotateX(${y / -720 * 100}deg)`

// }
// //  || document.querySelector('.card').style.transform == `perspective(700px) rotateY(${y}deg) rotateX(10deg)`;
// document.querySelector('.card').onmouseout = (e) => {

//   let x = e.clientX
//   let y = e.clientY
//   console.log(x,y);
//   // document.querySelector('.card').style.top = `${y}px`
//   document.querySelector('.card-con').style.transform = `perspective(700px) rotateY(0deg) rotateX(0deg)`
// }
