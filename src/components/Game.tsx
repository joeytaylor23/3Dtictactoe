import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useState, useCallback } from 'react';
import Board from './Board';

const Game = () => {
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameBoard, setGameBoard] = useState<(null | 'X' | 'O')[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null))
  );
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw!' | null>(null);

  const checkWin = useCallback((board: (null | 'X' | 'O')[][], player: 'X' | 'O'): boolean => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;

    return false;
  }, []);

  const resetGame = () => {
    setGameBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setWinner(null);
    setCurrentPlayer('X');
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameBoard[x][y] !== null || winner) return;

    const newBoard = JSON.parse(JSON.stringify(gameBoard));
    newBoard[x][y] = currentPlayer;
    setGameBoard(newBoard);

    if (checkWin(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      setScores(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
    } else if (!newBoard.flat().includes(null)) {
      setWinner('Draw!');
      setScores(prev => ({
        ...prev,
        Draw: prev.Draw + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 0], fov: 75 }}>
        <color attach="background" args={['#111']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Board 
          board={gameBoard} 
          onCellClick={handleCellClick}
          currentPlayer={currentPlayer}
          winner={(winner || 'Draw!') as 'X' | 'O' | 'Draw!'}
        />
        <OrbitControls />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(255,255,255,0.9)',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        boxShadow: '0 0 10px rgba(230, 225, 229, 0.97)'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Tic Tac Toe</h2>
        <div style={{ marginBottom: '10px' }}>
          <strong>Score:</strong><br />
          Player X: {scores.X}<br />
          Player O: {scores.O}<br />
          Draw: {scores.Draw}
        </div>
        {winner ? (
          <div style={{ marginBottom: '10px', color: '#2196f3' }}>
            {winner === 'Draw!' ? 'Draw!' : `Player ${winner} wins!`}
          </div>
        ) : (
          <div style={{ marginBottom: '10px' }}>
            Current Player: {currentPlayer}
          </div>
        )}
        <button 
          onClick={resetGame}
          style={{
            padding: '8px 16px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Game; 