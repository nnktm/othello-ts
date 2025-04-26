import { useState } from 'react';
import styles from './index.module.css';

const startBord = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
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
  if (board[cbx][cby] === 3) return 'puttable';
  return null;
};

const checkPutable = (cx: number, cy: number, board: number[][], turn: number) => {
  if (board[cy][cx] === 1 || board[cy][cx] === 2) {
    return false;
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
  return false;
};

const showResult = (board: number[][]) => {
  let resultBlack = 0;
  let resultWhite = 0;
  for (let ey = 0; ey < 8; ey++) {
    for (let ex = 0; ex < 8; ex++) {
      if (board[ex][ey] === 1) {
        resultBlack = resultBlack + 1;
      }
      if (board[ex][ey] === 2) {
        resultWhite = resultWhite + 1;
      }
    }
  }
  let winner: string;
  if (resultWhite < resultBlack) {
    winner = '黒';
  } else if (resultBlack < resultWhite) {
    winner = '白';
  } else {
    winner = '引き分け';
  }
  return {
    black: resultBlack,
    white: resultWhite,
    winner,
  };
};

const Home = () => {
  const [board, setBoard] = useState(startBord);
  const [turn, setTurn] = useState(1);
  const [skip, setSkip] = useState(0);

  const result = showResult(board);

  const closeModal = () => {
    setBoard(startBord);
    setTurn(1);
    setSkip(0);
  };

  const boardReset = () => {
    setBoard(startBord);
    setTurn(1);
    setSkip(0);
  };

  const handleOnClick = (x: number, y: number) => {
    if (board[y][x] !== 0) {
      return;
    }

    const newBoard = structuredClone(board);
    for (const direction of DIRECTIONS) {
      // if (putableCell === 0) {
      //   setSkip(1);
      //   break;
      // }
      // if (putableCell === 0 && skip === 1) {
      //   setSkip(2);
      //   break;
      // }
      const dx = direction[0];
      const dy = direction[1];

      if (checkPutable(x, y, board, turn)) {
        for (let distance = 2; distance < 8; distance++) {
          if (board[y + dy * distance] === undefined) break;
          if (newBoard[y + dy * distance][x + dx * distance] === turn) {
            newBoard[y][x] = turn;
            for (let i = distance; i > 0; i--) {
              newBoard[y + dy * i][x + dx * i] = turn;
            }
          }
        }
      }
    }
    if (skip === 0 || skip === 1) {
      setBoard(newBoard);
      setTurn(3 - turn);
    }
  };

  const boardView = structuredClone(board);

  let blackCell = 0;
  let whiteCell = 0;
  // let puttableCell = 0;
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      if (checkPutable(cx, cy, board, turn)) boardView[cy][cx] = 3;
      if (countCell(cx, cy, board)) {
        if (countCell(cx, cy, board) === 'black') {
          blackCell = blackCell + 1;
        }
        if (countCell(cx, cy, board) === 'white') {
          whiteCell = whiteCell + 1;
        }
        //   if (countCell(cx, cy, board) === 'putable') {
        //     putableCell = putableCell + 1;
        //   }
      }
    }
  }

  const isEnd = skip === 2 || whiteCell === 0 || blackCell === 0 || whiteCell + blackCell === 64;
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
                  黒の数{result.black} 対 白の数{result.white}で
                </p>
                <h2>{result.winner}の勝ち!!</h2>
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
                      color === 1 ? '#3175AA' : color === 2 ? 'white' : color === 3 ? 'pink' : '',
                    width: color === 3 ? '50%' : '70%',
                    height: color === 3 ? '50%' : '70%',
                  }}
                />
              </div>
            )),
          )}
        </div>
        <div className={styles.infomation}>
          <div className={styles.showInformation}>
            <p>{showTurn(turn)}のターン</p>
            <p>黒：{blackCell}枚</p>
            <p>白：{whiteCell}枚</p>
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
