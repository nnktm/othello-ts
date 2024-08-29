import { useState } from 'react';
import styles from './index.module.css';

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const Home = () => {
  const [board, setBoard] = useState([
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,2,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ]);

  const handleOnClick = (x: number, y:number) => {
    const newBoard = structuredClone(board);
    newBoard[y][x] = 1;
    setBoard(newBoard);
  }

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row,y) =>
        row.map((color,x) => (
          <div
            key={'${x}-${y}'}
            className={styles.cell}
            onClick={() => handleOnClick(x,y)}
          >
            <div className = {styles.stone} style={{backgroundColor: color === 1 ? 'black' : color === 2 ? 'white' :''}} /></div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
