"use client";

import styles from "./styles.module.css";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // 创建Three.js场景
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.LinearToneMapping;
    const vshader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;
    const fshader = `
      void main() {
        gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
      }
    `;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vshader,
      fragmentShader: fshader,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    camera.position.z = 1;
    function onWindowResize() {
      const aspect = window.innerWidth / window.innerHeight;
      let width = 1,
        height = 1;
      if (aspect >= 1) {
        height = 1 / aspect;
      } else {
        width = aspect;
      }
      camera.left = -width;
      camera.right = width;
      camera.top = height;
      camera.bottom = -height;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    let stop = false;
    function animate() {
      if (stop) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      stop = true;
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [canvasRef]);
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useThreeScene(canvasRef);
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
