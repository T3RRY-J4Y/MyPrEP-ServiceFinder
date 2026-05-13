import { useEffect, useRef } from "react";

export default function CloudLayer({ count = 3 }) {
  const refs = useRef([]);
  const positions = useRef([]);
  const speeds = useRef([]);
  const rafId = useRef(null);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;

    const baseSpeeds = [0.15, 0.08, 0.12];
    const sm = window.innerWidth < 768 ? 0.7 : 1;
    speeds.current = els.map((_, i) => baseSpeeds[i % baseSpeeds.length] * sm);
    positions.current = els.map((_, i) => (i / els.length) * window.innerWidth);
    els.forEach((el, i) => { el.style.transform = `translateX(${positions.current[i]}px)`; });

    function animate() {
      const w = window.innerWidth;
      els.forEach((el, i) => {
        positions.current[i] += speeds.current[i];
        if (positions.current[i] > w + el.offsetWidth) positions.current[i] = -el.offsetWidth;
        el.style.transform = `translateX(${positions.current[i]}px)`;
      });
      rafId.current = requestAnimationFrame(animate);
    }
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const imgs = ["/img/cloud1.png", "/img/cloud2.png", "/img/cloud3.png"];
  const classes = ["cloud cloud1", "cloud cloud2", "cloud cloud3"];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={classes[i % classes.length]}
          ref={(el) => (refs.current[i] = el)}
        >
          <img src={imgs[i % imgs.length]} alt="cloud" />
        </div>
      ))}
    </>
  );
}
