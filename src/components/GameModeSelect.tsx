import React from 'react';

interface GameModeSelectProps {
  onSelectMode: (mode: 'cpu' | 'player') => void;
}

const GameModeSelect: React.FC<GameModeSelectProps> = ({ onSelectMode }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255,255,255,0.9)',
      padding: '30px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 0 20px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Select Game Mode</h2>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={() => onSelectMode('player')}
          style={{
            padding: '12px 24px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Player vs Player
        </button>
        <button
          onClick={() => onSelectMode('cpu')}
          style={{
            padding: '12px 24px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Player vs CPU
        </button>
      </div>
    </div>
  );
};

export default GameModeSelect; 