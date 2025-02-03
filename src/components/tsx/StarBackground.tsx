import { FC, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../css/StarBackground.css';

const StarField: FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create stars
  const vertices = [];
  const numStars = 2000;
  const radius = 500;

  for (let i = 0; i < numStars; i++) {
    const phi = Math.random() * Math.PI * 2;
    const cosTheta = Math.random() * 2 - 1;
    const theta = Math.acos(cosTheta);
    
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: true
  });

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Change rotation axis from Y to X for top-to-bottom movement
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

const StarBackground: FC = () => (
  <div className="star-background">
    <Canvas
      camera={{
        position: [0, 0, 0],
        fov: 75,
        near: 0.1,
        far: 1000
      }}
    >
      <StarField />
    </Canvas>
  </div>
);

export default StarBackground;
