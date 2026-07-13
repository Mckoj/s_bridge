import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Keep GSAP ticker and Lenis perfectly in sync
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Prevent GSAP from adding extra lag smoothing on top of Lenis
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
