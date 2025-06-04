import { Stars } from '@react-three/drei';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// CartoonCloud component
const CartoonCloud = ({ position, scale = 1, speed = 0.1 }: { position: [number, number, number], scale?: number, speed?: number }) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += delta * speed;
      // Reset position when cloud moves too far right
      if (cloudRef.current.position.x > 30) {
        cloudRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {/* Main center cluster */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Top layer puffs */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.8, 0.8, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.8, 0.8, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Middle layer puffs */}
      <mesh position={[-1.2, 0, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.2, 0, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Bottom layer puffs */}
      <mesh position={[-0.6, -0.4, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.6, -0.4, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Extra puffs for more volume */}
      <mesh position={[0, 0.5, 0.3]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.5, -0.3]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Small decorative puffs */}
      <mesh position={[-1.5, 0.3, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.5, 0.3, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

// Tree component
const Tree = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  return (
    <group position={position} scale={scale}>
      {/* Tree trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Tree foliage (multiple layers for fuller look) */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
};

// High altitude cloud - simpler shape for distant clouds
const HighCloud = ({ position, scale = 1, speed = 0.1 }: { position: [number, number, number], scale?: number, speed?: number }) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += delta * speed;
      if (cloudRef.current.position.x > 40) {
        cloudRef.current.position.x = -40;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {/* Simpler shape for distant clouds */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.8, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

const DynamicBackground = () => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const sunRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.x += delta * 0.05;
      cloudsRef.current.rotation.y += delta * 0.05;
    }
    if (sunRef.current && timeOfDay === 'morning') {
      // Sunrise animation
      const progress = (Date.now() % 10000) / 10000; // 10-second cycle
      sunRef.current.position.y = -2 + progress * 7; // Move from -2 to 5
      sunRef.current.position.x = -5 + progress * 10; // Move from -5 to 5
    }
  });

  const getBackgroundColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return ['#87CEEB', '#B0E2FF']; // Sky blue to lighter sky blue
      case 'afternoon':
        return ['#87CEEB', '#4F97D5']; // Sky blue to deeper sky blue
      case 'evening':
        return ['#87CEEB', '#4682B4']; // Sky blue to steel blue
      case 'night':
        return ['#191970', '#000000']; // Midnight blue to black
    }
  };

  const getFogColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return '#87CEEB';
      case 'afternoon':
        return '#87CEEB';
      case 'evening':
        return '#87CEEB';
      case 'night':
        return '#191970';
    }
  };

  // Memoize tree positions so they don't change on re-renders
  const trees = useMemo(() => {
    const generatedTrees = [];
    const treeCount = 50;
    const radius = 20;
    
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const r = radius * Math.sqrt(Math.random()); // For more natural distribution
      const x = Math.cos(angle) * r + (Math.random() - 0.5) * 10;
      const z = Math.sin(angle) * r + (Math.random() - 0.5) * 10;
      const scale = 0.5 + Math.random() * 0.5;
      generatedTrees.push({ position: [x, -5, z] as [number, number, number], scale });
    }
    return generatedTrees;
  }, []); // Empty dependency array means this will only run once

  const [bgColor1, bgColor2] = getBackgroundColor();

  return (
    <>
      <color attach="background" args={[bgColor1]} />
      
      {/* Stars with different settings for night */}
      {timeOfDay === 'night' && (
        <>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          {/* Additional smaller stars for depth */}
          <Stars
            radius={50}
            depth={25}
            count={2500}
            factor={2}
            saturation={0}
            fade
            speed={0.5}
          />
        </>
      )}

      <fog attach="fog" args={[getFogColor(), 5, 30]} /> {/* Increased fog distance for better cloud visibility */}
      
      {/* Ground plane with grass texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* High altitude clouds */}
      {(timeOfDay === 'morning' || timeOfDay === 'afternoon' || timeOfDay === 'evening') && (
        <>
          {/* Very high distant clouds */}
          <HighCloud position={[-25, 15, -35]} speed={0.02} scale={6} />
          <HighCloud position={[0, 18, -40]} speed={0.015} scale={8} />
          <HighCloud position={[25, 16, -38]} speed={0.018} scale={7} />
          <HighCloud position={[-15, 20, -42]} speed={0.012} scale={9} />
          <HighCloud position={[15, 19, -41]} speed={0.016} scale={8} />
          
          {/* Mid-high clouds */}
          <CartoonCloud position={[-20, 12, -25]} speed={0.04} scale={4} />
          <CartoonCloud position={[20, 10, -28]} speed={0.035} scale={5} />
          <CartoonCloud position={[0, 11, -30]} speed={0.03} scale={6} />
          
          {/* Lower clouds (existing) */}
          <CartoonCloud position={[-8, 2, -15]} speed={0.3} scale={3} />
          <CartoonCloud position={[8, 3, -12]} speed={0.2} scale={2.5} />
          <CartoonCloud position={[0, 4, -18]} speed={0.15} scale={4} />
          <CartoonCloud position={[-12, 0, -14]} speed={0.25} scale={3.5} />
          <CartoonCloud position={[15, 1, -16]} speed={0.18} scale={3} />
        </>
      )}

      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree key={index} position={tree.position} scale={tree.scale} />
      ))}

      {/* Background gradient */}
      <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={bgColor2} />
      </mesh>

      {/* Sun/Moon with glow effect */}
      <mesh
        ref={sunRef}
        position={[
          timeOfDay === 'night' ? -5 : 
          timeOfDay === 'evening' ? -2 : 
          timeOfDay === 'morning' ? -5 : 5,
          timeOfDay === 'night' ? 3 : 
          timeOfDay === 'evening' ? 1 : 
          timeOfDay === 'morning' ? -2 : 5,
          -8
        ]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={timeOfDay === 'night' ? '#FFFFFF' : '#FFD700'}
          emissive={timeOfDay === 'night' ? '#FFFFFF' : '#FFD700'}
          emissiveIntensity={timeOfDay === 'night' ? 0.5 : 1}
        />
      </mesh>

      {/* Glow sphere behind sun/moon */}
      <mesh
        position={[
          timeOfDay === 'night' ? -5 : 
          timeOfDay === 'evening' ? -2 : 
          timeOfDay === 'morning' ? -5 : 5,
          timeOfDay === 'night' ? 3 : 
          timeOfDay === 'evening' ? 1 : 
          timeOfDay === 'morning' ? -2 : 5,
          -8.1
        ]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={timeOfDay === 'night' ? '#4444FF' : '#FFD700'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Ambient light based on time of day */}
      <ambientLight
        intensity={
          timeOfDay === 'night' ? 0.2 :
          timeOfDay === 'evening' ? 0.5 :
          timeOfDay === 'morning' ? 0.6 : 0.8
        }
      />

      {/* Directional light (sun/moon) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={
          timeOfDay === 'night' ? 0.2 :
          timeOfDay === 'evening' ? 0.5 :
          timeOfDay === 'morning' ? 0.7 : 1
        }
        color={
          timeOfDay === 'night' ? '#FFFFFF' :
          timeOfDay === 'evening' ? '#FF4500' :
          timeOfDay === 'morning' ? '#FFB347' : '#FFFFFF'
        }
      />
    </>
  );
};

export default DynamicBackground; 