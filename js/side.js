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