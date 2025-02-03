import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PathChoice.css';

const PathChoice: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.querySelector('.path-choice-container');
    // Add only the slide-up effect on mount
    requestAnimationFrame(() => container?.classList.add('slide-up'));
  }, []);

  const paths = [
    {
      id: 1,
      title: 'Naine Blanche',
      image: '/img/Naineblanche.png', // Temporary placeholder
      available: true
    },
    {
      id: 2,
      title: 'Site en maintenance',
      image: '/img/not_working.svg',
      available: false
    },
    {
      id: 3,
      title: 'Site en maintenance',
      image: '/img/not_working.svg',
      available: false
    }
  ];

  const handlePathSelect = (pathId: number) => {
    if (pathId === 1) {
      const container = document.querySelector('.path-choice-container');
      // Remove slide-up and add slide-down for exit effect
      container?.classList.remove('slide-up');
      container?.classList.add('slide-down');
      setTimeout(() => navigate('/first-path'), 600);
    }
  };

  return (
    <div className="path-choice-container">
      <div className="carousel-container">
        <div className="carousel">
          {paths.map((path) => (
            <div
              key={path.id}
              className={`path-card ${!path.available ? 'disabled' : ''}`}
              onClick={() => path.available && handlePathSelect(path.id)}
            >
              <img src={path.image} alt={path.title} />
              <h2>{path.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathChoice;
