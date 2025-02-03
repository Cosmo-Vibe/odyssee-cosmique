import { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StageCardProps {
  position: [number, number, number];
  name: string;
  index: number;
  currentStage: number;
  debug?: boolean;
  onClick?: () => void;
}

const StageCard: React.FC<StageCardProps> = ({
  position,
  name,
  index,
  currentStage,
  debug = false,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isActive = index === currentStage;
  const isAdjacent = Math.abs(index - currentStage) === 1;
  
  // Debug materials with distinct colors
  const debugMaterial = useMemo(() => {
    const colors = [
      '#ff0000', // Red for first
      '#00ff00', // Green for second
      '#0000ff', // Blue for third
      '#ffff00', // Yellow for fourth
      '#ff00ff'  // Magenta for fifth
    ];
    return new THREE.LineBasicMaterial({
      color: colors[index],
      linewidth: 2
    });
  }, [index]);

  const texture = useLoader(
    THREE.TextureLoader,
    `/img/${name.replace(/\s+/g, '')}.png`
  );

  const standardMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: isActive ? 1 : isAdjacent ? 0.7 : 0.3,
      side: THREE.DoubleSide
    });
  }, [texture, isActive, isAdjacent]);

  // Gentle floating animation
  useFrame(({ clock }) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  const scale = isActive ? 1.2 : isAdjacent ? 1 : 0.8;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={[scale * 4, scale * 6, 1]}
        onClick={onClick}
        onPointerOver={() => {
          if (isAdjacent) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry />
        <primitive object={standardMaterial} attach="material" />
        {debug && <lineSegments>
          <edgesGeometry attach="geometry">
            <primitive object={debugMaterial} attach="material" />
          </edgesGeometry>
        </lineSegments>}
      </mesh>
    </group>
  );
};

export default StageCard;
