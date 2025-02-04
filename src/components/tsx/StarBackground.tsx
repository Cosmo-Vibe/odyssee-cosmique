import { FC, useRef, useMemo, createContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../css/StarBackground.css';

interface StarBackgroundProps {
  motionState?: {
    speed?: number;
    direction?: 'forward' | 'backward';
    tunnel?: boolean;
  };
}

const StarContext = createContext<{ speed: number }>({ speed: 0.5 });

const StarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => ({ speed: 0.5 }), []);
  return <StarContext.Provider value={value}>{children}</StarContext.Provider>;
};

const StarField: FC<{ motionState?: StarBackgroundProps['motionState'] }> = ({ motionState }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  const starShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      speed: { value: 0.02 }, // Adjust as needed
      tunnel: { value: 0 },
      opacity: { value: 1.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float speed;
      uniform float opacity;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        float starDensity = 600.0;
        // Reverse star motion (subtracting time * speed) makes stars fly outward toward the camera
        vec2 shiftedUV = vec2(vUv.x, fract(vUv.y - time * speed));
        vec2 cell = floor(shiftedUV * starDensity);
        float rnd = random(cell);
        float star = step(0.98, rnd);
        gl_FragColor = vec4(1.0, 1.0, 1.0, star * opacity);
      }
    `
  }), []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.time.value = clock.getElapsedTime();
    materialRef.current.uniforms.speed.value = motionState?.speed || 0.02;
    materialRef.current.uniforms.tunnel.value = motionState?.tunnel ? 1 : 0;
    // Removed rotation update to ensure linear, forward motion
  });

  return (
    <group>
      <mesh 
        ref={coneRef} 
        position={[0, 0, -40]}
        rotation={[90, 0, 0]}
      >
        <cylinderGeometry 
          args={[
            40,   // top radius (wider end where camera is)
            8,    // bottom radius (narrower end we're looking at)
            80,   // height
            128,  // radial segments
            64,   // height segments
            true  // open-ended
          ]} 
        />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          depthTest={false}
          side={THREE.BackSide}
          uniforms={starShader.uniforms}
          vertexShader={starShader.vertexShader}
          fragmentShader={starShader.fragmentShader}
        />
      </mesh>
      <ambientLight intensity={0.5} />
    </group>
  );
};

const StarBackground: FC<StarBackgroundProps> = (props) => {
  return (
    <div className="star-background">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{
          position: [0, -3.75, 15],
          fov: 20,
          near: 0.1,
          far: 1000
        }}
      >
        <StarField {...props} />
      </Canvas>
    </div>
  );
};

export { StarProvider };
export default StarBackground;
