import Cell from './Cell';

interface BoardProps {
  board: (null | 'X' | 'O')[][];
  onCellClick: (x: number, y: number) => void;
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'Draw!';
}

const Board = ({ board, onCellClick, currentPlayer, winner }: BoardProps) => {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <group key={`grid-${i}`}>
          {/* Horizontal lines */}
          <mesh position={[i - 1.5, 0, 0]}>
            <boxGeometry args={[0.02, 3, 0.02]} />
            <meshStandardMaterial 
              color="pink" 
              transparent 
              opacity={0.5}
              emissive="yellow"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Vertical lines */}
          <mesh position={[0, i - 1.5, 0]}>
            <boxGeometry args={[3, 0.05, 0.05]} />
            <meshStandardMaterial 
              color="gray" 
              transparent 
              opacity={0.5}
              emissive="gray"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Background plane */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Cells */}
      {board.map((row, x) =>
        row.map((cell, y) => (
          <Cell
            key={`${x}-${y}`}
            position={[x - 1, y - 1, 0]}
            value={cell}
            onClick={() => onCellClick(x, y)}
            isWinning={winner === cell}
            isActive={!winner && !cell}
            currentPlayer={currentPlayer}
          />
        ))
      )}
    </group>
  );
};

export default Board; 