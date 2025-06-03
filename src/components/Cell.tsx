import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';

interface CellProps {
  position: [number, number, number];
  value: null | 'X' | 'O';
  onClick: () => void;
  isWinning: boolean;
  isActive: boolean;
  currentPlayer: 'X' | 'O';
}

const Cell = ({ position, value, onClick, isWinning, isActive, currentPlayer }: CellProps) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const rotationRef = useRef(0);

  useFrame((_state, delta) => {
    if (groupRef.current && isWinning) {
      rotationRef.current += delta;
      groupRef.current.position.z = Math.sin(rotationRef.current * 2) * 0.1;
    }
  });

  const scale = new Vector3(
    1 + (hovered ? 0.1 : 0),
    1 + (hovered ? 0.1 : 0),
    1 + (hovered ? 0.1 : 0)
  );

  return (
    <group position={position} ref={groupRef}>
      {/* Clickable area */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial
          color={hovered ? '#e0e0e0' : '#ffffff'}
          transparent
          opacity={isActive ? 0.1 : 0.05}
          emissive={hovered ? currentPlayer === 'X' ? '#ff0000' : '#0000ff' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
          side={2}
        />
      </mesh>

      {/* X or O marker */}
      {value && (
        <group scale={scale}>
          {value === 'X' ? (
            // X marker
            <>
              <mesh rotation={[Math.PI/2, Math.PI / 4, 0]} position={[0, 0, 0.05]}>
                <boxGeometry args={[0.8, 0.15, 0.1]} />
                <meshStandardMaterial 
                  color="red"
                  emissive="red"
                  emissiveIntensity={isWinning ? 0.8 : 0.2}
                />
              </mesh>
              <mesh rotation={[Math.PI/2, -Math.PI / 4, 0]} position={[0, 0, 0.05]}>
                <boxGeometry args={[0.8, 0.15, 0.1]} />
                <meshStandardMaterial 
                  color="red"
                  emissive="red"
                  emissiveIntensity={isWinning ? 0.8 : 0.2}
                />
              </mesh>
            </>
          ) : (
            // O marker
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
              <meshStandardMaterial 
                color="blue"
                emissive="blue"
                emissiveIntensity={isWinning ? 0.8 : 0.2}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
};

export default Cell; 