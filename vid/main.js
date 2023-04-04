"use strict";
var _a;
let tr = navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i);
let videos = [
    [
        "../video/received_422502766049122.mp4",
        "baby doll",
        "2017"
    ],
    [
        "../video/received_630685765295558.mp4",
        "noob vs Pro",
        "2017"
    ],
    [
        "../video/received_2337539986404057.mp4",
        "rap god husain",
        "2017"
    ],
    [
        "../video/received_370613668420701.mp4",
        "hI ! fk you ?",
        "2017"
    ],
    [
        "../video/318492407_4708494842608528_2331414383988409008_n.mp4",
        "hehe fk you!",
        "2017"
    ],
    [
        "../video/received_5342584645819967.mp4",
        "ai husain edik snonto ?",
        "2017"
    ],
    [
        "../video/video-aeb964cd-6389-4e54-8d12-6b64eef3cec0-1662804957.mp4",
        `${new Date().toLocaleTimeString()} Giga chad born`,
        "2017"
    ],
    [
        "../video/video-1653745437.mp4",
        `gravity falls intro`,
        "2017"
    ],
    [
        "../video/received_1125328911701612.mp4",
        `proud to  be #bhotka`,
        "2017"
    ],
    [
        "../video/video-1514465172.mp4",
        `khabi(fan) #adhikli`,
        "2017"
    ],
];
document.querySelectorAll("video").forEach((el, i) => {
    // let k:string = new Date().toLocaleTimeString();
    // if(tr){
    el.controls = true; // prevent
    // el.children[1].innerHTML = el.children[1].innerHTML.split(" ").length.toLocaleString();
    // }
    //  console.log(,k);
});
(_a = document.querySelector('.src input')) === null || _a === void 0 ? void 0 : _a.addEventListener("input", () => {
    var _a;
    console.log((_a = document.querySelector('.src input')) === null || _a === void 0 ? void 0 : _a.value);
    //  let r = ["k","l","t","y"]
    document.querySelectorAll('.vid-con')[0].innerHTML = "";
    videos.forEach(el => {
        var _a, _b;
        if (el[1].match(((_a = document.querySelector('.src input')) === null || _a === void 0 ? void 0 : _a.value) || "")) {
            let vidiv = document.createElement("div");
            vidiv.className = "video";
            // vidiv.dataset.aos = "fade-in";
            let vid = document.createElement("video");
            // vid.controls = true
            let a = document.createElement("a");
            a.href = el[0];
            let vidsrc = document.createElement("source");
            vidsrc.src = el[0];
            vidsrc.type = "video/mp4";
            let title = document.createElement("h3");
            title.innerText = el[1];
            let dat = document.createElement("h4");
            dat.innerText = el[2];
            vid.appendChild(vidsrc);
            a.appendChild(vid);
            vidiv.appendChild(a);
            vidiv.appendChild(title);
            vidiv.appendChild(dat);
            (_b = document.querySelector(".vid-con")) === null || _b === void 0 ? void 0 : _b.appendChild(vidiv);
            // console.log(el[0]);
        }
    });
});
videos.forEach(el => {
    var _a;
    let vidiv = document.createElement("div");
    vidiv.className = "video";
    // vidiv.dataset.aos = "zoom-in-up";
    let vid = document.createElement("video");
    // vid.controls = true
    let a = document.createElement("a");
    a.href = el[0];
    let vidsrc = document.createElement("source");
    vidsrc.src = el[0];
    vidsrc.type = "video/mp4";
    let title = document.createElement("h3");
    title.innerText = el[1];
    let dat = document.createElement("h4");
    dat.innerText = el[2];
    vid.appendChild(vidsrc);
    a.appendChild(vid);
    vidiv.appendChild(a);
    vidiv.appendChild(title);
    vidiv.appendChild(dat);
    (_a = document.querySelector(".vid-con")) === null || _a === void 0 ? void 0 : _a.appendChild(vidiv);
    // console.log(el[0]);
});
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
AOS.init();
gsap.registerPlugin(ScrollTrigger)
let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".video", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-3, 3); // don't let the skew go beyond 20 degrees. 

ScrollTrigger.create({
  onUpdate: (self) => {
    let skew = clamp(self.getVelocity() / -300);
    // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
    if (Math.abs(skew) > Math.abs(proxy.skew)) {
      proxy.skew = skew;
      gsap.to(proxy, {skew: 0, duration: 1.8, ease: "elastic", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
    }
  }
});

// make the right edge "stick" to the scroll bar. force3D: true improves performance
gsap.set(".video", {transformOrigin: "right center", force3D: true});
