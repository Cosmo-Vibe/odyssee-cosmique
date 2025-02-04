import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import NavBar from './NavBar';
import StageCard from './StageCard';
import Transitions from './Transitions';
import StarBackground from './StarBackground';  // <-- New import
import '../css/FirstPath.css';

const stages = [
  { id: 0, name: 'Amas stellaire', position: [0, 0, 0] as [number, number, number] },
  { id: 1, name: 'Étoile moyenne', position: [0, 2, -5] as [number, number, number] },
  { id: 2, name: 'Géante rouge', position: [0, 4, -10] as [number, number, number] },
  { id: 3, name: 'Nébuleuse planétaire', position: [0, 6, -15] as [number, number, number] },
  { id: 4, name: 'Naine blanche', position: [0, 8, -20] as [number, number, number] }
];

const FirstPath = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const handleStageChange = useCallback((newStage: number) => {
    setIsTransitioning(true);
    
    setTransitionProgress(0);
    
    const transition = setInterval(() => {
      setTransitionProgress(prev => {
        if (prev >= 1) {
          clearInterval(transition);
          setIsTransitioning(false);
          setCurrentStage(newStage);
          return 1;
        }
        return prev + 0.05;
      });
    }, 16);

    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentStage(newStage);
    }, 1000);
  }, []);

  const handleBackToPathChoice = useCallback(() => {
    const container = document.querySelector('.first-path-container');
    container?.classList.add('slide-out-right');
    setTimeout(() => navigate('/path-choice'), 600);
  }, [navigate]);

  return (
    <div className="first-path-container">
      <StarBackground />  {/* StarBackground renders behind */}
      {/* Container with higher z-index and relative positioning */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <NavBar 
          currentStage={currentStage} 
          totalStages={stages.length} 
          onStageChange={handleStageChange} 
        />
        <Canvas
          className="stage-canvas"
          style={{ background: 'transparent' }}  // Force transparency so StarBackground shows
          gl={{ antialias: true, alpha: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Transitions 
        isTransitioning={isTransitioning}
        progress={transitionProgress}
          />
          {stages.map((stage, index) => (
        <StageCard
          key={stage.id}
          {...stage}
          isActive={index === currentStage}
          isCurrent={index === currentStage}
          isTransitioning={isTransitioning}
        />
          ))}
        </Canvas>
        <svg 
          width="26" 
          height="46" 
          viewBox="0 0 26 46" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleBackToPathChoice} 
          style={{ cursor: 'pointer' }} 
          className="nav-arrow"
        >
          <rect y="22.6323" width="32.0072" height="3.55636" transform="rotate(-45 0 22.6323)" fill="#8C8C8C"/>
          <path d="M25.2737 42.9116L2.64117 20.2791L0.126443 22.7938L22.759 45.4263L25.2737 42.9116Z" fill="#8C8C8C"/>
        </svg>
      </div>
    </div>
  );
};

export default FirstPath;
