import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Utility to create a 2D array of a given size
const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.7 ? 1 : 0))
  );
};

const GameOfLife = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  useEffect(() => {
    // Set grid size based on window size
    const calculateSize = () => {
      const cellSize = 20;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setRows(Math.floor(height / cellSize));
      setCols(Math.floor(width / cellSize));
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);

    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  useEffect(() => {
    // Initialize grid after the rows and cols are set
    if (rows && cols) {
      setGrid(createGrid(rows, cols));
    }
  }, [rows, cols]);

  // Memoize getNeighbors to avoid recreating it on every render
  const getNeighbors = useCallback((grid, x, y) => {
    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];

    return directions.reduce((acc, [dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        acc += grid[newX][newY];
      }
      return acc;
    }, 0);
  }, [rows, cols]);

  // Memoize updateGrid and include getNeighbors in the dependency array
  const updateGrid = useCallback(() => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const liveNeighbors = getNeighbors(grid, rowIndex, colIndex);
        if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
          return 0;
        }
        if (cell === 0 && liveNeighbors === 3) {
          return 1;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  }, [grid, getNeighbors]);

  // Use a timer to update the grid at intervals
  useEffect(() => {
    const intervalId = setInterval(updateGrid, 100);
    return () => clearInterval(intervalId);
  }, [updateGrid]);

  return (
    <div className="game-board">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell ? 'alive' : ''}`}
          />
        ))
      )}
    </div>
  );
};

export default GameOfLife;
