


import("aos").then(aos => aos.init())

import('aos/dist/aos.css')



import Typed from 'typed.js';

import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from '@studio-freight/lenis'
import gsap from "gsap";

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.registerPlugin(ScrollTrigger);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
// -- vars --


let torus;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function hackerAnimation(el, onend) {
  let ll = "ABDEFGHIJKLMNOPQRSTUVWXYUZ1234567890"
  let ee = 0;
  document.querySelectorAll(el).forEach(async (element) => {
    let i = "HASAN";
    let ii = setInterval(() => {
      element.innerHTML = i
        .split("")
        .map((le, ind) => {
          if (le == " ") {
            return ""
          }
          if (ind < ee) {
            return i[ind];
          }
          return ll[Math.floor(Math.random() * ll.length)];
        })
        .join("");
      if (ee >= i.length + 1) {
        onend()
        clearInterval(ii);
        ee = 0;
      }
      ee += 1 / 12;
     
    }, 30);
  })
}
async function anime() {
  gsap.to(".project-con", {
    x: -(window.innerWidth * 1.5),
    duration: 3,
    scrollTrigger: {
      trigger: ".project-con",
      start: "top+=30 top",
      // endTrigger: ".end",
      end: "bottom+=30 top",
      // markers: true,
      pin: true,
      scrub: 1,
    }
  })

}
async function loder() {
  await sleep(1000);

  document.querySelector(".hh3").style.opacity = 1
  hackerAnimation(".hh3", () => {

    gsap.to(".loder", {
      duration: 0.5,

      clipPath: "circle(0% at 100% 100%)",
      // ease: Power4.easeOut,
      onComplete: async () => {
        await sleep(1000);
        anime()
      }
    });
  })
}




// window.onmousemove = (e) => {
//   let x = e.clientX;
//   let y = e.clientY - 4;
//   document.querySelector(".cur").style.opacity = `1`;
//   document.querySelector(".cur").style.top = `${y}px`;
//   document.querySelector(".cur").style.left = `${x}px`;
//   document.querySelector(".cur").style.opacity = `1`;
// };

