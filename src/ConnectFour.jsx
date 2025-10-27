import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

const ConnectFour = () => {
  const { t } = useTranslation();
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  function createEmptyBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
  }

  function getLowestEmptyRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        return row;
      }
    }
    return -1;
  }

  function checkWin(row, col, player, boardState) {
    // Check horizontal
    const horizontal = checkDirection(row, col, player, 0, 1, boardState);
    if (horizontal.length >= 4) return horizontal;

    // Check vertical
    const vertical = checkDirection(row, col, player, 1, 0, boardState);
    if (vertical.length >= 4) return vertical;

    // Check diagonal (/)
    const diagonal1 = checkDirection(row, col, player, -1, 1, boardState);
    if (diagonal1.length >= 4) return diagonal1;

    // Check diagonal (\)
    const diagonal2 = checkDirection(row, col, player, 1, 1, boardState);
    if (diagonal2.length >= 4) return diagonal2;

    return [];
  }

  function checkDirection(row, col, player, rowDir, colDir, boardState) {
    const cells = [[row, col]];
    
    // Check in positive direction
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
      cells.push([r, c]);
      r += rowDir;
      c += colDir;
    }

    // Check in negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && boardState[r][c] === player) {
      cells.push([r, c]);
      r -= rowDir;
      c -= colDir;
    }

    return cells;
  }

  function isBoardFull(boardState) {
    return boardState[0].every(cell => cell !== EMPTY);
  }

  function handleColumnClick(col) {
    if (gameOver) return;

    const row = getLowestEmptyRow(col);
    if (row === -1) return; // Column is full

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Update board first, then check win
    setTimeout(() => {
      const winCells = checkWin(row, col, currentPlayer, newBoard);
      if (winCells.length >= 4) {
        setWinner(currentPlayer);
        setWinningCells(winCells);
        setGameOver(true);
        triggerConfetti();
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
      } else {
        setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
      }
    }, 50);
  }

  function triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER1);
    setWinner(null);
    setWinningCells([]);
    setGameOver(false);
  }

  function isWinningCell(row, col) {
    return winningCells.some(([r, c]) => r === row && c === col);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="min-h-[60px] flex items-center justify-center">
        {winner ? (
          <h2 className="text-[1.8rem] m-0 text-green-500 animate-pulse">{t('wins', { player: winner })}</h2>
        ) : gameOver ? (
          <h2 className="text-[1.8rem] m-0 text-amber-500">{t('draw')}</h2>
        ) : (
          <h2 className="text-[1.8rem] m-0 text-gray-800 md:text-[1.3rem]">
            {t('currentTurn')}: <span className={`font-bold py-1.5 px-3 rounded-lg ${
              currentPlayer === PLAYER1 
                ? 'bg-red-500 text-white' 
                : 'bg-amber-300 text-gray-800'
            }`}>
              {t('player')} {currentPlayer}
            </span>
          </h2>
        )}
      </div>

      <div className="bg-blue-600 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col gap-2">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-[70px] h-[70px] bg-white rounded-full cursor-pointer flex items-center justify-center transition-transform duration-100 relative hover:scale-105 md:w-[50px] md:h-[50px] sm:w-10 sm:h-10 ${
                  cell === PLAYER1 ? 'bg-red-50' : cell === PLAYER2 ? 'bg-amber-50' : ''
                } ${
                  isWinningCell(rowIndex, colIndex) ? 'animate-[winning-cell_0.6s_ease-in-out_infinite] shadow-[0_0_20px_rgba(34,197,94,0.8)]' : ''
                }`}
                onClick={() => handleColumnClick(colIndex)}
                role="button"
                tabIndex={0}
                aria-label={t('dropPiece', { column: colIndex + 1 })}
              >
                {cell !== EMPTY && (
                  <div className={`w-4/5 h-4/5 rounded-full absolute animate-[drop_0.3s_ease-out] ${
                    cell === PLAYER1 
                      ? 'bg-gradient-radial from-red-400 to-red-500 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)]'
                      : 'bg-gradient-radial from-yellow-200 to-amber-400 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.2)]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button 
        className="px-8 py-3 text-[1.1rem] font-bold bg-green-500 text-white border-none rounded-lg cursor-pointer transition-all duration-200 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] active:translate-y-0 md:text-base md:px-6 md:py-2.5"
        onClick={resetGame}
      >
        {t('newGame')}
      </button>

      <style>{`
        @keyframes drop {
          from {
            transform: translateY(-500%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes winning-cell {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at 30% 30%, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default ConnectFour;
