import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useState, useCallback, useEffect } from 'react';
import Board from './Board';
import GameModeSelect from './GameModeSelect';
import DynamicBackground from './DynamicBackground';

type GameMode = 'cpu' | 'player' | null;

const Game = () => {
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>(() => Math.random() < 0.5 ? 'X' : 'O');
  const [gameBoard, setGameBoard] = useState<(null | 'X' | 'O')[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null))
  );
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw!' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [lastWinner, setLastWinner] = useState<'X' | 'O' | null>(null);

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

  const getAvailableMoves = (board: (null | 'X' | 'O')[][]): [number, number][] => {
    const moves: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  };

  const minimax = (
    board: (null | 'X' | 'O')[][],
    depth: number,
    isMaximizing: boolean
  ): number => {
    if (checkWin(board, 'O')) return 10 - depth;
    if (checkWin(board, 'X')) return depth - 10;
    if (getAvailableMoves(board).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const [i, j] of getAvailableMoves(board)) {
        board[i][j] = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i][j] = null;
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const [i, j] of getAvailableMoves(board)) {
        board[i][j] = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i][j] = null;
      }
      return bestScore;
    }
  };

  const getCPUMove = (board: (null | 'X' | 'O')[][]): [number, number] => {
    let bestScore = -Infinity;
    let bestMove: [number, number] = [0, 0];

    for (const [i, j] of getAvailableMoves(board)) {
      board[i][j] = 'O';
      const score = minimax(board, 0, false);
      board[i][j] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [i, j];
      }
    }

    return bestMove;
  };

  const resetGame = () => {
    setGameBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setWinner(null);
    if (lastWinner) {
      setCurrentPlayer(lastWinner === 'X' ? 'O' : 'X');
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameBoard[x][y] !== null || winner) return;

    const newBoard = JSON.parse(JSON.stringify(gameBoard));
    newBoard[x][y] = currentPlayer;
    setGameBoard(newBoard);

    if (checkWin(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      setLastWinner(currentPlayer);
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

  // Add a new useEffect for initial CPU move
  useEffect(() => {
    // If game mode is CPU and O is selected to start (randomly), make the first move
    if (gameMode === 'cpu' && currentPlayer === 'O' && !winner && !gameBoard.flat().some(cell => cell !== null)) {
      const timer = setTimeout(() => {
        const [x, y] = getCPUMove(gameBoard);
        handleCellClick(x, y);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameMode]); // Only run when game mode changes

  // Keep the existing useEffect for subsequent CPU moves
  useEffect(() => {
    if (gameMode === 'cpu' && currentPlayer === 'O' && !winner) {
      // Only make a move if it's not the initial state (some moves have been made)
      if (gameBoard.flat().some(cell => cell !== null)) {
        const timer = setTimeout(() => {
          const [x, y] = getCPUMove(gameBoard);
          handleCellClick(x, y);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [currentPlayer, gameMode, winner]);

  const handleModeSelect = (mode: 'cpu' | 'player') => {
    setGameMode(mode);
    setCurrentPlayer(Math.random() < 0.5 ? 'X' : 'O');
    setGameBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setWinner(null);
    setLastWinner(null);
  };

  if (!gameMode) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#111' }}>
        <Canvas camera={{ position: [0, 5, 0], fov: 75 }}>
          <DynamicBackground />
        </Canvas>
        <GameModeSelect onSelectMode={handleModeSelect} />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 0], fov: 75 }}>
        <DynamicBackground />
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
          <strong>Mode:</strong> {gameMode === 'cpu' ? 'vs CPU' : 'vs Player'}<br />
          <strong>Score:</strong><br />
          Player X: {scores.X}<br />
          {gameMode === 'cpu' ? 'CPU' : 'Player O'}: {scores.O}<br />
          Draw: {scores.Draw}
        </div>
        {winner ? (
          <div style={{ marginBottom: '10px', color: '#2196f3' }}>
            {winner === 'Draw!' ? 'Draw!' : 
              `${winner === 'X' ? 'Player X' : (gameMode === 'cpu' ? 'CPU' : 'Player O')} wins!`}
          </div>
        ) : (
          <div style={{ marginBottom: '10px' }}>
            Current Player: {currentPlayer === 'X' ? 'Player X' : (gameMode === 'cpu' ? 'CPU' : 'Player O')}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
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
          <button 
            onClick={() => setGameMode(null)}
            style={{
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Change Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game; 