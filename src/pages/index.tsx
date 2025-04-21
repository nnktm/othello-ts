import { useState } from 'react';
import styles from './index.module.css';

const startBord = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 0, 0],
  [0, 0, 3, 1, 1, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const DIRECTIONS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const showTurn = (turn: number) => {
  if (turn === 1) {
    return '黒';
  } else {
    return '白';
  }
};

const countCell = (cbx: number, cby: number, board: number[][]) => {
  if (board[cbx][cby] === 1) return 'black';
  if (board[cbx][cby] === 2) return 'white';
  if (board[cbx][cby] === 3) return 'putable';
  return null;
};

const checkPutable = (cx: number, cy: number, board: number[][], turn: number) => {
  if (board[cy][cx] === 1 || board[cy][cx] === 2) {
    return;
  }
  for (const direction of DIRECTIONS) {
    const dx = direction[0];
    const dy = direction[1];
    if (board[cy + dy] === undefined) continue;
    if (board[cy + dy][cx + dx] === 3 - turn) {
      for (let distance = 2; distance < 8; distance++) {
        if (board[cy + dy * distance] === undefined) break;
        if (
          board[cy + dy * distance][cx + dx * distance] === 3 ||
          board[cy + dy * distance][cx + dx * distance] === 0
        )
          break;
        if (board[cy + dy * distance][cx + dx * distance] === 3 - turn) continue;
        if (board[cy + dy * distance][cx + dx * distance] === turn) {
          return true;
        }
        return false;
      }
    }
  }
};

let blackCell = 2;

let whiteCell = 2;

let putableCell = 4;

let skipTurn = 0;

const Home = () => {
  const [board, setBoard] = useState(startBord);

  const [turn, setTurn] = useState(1);

  const handleOnClick = (x: number, y: number) => {
    if (board[y][x] !== 0 && board[y][x] !== 3) {
      return;
    }
    const newBoard = structuredClone(board);
    for (const direction of DIRECTIONS) {
      if (putableCell === 0) {
        skipTurn = skipTurn + 1;
        break;
      }
      const dx = direction[0];
      const dy = direction[1];
      if (newBoard[y + dy] === undefined) continue;
      if (newBoard[y + dy][x + dx] === 3 - turn) {
        for (let distance = 2; distance < 8; distance++) {
          let isok = true;
          if (newBoard[y + dy * distance] === undefined) break;
          if (newBoard[y + dy * distance][x + dx * distance] === turn) {
            for (let distanceCheck = 2; distanceCheck < distance; distanceCheck++) {
              if (
                newBoard[y + dy * distanceCheck][x + dx * distanceCheck] === 0 ||
                newBoard[y + dy * distanceCheck][x + dx * distanceCheck] === 3
              ) {
                isok = false;
              }
            }
            if (isok === true) {
              newBoard[y][x] = turn;
            }
            for (let i = distance; i > 0; i--) {
              newBoard[y + dy * i][x + dx * i] = turn;
            }
          }
        }
      }
    }
    if (skipTurn === 2) {
      setBoard(startBord);
      setTurn(1);
      blackCell = 2;
      whiteCell = 2;
      putableCell = 4;
    }
    if (skipTurn === 0 || skipTurn === 1) {
      blackCell = 0;
      whiteCell = 0;
      putableCell = 0;
      for (let cy = 0; cy < 8; cy++) {
        for (let cx = 0; cx < 8; cx++) {
          if (newBoard[cy][cx] === 3) newBoard[cy][cx] = 0;
          if (checkPutable(cx, cy, newBoard, 3 - turn)) newBoard[cy][cx] = 3;
          if (countCell(cx, cy, newBoard)) {
            if (countCell(cx, cy, newBoard) === 'black') {
              blackCell = blackCell + 1;
            }
            if (countCell(cx, cy, newBoard) === 'white') {
              whiteCell = whiteCell + 1;
            }
            if (countCell(cx, cy, newBoard) === 'putable') {
              putableCell = putableCell + 1;
            }
          }
        }
      }
      setBoard(newBoard);
      setTurn(3 - turn);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div key={'${x}-${y}'} className={styles.cell} onClick={() => handleOnClick(x, y)}>
              <div
                className={styles.stone}
                style={{
                  backgroundColor:
                    color === 1 ? '#3175AA' : color === 2 ? 'white' : color === 3 ? 'pink' : '',
                  width: color === 3 ? '20%' : '70%',
                  height: color === 3 ? '20%' : '70%',
                }}
              />
            </div>
          )),
        )}
      </div>
      <div className={styles.showInformation}>
        <p>{showTurn(turn)}のターン</p>
        <p>黒：{blackCell}枚</p>
        <p>白：{whiteCell}枚</p>
      </div>
    </div>
  );
};

export default Home;
