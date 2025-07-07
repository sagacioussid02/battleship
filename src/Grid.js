import React from 'react';
import './Grid.css';

const Grid = ({ grid, onCellClick, showShips, isOpponent, shipImages }) => {
  return (
    <div className={`grid-container${isOpponent ? ' opponent' : ''}`}> 
      {grid.map((row, rowIndex) => (
        <div className="grid-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              className={`grid-cell ${cell.hit ? (cell.ship ? 'hit' : 'miss') : ''} ${showShips && cell.ship ? 'ship' : ''}`}
              key={colIndex}
              onClick={() => onCellClick && onCellClick(rowIndex, colIndex)}
            >
              {showShips && cell.ship && shipImages && shipImages[cell.ship] && (
                <img src={shipImages[cell.ship]} alt={cell.ship} style={{ width: 24, height: 24 }} />
              )}
              {cell.hit && cell.ship && '💥'}
              {cell.hit && !cell.ship && '❌'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
