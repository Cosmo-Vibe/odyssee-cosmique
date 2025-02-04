import { useRef, useMemo } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../../config/stageConfig';

interface StageCardProps {
  position: [number, number, number];
  name: string;
  index: number;
  currentStage: number;
  onClick?: () => void;
}

const StageCard: React.FC<StageCardProps> = ({
  position,
  name,
  index,
  currentStage,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const isActive = index === currentStage;

  const texture = useLoader(THREE.TextureLoader, `/img/${name.replace(/\s+/g, '')}.png`);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const cardScale = useMemo(() => {
    const baseScale = isActive ? 1.2 : 0.8;
    const width = viewport.width * 0.4 * baseScale;
    const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
    return [width, width / aspectRatio, 1] as [number, number, number];
  }, [isActive, viewport.width, texture]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={cardScale}
      onClick={onClick}
    >
      <planeGeometry />
      <meshBasicMaterial 
        map={texture}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
};

export default StageCard;
