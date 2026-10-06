import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RelightScene = ({
  image,
  fit = "cover",
  displacement = 1.5,
  normalStrength = 1.5,
  lightColor = "#ffffff",
  lightIntensity = 6,
  ambient = 0.02,
  ambientColor = "#ffffff",
  follow = 0.12,
  autoOrbit = true,
  orbitRadius = 0.6,
  orbitDuration = 10,
  elevation = 1.2
}) => {
  // Load texture
  const texture = useTexture(image);
  
  const meshRef = useRef();
  const lightRef = useRef();
  const { viewport, mouse } = useThree();

  // Convert string hex to THREE.Color
  const parsedLightColor = useMemo(() => new THREE.Color(lightColor), [lightColor]);
  const parsedAmbientColor = useMemo(() => new THREE.Color(ambientColor), [ambientColor]);

  // Handle object-fit: cover for the texture
  useMemo(() => {
    if (!texture.image) return;
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;
    
    if (fit === "cover") {
      if (imageAspect > viewportAspect) {
        texture.repeat.x = viewportAspect / imageAspect;
        texture.repeat.y = 1;
        texture.offset.x = (1 - texture.repeat.x) / 2;
        texture.offset.y = 0;
      } else {
        texture.repeat.x = 1;
        texture.repeat.y = imageAspect / viewportAspect;
        texture.offset.x = 0;
        texture.offset.y = (1 - texture.repeat.y) / 2;
      }
    }
    texture.needsUpdate = true;
  }, [texture, viewport.width, viewport.height, fit]);

  useFrame((state) => {
    if (!lightRef.current) return;

    let targetX = mouse.x * viewport.width / 2;
    let targetY = mouse.y * viewport.height / 2;

    // Auto orbit when mouse is near center or untouched
    if (autoOrbit && Math.abs(mouse.x) < 0.1 && Math.abs(mouse.y) < 0.1) {
      const t = state.clock.elapsedTime;
      const angle = (t / orbitDuration) * Math.PI * 2;
      targetX = Math.cos(angle) * orbitRadius * (viewport.width / 2);
      targetY = Math.sin(angle) * orbitRadius * (viewport.height / 2);
    }

    // Smooth follow
    lightRef.current.position.x += (targetX - lightRef.current.position.x) * follow;
    lightRef.current.position.y += (targetY - lightRef.current.position.y) * follow;
    lightRef.current.position.z = elevation * 2; // Elevate the light source
  });

  return (
    <>
      <ambientLight color={parsedAmbientColor} intensity={ambient * Math.PI} />
      <pointLight 
        ref={lightRef} 
        color={parsedLightColor} 
        intensity={lightIntensity * 10} 
        distance={20} 
        decay={2}
      />
      <mesh ref={meshRef}>
        <planeGeometry args={[viewport.width, viewport.height, 128, 128]} />
        <meshStandardMaterial 
          map={texture} 
          displacementMap={texture} 
          displacementScale={displacement * 0.2} 
          bumpMap={texture}
          bumpScale={normalStrength * 0.1}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};

export const Relight = (props) => {
  const { className, backgroundColor = "#000000", fallbackColor = "#171717", children } = props;
  
  return (
    <div className={`relative w-full h-full ${className || ''}`} style={{ backgroundColor: fallbackColor }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: false, antialias: true }}
        style={{ background: backgroundColor }}
      >
        <React.Suspense fallback={null}>
          <RelightScene {...props} />
        </React.Suspense>
      </Canvas>
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};