window.onload = function () {
  document.querySelector('#last').onclick = () => {
    lenis.scrollTo('.front', { duration: 8, lock: true, easing: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2 })
  }
  new Typed(".front h1", {
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
  loder()
}

// ---------------------------------

// import "./style.css"

// import gsap from "gsap";

// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// import Typed from 'typed.js';

// import AOS from "aos"

// import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module";

// import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";


// let ls = 0; // a = 0;
// let tr =
//   navigator.userAgent.match(/Android/i) ||
//   navigator.userAgent.match(/webOS/i) ||
//   navigator.userAgent.match(/iPhone/i) ||
//   navigator.userAgent.match(/iPad/i) ||
//   navigator.userAgent.match(/iPod/i) ||
//   navigator.userAgent.match(/BlackBerry/i) ||
//   navigator.userAgent.match(/Windows Phone/i);

// let torus;
// let material;
// let geometry;
// const scene = new THREE.Scene();
// async function threed() {

//   const camera = new THREE.PerspectiveCamera(
//     45,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     10000
//   );

//   const renderer = new THREE.WebGLRenderer({
//     canvas: document.querySelector(".bg"),
//     alpha: true,
//   });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.position.setZ(100);
//   renderer.render(scene, camera);
//   if (!tr) {
//     geometry =
//       // new THREE.TorusGeometry( 15, 5, 16, 100 );
//       // new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
//       new THREE.SphereGeometry(15, 100, 100);
//     // new THREE.DodecahedronGeometry(15,5)
//     material = new THREE.MeshStandardMaterial({
//       // flatShading:true,
//       // depthTest: false,
//       // depthWrite: false,
//       color: 0x049ef4,
//       // wireframe:true,
//       roughness: 0.4,
//     });
//     torus = new THREE.Mesh(geometry, material);

//     scene.add(torus);
//   } else {
//     let geometry = new THREE.TorusGeometry(10, 4, 16, 100);
//     // new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
//     // new THREE.SphereGeometry(15, 64, 64);
//     // new THREE.DodecahedronGeometry(15,5)
//     material = new THREE.MeshToonMaterial({
//       flatShading: true,
//       // depthTest: false,
//       // depthWrite: false,
//       color: 0x049ef4,
//       // wireframe:true,
//       // roughness: 0.4,
//     });
//     torus = new THREE.Mesh(geometry, material);

//     scene.add(torus);
//   }
//   const pointLight = new THREE.PointLight(0xffffff, 0.8);
//   pointLight.position.set(40, 30, 90);


//   // const ambientLight = new THREE.AmbientLight(0xffffff);
//   // scene.add(ambientLight);
//   const lightHelper = new THREE.PointLightHelper(pointLight);
//   // const gridHelper = new THREE.GridHelper(200, 50);

//   const controls = new OrbitControls(camera, document.querySelector(".bg"));
//   // const controls2 = new FlyControls(camera, document.querySelector('.bg'))

//   // controls2.dragToLook = true;
//   // controls2.autoForward = true;
//   // controls.controls = false;
//   // controls.
//   // if()

//   // console.log(navigator.storage.getDirectory("myweb"));
//   if (tr) {
//     controls.autoRotate = true;
//     controls.autoRotateSpeed = 0.5;

//     controls.enabled = false;
//   } else {
//     controls.enableDamping = true;
//     controls.enablePan = false;
//     controls.enableZoom = false;
//     controls.autoRotate = true;
//     controls.autoRotateSpeed = 3;
//     controls.keyPanSpeed = "20px";
//   }
//   scene.add(lightHelper, pointLight);

//   let mon = new THREE.TextureLoader().load(
//     "https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/moon.jpg"
//   );

//   let geometry1 =
//     // new THREE.TorusGeometry( 15, 3, 16, 100 );
//     // new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
//     new THREE.SphereGeometry(5, 100, 100);
//   // new THREE.DodecahedronGeometry(15,5)
//   const material1 = new THREE.MeshToonMaterial({
//     map: mon,
//     flatShading: true,
//     // depthTest: false,
//     // depthWrite: false,
//     // color:0x049ef4 ,
//     // wireframe:true,
//     // roughness: 0.4
//   });
//   let moon = new THREE.Mesh(geometry1, material1);
//   scene.add(moon);
//   moon.position.x = pointLight.position.x;
//   moon.position.y = pointLight.position.y;
//   moon.position.z = pointLight.position.z;

//   let geometry2 =
//     // new THREE.TorusGeometry( 15, 3, 16, 100 );
//     // new THREE.TorusKnotGeometry( 15,3,100,16,1,1 );
//     new THREE.SphereGeometry(5, 100, 100);
//   // new THREE.DodecahedronGeometry(15,5)
//   const material2 = new THREE.MeshStandardMaterial({
//     // map: mon,
//     flatShading: true,
//     // depthTest: false,
//     // depthWrite: false,
//     // color:0x049ef4 ,
//     // wireframe:true,
//     // roughness: 0.4
//   });
//   let mouse = new THREE.Mesh(geometry2, material2);
//   // scene.add(mouse);

//   function addStar() {
//     const geometry = new THREE.SphereGeometry(0.3, 24, 24);
//     const material = new THREE.MeshStandardMaterial({
//       // flatShading:true,
//       // depthTest: false,
//       // depthWrite: false,
//       // color:0x049ef4 ,
//       // wireframe:true,
//       roughness: 0.4,
//       color: 0xffffff,
//     });
//     const star = new THREE.Mesh(geometry, material);

//     const z = THREE.MathUtils.randFloatSpread(100);
//     let x = THREE.MathUtils.randFloatSpread(window.innerWidth / 6.5);
//     let y = THREE.MathUtils.randFloatSpread(window.innerHeight / 4.5);
//     star.position.set(x, y, z);
//     scene.add(star);
//   }
//   let b = 0;


//   let h = 0;

//   Array(500).fill().forEach(addStar);
//   let k = 0;
//   function animate() {
//     renderer.render(scene, camera);

//     if (tr) {
//       // document.body.style.overflowX = 'hidden';
//       torus.rotation.x += 0.01;
//       // torus.rotation.z += 5;
//       torus.rotation.y += 0.01;

//     }
//     // a = a > 10 ? 0 : c % 10 == 0 ? a+1 : a +0.01;
//     // scene.remove(torus);
//     controls.update();


//     requestAnimationFrame(animate);

//   }
//   animate();
//   torus.scale.x = 0
//   torus.scale.z = 0
//   torus.scale.y = 0
// }
// let i = document.querySelector(".hh3").innerText;
// let ii = setInterval(() => {

//   document.querySelector(".hh3").innerHTML = i
//     .split("")
//     .map((le, ind) => {
//       document.querySelector(".hh3").style.opacity = 1
//       if (le == " ") {
//         return ""
//       }
//       if (ind < ee) {
//         // console.log(ee);
//         return i[ind];
//       }
//       return ll[Math.floor(Math.random() * ll.length)];
//     })
//     .join("");
//   if (ee >= i.length + 1) {
//     // element.style.color = "white"
//     clearInterval(ii);
//     ee = 0;
//   }
//   ee += 1 / 40;
//   if (ee >= 1) {
//     return "<br> ";
//   }
//   // console.log(element)
// }, 30);
// let c = 5000
// async function scrollToTop() {
//   const c = document.body.scrollY || document.documentElement.scrollTop || document.body.scrollTop - 1;

//   // document.querySelector('body').scrollIntoView(c)
//   // $("body").scrollTop(c)
//   // .animate({ scrollTop: 5000 }, 500);
//   if (c > 0) {
//     console.log(c);
//     h += 1
//     window.focus();
//     await window.scrollBy({
//       top: -window.innerHeight
//         + (-100 + window.innerHeight)
//       ,
//       // -window.innerHeight + 147 ,
//       behavior: "smooth",
//     });
//     console.trace(-window.innerHeight + (-500 + window.innerHeight))
//     await sleep(50 + h)
//     requestAnimationFrame(scrollToTop);
//   }
// };
// // let tl = gsap.timeline
// // import '../github/style.css'
// window.onmousemove = (e) => {
//   let x = e.clientX;
//   let y = e.clientY;
//   document.querySelector(".cur").style.opacity = `1`;
//   document.querySelector(".cur").style.top = `${y}px`;
//   document.querySelector(".cur").style.left = `${x}px`;
//   document.querySelector(".cur").style.opacity = `1`;

// };
// let ee = 0;

// // $₪₭₳₮₱₣₦₩€";
// window.onresize = () => {

//   if (!tr) {
//     location.reload();
//   }
// };

// // t.fromTo(controls.autoRotateSpeed, {a} ,{x:5})
// AOS.init();
// // let hash = md5('H')

// gsap.registerPlugin(ScrollTrigger);
// // let sec = gsap.utils.toArray("h1")
// // document.querySelector('.ele').addEventListener('click',() => {
// // 	gsap.to(sec,{
// // 			SmoothScroll:{
// // 			smooth: 5,
// // 			effects: true,
// // 			smoothTouch: 0.1
// // 			},
// // 		})
// // })
// // ScrollTrigger.normalizeScroll(true)
// // document.querySelector(".cen h1").innerText.split("").forEach((el) => {
// // 	let t = document.createElement('span') 
// // 	t.innerHTML = el
// // 	document.querySelector(".cen h1").appendChild(t)
// // })
// // console.log(document.querySelector(".cen h1").innerHTML);
// // document.querySelector(".cen h1").innerText =""
// gsap.to(".cen", {
//   scrollTrigger: {
//     trigger: ".cen",
//     start: "top bottom",
//     // pin: true,
//     // snap: 1 ,
//     scrub: 3,
//     toggleAction: "restart pause reverse restart",
//     // markers: true,
//     end: () => "+=" + (document.querySelector(".cen").offsetWidth - 50)
//   },
//   opacity: 2,
//   // rotation: 180,
//   y: 150,
//   left: 0,
//   duration: 1,
// })
// // gsap.from(".cen h1 span",{
// // 	scrollTrigger: {
// // 		trigger: ".cen",
// // 		// scrub: 1,
// // 		markers: true,
// // 	},
// // 	y: 200,
// // 	rotation: 180,
// // 	stagger: 1,
// // 	duration: 7,
// // })


// // 
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
// window.addEventListener("scroll", function () {
//   let s = this.scrollY;
//   // console.log(s);
//   if (s >= 3833) {
//     // console.log("hh");
//   }
//   // console.log(document.querySelectorAll("*"));
//   // document.body.style.overflowX = 'hidden';
//   let st = window.pageYOffset || document.documentElement.scrollTop;
//   if (st > ls && !(st == -1)) {
//     // n.style.top = "-60px"
//     gsap.to("nav", {
//       // duration: 0.4,
//       y: -66,
//       // ease: Elastic.easeOut.config(1, 0.23)
//     });
//   } else {
//     // n.style.top = "0px"
//     gsap.to("nav", {
//       duration: 0.4,
//       y: 0,
//       // ease: Elastic.easeOut.config(1, 0.233)
//     });
//   }
//   ls = st;

//   s = Math.floor(s);
//   document.querySelector(
//     ".main"
//   ).style.transform = `perspective(200px) translateZ(${-s}px) translateY(${s / 1
//   }px ) translateX(${(s / (window.innerWidth / 2)) * 20}px)`;
//   // document.querySelector(".logos").style.transform = `perspective(200px) translateZ(${0}px) translateY(${s / 4 - 300}px)`;

//   // document.querySelector(".logos").style.transform = `translateY(${s / 60}px)`;
//   // c = s / 200;
//   // a = a > 10 ? 0 : c % 10 == 0 ? a+1 : a +0.01;
//   // scene.remove(torus);
//   // if (c < 4) {
//   // 	geometry = new THREE.SphereGeometry(15, 100, 100);
//   // } else geometry = new THREE.SphereGeometry(15, 100, 100);
//   // // geometry = new THREE.TorusKnotGeometry( 12,1,100,16,c + 1, c / 20 + 1 );
//   // torus = new THREE.Mesh(geometry, material);
//   // scene.add(torus);
// });
// // }
// // if(window.innerWidth > 800){
// let l = document.getElementById("#loder");
// ee = 0;
// document.querySelector('.ele').onclick = () => {
//   scrollToTop();
//   //console.log("scrollToTop");
// }

// document.querySelectorAll("h2").forEach(async (element) => {
//   // console.log(element)

//   // element.target.style.color = "green"
//   let i = element.innerText;
//   let ii = setInterval(() => {
//     element.innerHTML = i
//       .split("")
//       .map((le, ind) => {
//         //console.log(le);
//         if (le == " ") {
//           return ""
//         }
//         if (ind < ee) {
//           // console.log(ee);
//           return i[ind];
//         }
//         // if (ind > 7) {
//         // 	if (ind == 7) {
//         // 		return " ";
//         // 	} else 
//         // }
//         return ll[Math.floor(Math.random() * ll.length)];
//       })
//       .join("");
//     if (ee >= i.length + 1) {
//       // element.style.color = "white"
//       // document.body.style.overflowY = "visible";
//       // document.body.style.overflowX = "hidden";
//       clearInterval(ii);
//       ee = 0;
//     }
//     ee += 1 / 4;
//     if (ee >= 1) {
//       return "<br> ";
//     }
//     // console.log(element)
//   }, 30);
// });
// window.addEventListener("load", async () => {
//   threed()

//   window.scrollTo(0, 0);
//   // await sleep(1500)
//   gsap.to(".loder", {
//     duration: 0.5,

//     clipPath: "circle(0% at 100% 100%)",
//     // ease: Power4.easeOut,
//   });

//   await sleep(2700);
//   let type = new Typed(".main h1", {
//     strings: ["Bros", "sis", "coder"],
//     // ["bros","sis","man","dog","chad","human","wolf"],
//     typeSpeed: 50,
//     backSpeed: 50,
//     smartBackspace: true,
//     loop: true,
//     // startDelay: 2,
//     // shuffle: true,
//     cursorChar: "",
//   });
//   gsap.to(
//     torus.scale,
//     {
//       duration: 1,
//       z: 1,
//       x: 1,
//       y: 1,
//       // ease: CustomEase.create("custom", "M0,0 C0,0 0.115,-0.001 0.185,0.006 0.24,0.012 0.277,0.018 0.33,0.035 0.378,0.051 0.411,0.067 0.455,0.094 0.503,0.124 0.427,0.061 0.468,0.102 0.513,0.147 0.578,0.304 0.616,0.358 0.662,0.423 0.693,0.561 0.732,0.634 0.776,0.719 0.802,0.83 0.84,0.92 0.882,1.024 1,0.872 1,0.872 ")
//     }
//   );
//   // await sleep(1100);
//   // document.body.style.overflow = 'scroll';
//   // let t = gsap.timeline({ defaults: { duration: 1 } });

//   let n = document.querySelector("nav");
// });


