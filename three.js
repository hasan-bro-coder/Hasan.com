import * as THREE from 'three';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export let torus
let material;
let geometry;

export async function threed(tr) {
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
    animate();
    torus.scale.x = 0
torus.scale.z = 0
torus.scale.y = 0
  }