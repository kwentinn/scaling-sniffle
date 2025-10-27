import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import './ConnectFour.css';

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

  function checkWin(row, col, player) {
    // Check horizontal
    const horizontal = checkDirection(row, col, player, 0, 1);
    if (horizontal.length >= 4) return horizontal;

    // Check vertical
    const vertical = checkDirection(row, col, player, 1, 0);
    if (vertical.length >= 4) return vertical;

    // Check diagonal (/)
    const diagonal1 = checkDirection(row, col, player, -1, 1);
    if (diagonal1.length >= 4) return diagonal1;

    // Check diagonal (\)
    const diagonal2 = checkDirection(row, col, player, 1, 1);
    if (diagonal2.length >= 4) return diagonal2;

    return [];
  }

  function checkDirection(row, col, player, rowDir, colDir) {
    const cells = [[row, col]];
    
    // Check in positive direction
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      cells.push([r, c]);
      r += rowDir;
      c += colDir;
    }

    // Check in negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      cells.push([r, c]);
      r -= rowDir;
      c -= colDir;
    }

    return cells;
  }

  function isBoardFull() {
    return board[0].every(cell => cell !== EMPTY);
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
      const winCells = checkWin(row, col, currentPlayer);
      if (winCells.length >= 4) {
        setWinner(currentPlayer);
        setWinningCells(winCells);
        setGameOver(true);
        triggerConfetti();
      } else if (isBoardFull()) {
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
    <div className="connect-four">
      <div className="game-status">
        {winner ? (
          <h2 className="winner-message">{t('wins', { player: winner })}</h2>
        ) : gameOver ? (
          <h2 className="draw-message">{t('draw')}</h2>
        ) : (
          <h2>
            {t('currentTurn')}: <span className={`player-indicator player${currentPlayer}`}>
              {t('player')} {currentPlayer}
            </span>
          </h2>
        )}
      </div>

      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell === PLAYER1 ? 'player1' : cell === PLAYER2 ? 'player2' : ''} ${
                  isWinningCell(rowIndex, colIndex) ? 'winning' : ''
                }`}
                onClick={() => handleColumnClick(colIndex)}
                role="button"
                tabIndex={0}
                aria-label={t('dropPiece', { column: colIndex + 1 })}
              >
                {cell !== EMPTY && <div className="piece" />}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="new-game-btn" onClick={resetGame}>
        {t('newGame')}
      </button>
    </div>
  );
};

export default ConnectFour;
