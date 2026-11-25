import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CyberShieldSceneProps {
  isScanning?: boolean;
  hasCritical?: boolean;
  activeMode?: string;
}

export const CyberShieldScene: React.FC<CyberShieldSceneProps> = ({
  isScanning = false,
  hasCritical = false,
  activeMode = 'prefer_on_device',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScanningRef = useRef(isScanning);
  const hasCriticalRef = useRef(hasCritical);
  const activeModeRef = useRef(activeMode);

  // Keep refs in sync for render loop
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  useEffect(() => {
    hasCriticalRef.current = hasCritical;
  }, [hasCritical]);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 85);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x02040a, 0);
    container.appendChild(renderer.domElement);

    // 3. Create Cyber Shield Sphere Particles (Fibonacci distribution)
    const particleCount = 5200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const radius = 34;

    const emeraldColor = new THREE.Color(0x5df0a8); // Mint / Emerald
    const cyanColor = new THREE.Color(0x38bdf8);    // Luminous Cyber Cyan
    const violetColor = new THREE.Color(0x818cf8);  // Quantum Indigo

    for (let i = 0; i < particleCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);

      // Spherical coordinates
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Color blending
      const t = Math.random();
      const col = t > 0.6 ? emeraldColor : t > 0.25 ? cyanColor : violetColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = Math.random() * 2.5 + 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // High quality glowing particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(93, 240, 168, 0.95)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.5)');
    grad.addColorStop(1, 'rgba(2, 4, 10, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 3.4,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const shieldSphere = new THREE.Points(geometry, particleMaterial);
    scene.add(shieldSphere);

    // 4. Concentric Holographic Orbital Rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const createQuantumRing = (r: number, tiltX: number, tiltY: number, count: number, colHex: number) => {
      const ringGeom = new THREE.BufferGeometry();
      const ringPos = new Float32Array(count * 3);
      const ringColor = new Float32Array(count * 3);
      const baseCol = new THREE.Color(colHex);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        ringPos[i * 3] = Math.cos(angle) * r;
        ringPos[i * 3 + 1] = Math.sin(angle) * r;
        ringPos[i * 3 + 2] = (Math.sin(angle * 4) * 0.8);

        ringColor[i * 3] = baseCol.r;
        ringColor[i * 3 + 1] = baseCol.g;
        ringColor[i * 3 + 2] = baseCol.b;
      }

      ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
      ringGeom.setAttribute('color', new THREE.BufferAttribute(ringColor, 3));

      const ringMat = new THREE.PointsMaterial({
        size: 2.4,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const ringPoints = new THREE.Points(ringGeom, ringMat);
      ringPoints.rotation.x = tiltX;
      ringPoints.rotation.y = tiltY;
      return ringPoints;
    };

    const ring1 = createQuantumRing(44, Math.PI / 3, Math.PI / 6, 600, 0x5df0a8);
    const ring2 = createQuantumRing(48, -Math.PI / 4, Math.PI / 3, 700, 0x38bdf8);
    ringGroup.add(ring1);
    ringGroup.add(ring2);

    // 5. Ambient Cyber Starfield / Motes
    const starCount = 650;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 220;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.0,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      color: 0x93c5fd,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // 6. Interactive Mouse Pointer Dynamics
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const scanning = isScanningRef.current;
      const threat = hasCriticalRef.current;

      // Base rotation + mouse tilt with inertia
      const rotSpeed = scanning ? 0.016 : 0.003;
      shieldSphere.rotation.y += rotSpeed;
      shieldSphere.rotation.x += rotSpeed * 0.3;

      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      ringGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.6) * 0.08;
      ringGroup.rotation.y += scanning ? 0.022 : 0.005;
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.006;

      starField.rotation.y = elapsedTime * 0.0008;

      // Pulse and Wave Displacement of Particles
      const posArray = geometry.attributes.position.array as Float32Array;
      const colArray = geometry.attributes.color.array as Float32Array;
      const waveFreq = scanning ? 5.5 : 2.5;
      const waveAmp = scanning ? 1.6 : 0.6;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const ox = originalPositions[idx];
        const oy = originalPositions[idx + 1];
        const oz = originalPositions[idx + 2];

        // Harmonic displacement
        const wave = Math.sin(elapsedTime * waveFreq + (ox + oy + oz) * 0.12) * waveAmp;
        const factor = 1 + wave / radius;

        posArray[idx] = ox * factor;
        posArray[idx + 1] = oy * factor;
        posArray[idx + 2] = oz * factor;

        // Dynamic color shift on scanning or alert
        if (scanning) {
          // Intense scan pulse
          colArray[idx] = 0.05;
          colArray[idx + 1] = 0.95 + Math.sin(elapsedTime * 10 + i) * 0.05;
          colArray[idx + 2] = 0.98;
        } else if (threat && i % 8 === 0) {
          // Crimson anomaly nodes
          colArray[idx] = 0.95;
          colArray[idx + 1] = 0.15;
          colArray[idx + 2] = 0.3;
        } else {
          // Return to emerald/cyan
          const t = (Math.sin(elapsedTime * 0.8 + i * 0.02) + 1) * 0.5;
          colArray[idx] = t * emeraldColor.r + (1 - t) * cyanColor.r;
          colArray[idx + 1] = t * emeraldColor.g + (1 - t) * cyanColor.g;
          colArray[idx + 2] = t * emeraldColor.b + (1 - t) * cyanColor.b;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Camera tilt towards right hemisphere to beautifully frame the left code editor
      camera.position.x = 22 + currentRotY * 12;
      camera.position.y = currentRotX * 8;
      camera.lookAt(10, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      particleMaterial.dispose();
      starGeom.dispose();
      starMat.dispose();
      ringGroup.children.forEach((c: THREE.Object3D) => {
        if (c instanceof THREE.Points) {
          c.geometry.dispose();
          if (Array.isArray(c.material)) c.material.forEach((m: THREE.Material) => m.dispose());
          else (c.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,1) 70%)',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,1) 70%)',
      }}
    />
  );
};
