import { useState, useCallback, useMemo, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import NavBar from './NavBar';
import StarBackground from './StarBackground';
import StageCard from './StageCard';
import '../css/FirstPath.css';

// Calculate exponential curve positions
const calculateStagePositions = () => {
  const baseSpacing = 50; // Increased spacing
  const verticalOffset = 15; // Higher curve
  const exponentialFactor = 0.35; // Gentler curve
  const stages = [];
  const stageNames = ['Amas stellaire', 'Étoile moyenne', 'Géante rouge', 'Nébuleuse planétaire', 'Naine blanche'];
  
  for (let i = 0; i < 5; i++) {
    const x = 0;
    const z = -Math.exp(i * exponentialFactor) * baseSpacing;
    const y = verticalOffset * (1 - Math.exp(-i * 0.3));
    stages.push({
      id: i,
      name: stageNames[i],
      position: [x, y, z] as [number, number, number],
      initialPosition: [x, y, z] as [number, number, number] // Store initial position
    });
  }
  return stages;
};

const stages = calculateStagePositions();

const FirstPath = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathRef = useRef(null);
  const [pathOffset, setPathOffset] = useState({ x: 0, y: 0, z: 0 });

  // Calculate camera positions based on current stage
  const cameraPosition = useMemo(() => {
    const currentStagePos = stages[currentStage].position;
    return new Vector3(
      currentStagePos[0],
      currentStagePos[1] + 2,
      currentStagePos[2] + 10
    );
  }, [currentStage]);

  const handleStageChange = useCallback((newStage: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const targetStage = stages[newStage];
    const currentStagePos = stages[currentStage].position;
    
    const offset = {
      x: currentStagePos[0] - targetStage.initialPosition[0],
      y: currentStagePos[1] - targetStage.initialPosition[1],
      z: currentStagePos[2] - targetStage.initialPosition[2]
    };

    const duration = 2000; // Slightly faster
    const start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smoother easing
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      setPathOffset({
        x: offset.x * eased,
        y: offset.y * eased,
        z: offset.z * eased
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setCurrentStage(newStage);
          setIsTransitioning(false);
          setPathOffset({ x: 0, y: 0, z: 0 });
        }, 100);
      }
    };

    animate();
  }, [currentStage, isTransitioning]);

  const handleCardClick = useCallback((index: number) => {
    if (Math.abs(index - currentStage) === 1) {
      handleStageChange(index);
    }
  }, [currentStage, handleStageChange]);

  const handleBackToPathChoice = useCallback(() => {
    navigate('/path-choice');
  }, [navigate]);

  return (
    <div className="first-path-container">
      <div className="background-layer">
        <StarBackground />
      </div>
      <div className="content-layer">
        <NavBar 
          currentStage={currentStage} 
          onStageChange={handleStageChange} 
        />
        
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 75, position: [0, 0, 10] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <group ref={pathRef} position={[pathOffset.x, pathOffset.y, pathOffset.z]}>
              {stages.map((stage, index) => (
                <StageCard
                  key={stage.id}
                  {...stage}
                  debug={true} // Enable debug visualization
                  index={index}
                  currentStage={currentStage}
                  isActive={index === currentStage}
                  isCurrent={index === currentStage}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </group>
          </Suspense>
          <PerspectiveCamera 
            makeDefault 
            position={cameraPosition}
            fov={30}
            near={0.1}
            far={1000}
          />
        </Canvas>

        <div className="nav-arrow-container">
          <svg 
            className="nav-arrow"
            width="26" 
            height="46" 
            viewBox="0 0 26 46" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleBackToPathChoice}
          >
            <rect y="22.6323" width="32.0072" height="3.55636" transform="rotate(-45 0 22.6323)" fill="#8C8C8C"/>
            <path d="M25.2737 42.9116L2.64117 20.2791L0.126443 22.7938L22.759 45.4263L25.2737 42.9116Z" fill="#8C8C8C"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FirstPath;
