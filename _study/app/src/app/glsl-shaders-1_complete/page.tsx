"use client";

import styles from "./styles.module.css";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const vshader = `
      void main() {	
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
    const fshader = `
      uniform vec3 u_color;

      void main (void)
      {
        gl_FragColor = vec4(u_color, 1.0); 
      }
    `;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.LinearToneMapping;

    const clock = new THREE.Clock();

    const uniforms = {
      u_color: { value: new THREE.Color(0xff0000) },
      u_time: { value: 0.0 },
      u_mouse: { value: { x: 0.0, y: 0.0 } },
      u_resolution: { value: { x: 0, y: 0 } },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vshader,
      fragmentShader: fshader,
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 1;

    onWindowResize();

    if ("ontouchstart" in window) {
      document.addEventListener("touchmove", move);
    } else {
      window.addEventListener("resize", onWindowResize, false);
      document.addEventListener("mousemove", move);
    }

    function move(evt: any) {
      uniforms.u_mouse.value.x = evt.touches
        ? evt.touches[0].clientX
        : evt.clientX;
      uniforms.u_mouse.value.y = evt.touches
        ? evt.touches[0].clientY
        : evt.clientY;
    }

    animate();

    function onWindowResize() {
      const aspectRatio = window.innerWidth / window.innerHeight;
      let width, height;
      if (aspectRatio >= 1) {
        width = 1;
        height = (window.innerHeight / window.innerWidth) * width;
      } else {
        width = aspectRatio;
        height = 1;
      }
      camera.left = -width;
      camera.right = width;
      camera.top = height;
      camera.bottom = -height;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.x = window.innerWidth;
      uniforms.u_resolution.value.y = window.innerHeight;
    }

    function animate() {
      requestAnimationFrame(animate);
      uniforms.u_time.value += clock.getDelta();
      renderer.render(scene, camera);
    }
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="webgl"
      style={{ width: "100%", height: "100%" }}
    ></canvas>
  );
}

export default () => {
  return (
    <div className={styles.main}>
      <App />
    </div>
  );
};
