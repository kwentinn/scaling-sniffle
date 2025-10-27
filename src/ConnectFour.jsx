import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

const GRAVITY_DOWN = 'down';
const GRAVITY_UP = 'up';
const GRAVITY_LEFT = 'left';
const GRAVITY_RIGHT = 'right';

const ConnectFour = () => {
  const { t } = useTranslation();
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [gravity, setGravity] = useState(GRAVITY_DOWN);
  const [gravityChanged, setGravityChanged] = useState(false);

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

  function getEmptyPositionWithGravity(rowOrCol) {
    switch (gravity) {
      case GRAVITY_DOWN:
        // Original behavior: pieces fall down
        return getLowestEmptyRow(rowOrCol);
      
      case GRAVITY_UP:
        // Pieces fall up (to the top)
        for (let row = 0; row < ROWS; row++) {
          if (board[row][rowOrCol] === EMPTY) {
            return row;
          }
        }
        return -1;
      
      case GRAVITY_LEFT:
        // Pieces fall left
        for (let col = 0; col < COLS; col++) {
          if (board[rowOrCol][col] === EMPTY) {
            return col;
          }
        }
        return -1;
      
      case GRAVITY_RIGHT:
        // Pieces fall right
        for (let col = COLS - 1; col >= 0; col--) {
          if (board[rowOrCol][col] === EMPTY) {
            return col;
          }
        }
        return -1;
      
      default:
        return getLowestEmptyRow(rowOrCol);
    }
  }

  function changeGravityRandomly() {
    const directions = [GRAVITY_DOWN, GRAVITY_UP, GRAVITY_LEFT, GRAVITY_RIGHT];
    const newGravity = directions[Math.floor(Math.random() * directions.length)];
    setGravity(newGravity);
    setGravityChanged(true);
    
    // Reset the flag after animation
    setTimeout(() => {
      setGravityChanged(false);
    }, 3000);
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

    let row, newCol;
    const newBoard = board.map(r => [...r]);

    if (gravity === GRAVITY_LEFT || gravity === GRAVITY_RIGHT) {
      // For horizontal gravity, col becomes the row index
      row = col;
      newCol = getEmptyPositionWithGravity(row);
      if (newCol === -1) return; // Row is full
      newBoard[row][newCol] = currentPlayer;
    } else {
      // For vertical gravity (up/down), col stays as column
      row = getEmptyPositionWithGravity(col);
      if (row === -1) return; // Column is full
      newCol = col;
      newBoard[row][newCol] = currentPlayer;
    }

    setBoard(newBoard);
    
    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);
    
    // Check for gravity change event after turn 10
    if (newTurnCount > 0 && newTurnCount % 10 === 0) {
      changeGravityRandomly();
    }

    // Update board first, then check win
    setTimeout(() => {
      const winCells = checkWin(row, newCol, currentPlayer, newBoard);
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
    setTurnCount(0);
    setGravity(GRAVITY_DOWN);
    setGravityChanged(false);
  }

  function isWinningCell(row, col) {
    return winningCells.some(([r, c]) => r === row && c === col);
  }

  function getGravityIcon(direction) {
    switch (direction) {
      case GRAVITY_DOWN: return '⬇️';
      case GRAVITY_UP: return '⬆️';
      case GRAVITY_LEFT: return '⬅️';
      case GRAVITY_RIGHT: return '➡️';
      default: return '⬇️';
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="min-h-[60px] flex items-center justify-center">
        {winner ? (
          <h2 className="text-3xl max-md:text-2xl m-0 text-green-500 animate-pulse">{t('wins', { player: winner })}</h2>
        ) : gameOver ? (
          <h2 className="text-3xl max-md:text-2xl m-0 text-amber-500">{t('draw')}</h2>
        ) : (
          <h2 className="text-3xl max-md:text-xl m-0 text-gray-800">
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

      {/* Gravity indicator */}
      <div className="flex items-center gap-4 text-lg">
        <span className="font-semibold text-gray-700">{t('gravity')}:</span>
        <span className={`px-4 py-2 rounded-lg font-bold transition-all ${
          gravityChanged ? 'bg-purple-500 text-white animate-bounce' : 'bg-gray-200 text-gray-800'
        }`}>
          {t(`gravity_${gravity}`)} {getGravityIcon(gravity)}
        </span>
        <span className="text-sm text-gray-500">{t('turn')}: {turnCount}</span>
      </div>

      {/* Gravity change notification */}
      {gravityChanged && (
        <div className="bg-purple-100 border-2 border-purple-500 rounded-lg px-6 py-3 animate-pulse">
          <p className="text-purple-700 font-bold m-0">{t('gravityChangeEvent')}</p>
        </div>
      )}

      <div className="bg-blue-600 p-4 rounded-2xl shadow-xl flex flex-col gap-2 max-md:p-2 max-md:gap-1.5 max-sm:p-1.5 max-sm:gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 max-md:gap-1.5 max-sm:gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-[70px] h-[70px] max-md:w-[50px] max-md:h-[50px] max-sm:w-10 max-sm:h-10 bg-white rounded-full cursor-pointer flex items-center justify-center transition-transform duration-100 relative hover:scale-105 ${
                  cell === PLAYER1 ? 'bg-red-50' : cell === PLAYER2 ? 'bg-amber-50' : ''
                } ${
                  isWinningCell(rowIndex, colIndex) ? 'winning-cell' : ''
                }`}
                onClick={() => handleColumnClick(colIndex)}
                role="button"
                tabIndex={0}
                aria-label={t('dropPiece', { column: colIndex + 1 })}
              >
                {cell !== EMPTY && (
                  <div 
                    className={`w-4/5 h-4/5 rounded-full absolute drop-animation ${
                      cell === PLAYER1 ? 'piece-player1' : 'piece-player2'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button 
        className="px-8 py-3 max-md:px-6 max-md:py-2.5 text-lg max-md:text-base font-bold bg-green-500 text-white border-none rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        onClick={resetGame}
      >
        {t('newGame')}
      </button>

      <style>{`
        .drop-animation {
          animation: drop 0.3s ease-out;
        }

        .winning-cell {
          animation: winning-cell 0.6s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
        }

        .piece-player1 {
          background: radial-gradient(circle at 30% 30%, #f87171, #ef4444);
          box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.3);
        }

        .piece-player2 {
          background: radial-gradient(circle at 30% 30%, #fde047, #fbbf24);
          box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.2);
        }

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
      `}</style>
    </div>
  );
};

export default ConnectFour;
