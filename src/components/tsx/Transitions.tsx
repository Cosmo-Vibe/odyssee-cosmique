import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface TransitionsProps {
  isTransitioning: boolean;
  progress: number;
}

const Transitions = ({ isTransitioning, progress }: TransitionsProps) => {
  const tunnelRef = useRef<THREE.Group>(null);
  
  const { tunnelScale, tunnelRotation } = useSpring({
    tunnelScale: isTransitioning ? 2 : 1,
    tunnelRotation: progress * Math.PI * 2,
    config: { tension: 120, friction: 14 }
  });

  useFrame(() => {
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += 0.001;
    }
  });

  return (
    <animated.group
      ref={tunnelRef}
      scale={tunnelScale}
      rotation-x={tunnelRotation}
    >
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, -i * 2]}
          rotation={[0, 0, (Math.PI / 4) * i]}
        >
          <torusGeometry args={[4, 0.2, 16, 100]} />
          <meshStandardMaterial 
            color="#ffffff"
            opacity={0.1}
            transparent
            wireframe
          />
        </mesh>
      ))}
    </animated.group>
  );
};

export default Transitions;
