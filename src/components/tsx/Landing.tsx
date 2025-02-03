import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import StarBackground from './StarBackground';
import '../css/Landing.css';

const Landing: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <StarBackground />
      <div 
        className="main-text"
        onClick={() => navigate('/path-choice')}
      >
        Débutez votre voyage
      </div>
      <div className="bottom-text">
        Mettez un casque pour une meilleure expérience
      </div>
    </div>
  );
};

export default Landing;
