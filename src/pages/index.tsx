import { useState } from 'react';
import styles from './index.module.css';

const startBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

// const testBoard = [
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 2, 2, 2],
//   [0, 0, 0, 1, 1, 1, 2, 1],
//   [0, 0, 0, 2, 2, 2, 2, 1],
//   [0, 0, 0, 0, 0, 0, 1, 1],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
// ];

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
//[cy][cx]に石を置くことが可能かどうか判断し可能な場合trueを返す
const checkPutable = (cx: number, cy: number, board: number[][], turn: number) => {
  if (board[cy][cx] === 1 || board[cy][cx] === 2) {
    return false;
  }
  for (const direction of DIRECTIONS) {
    const dx = direction[0];
    const dy = direction[1];
    if (board[cy + dy] === undefined) continue;
    if (board[cy + dy][cx + dx] === 3 - turn) {
      for (let distance = 1; distance < 8; distance++) {
        if (board[cy + dy * distance] === undefined) break;
        if (board[cy + dy * distance][cx + dx * distance] === 0) break;
        if (board[cy + dy * distance][cx + dx * distance] === 3 - turn) continue;
        if (board[cy + dy * distance][cx + dx * distance] === turn) {
          return true;
        }
      }
    }
  }
  return false;
};
//石をおいてひっくり返す動作
const turnCell = (cx: number, cy: number, board: number[][], turn: number) => {
  const canTurn: [number, number][] = [];
  if (checkPutable(cx, cy, board, turn)) {
    for (const direction of DIRECTIONS) {
      const dx = direction[0];
      const dy = direction[1];
      for (let distance = 1; distance < 8; distance++) {
        if (board[cy + dy * distance] === undefined) break;
        if (board[cy + dy * distance][cx + dx * distance] === 0) break;
        if (board[cy + dy * distance][cx + dx * distance] === 3 - turn) continue;
        if (board[cy + dy * distance][cx + dx * distance] === turn) {
          canTurn.push([cy, cx]);
          for (let i = distance; i > 0; i--) canTurn.push([cy + dy * i, cx + dx * i]);
        }
      }
    }
  }
  for (const [y, x] of canTurn) {
    board[y][x] = turn;
  }
  return true;
};

const Home = () => {
  const [board, setBoard] = useState(startBoard);
  const [turn, setTurn] = useState(1);

  const closeModal = () => {
    setBoard(startBoard);
    setTurn(1);
  };

  const boardReset = () => {
    setBoard(startBoard);
    setTurn(1);
  };

  const handleOnClick = (x: number, y: number) => {
    if (board[y][x] !== 0 || checkPutable(x, y, board, turn) === false) {
      return;
    }
    const newBoard = structuredClone(board);
    if (turnCell(x, y, newBoard, turn)) {
      newBoard[y][x] = turn;
    }
    setBoard(newBoard);
    setTurn(3 - turn);
  };

  const boardView = structuredClone(board);
  const values = {
    blackCell: 0,
    whiteCell: 0,
    puttableCell: 0,
    nextPuttableCell: 0,
    isSkip: false,
    winner: 'none',
  };
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      if (checkPutable(cx, cy, board, turn)) boardView[cy][cx] = 3;
    }
  }
  values.blackCell = boardView.flat().filter((num) => num === 1).length;
  values.whiteCell = boardView.flat().filter((num) => num === 2).length;
  values.puttableCell = boardView.flat().filter((num) => num === 3).length;

  if (values.whiteCell < values.blackCell) {
    values.winner = '黒';
  } else if (values.blackCell < values.whiteCell) {
    values.winner = '白';
  } else {
    values.winner = '引き分け';
  }
  // スキップについての処理
  if (values.puttableCell === 0) {
    for (let cy = 0; cy < 8; cy++) {
      for (let cx = 0; cx < 8; cx++) {
        if (checkPutable(cx, cy, board, 3 - turn))
          values.nextPuttableCell = values.nextPuttableCell + 1;
      }
    }
    if (values.nextPuttableCell === 0) values.isSkip = true;
    else {
      setTurn(3 - turn);
    }
  }
  const isEnd =
    values.whiteCell === 0 ||
    values.blackCell === 0 ||
    values.whiteCell + values.blackCell === 64 ||
    values.isSkip === true;
  return (
    <>
      <div className={styles.container}>
        {isEnd ? (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h1>ゲーム終了</h1>
              </div>
              <div className={styles.modalBody}>
                <p>
                  黒の数{values.blackCell} 対 白の数{values.whiteCell}で
                </p>
                <h2>
                  {values.winner === '白' || values.winner === '黒'
                    ? `${JSON.stringify(values.winner)}の勝ち!!`
                    : '引き分け'}
                </h2>
                <span className={styles.modalClose} onClick={closeModal}>
                  閉じる
                </span>
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles.board}>
          {boardView.map((row, y) =>
            row.map((color, x) => (
              <div key={`${x}-${y}`} className={styles.cell} onClick={() => handleOnClick(x, y)}>
                <div
                  className={styles.stone}
                  style={{
                    backgroundColor:
                      color === 1
                        ? '#212b33'
                        : color === 2
                          ? 'white'
                          : color === 3
                            ? '#d86161'
                            : '',
                    width: color === 3 ? '30%' : '70%',
                    height: color === 3 ? '30%' : '70%',
                  }}
                />
              </div>
            )),
          )}
        </div>
        <div className={styles.infomation}>
          <div className={styles.showInformation}>
            <p>{turn === 1 ? '黒のターン' : '白のターン'}</p>
            <p>黒：{values.blackCell}枚</p>
            <p>白：{values.whiteCell}枚</p>
          </div>
          <button className={styles.reset} onClick={boardReset}>
            盤面をリセットする
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
