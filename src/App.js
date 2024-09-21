import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Material UI start icon
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // Material UI reset icon

// Utility to create an empty grid of a given size
const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
};

// Utility to create a random grid for resetting
const createRandomGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.7 ? 1 : 0))
  );
};

const GameOfLife = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // Track if the game is running
  const [generation, setGeneration] = useState(0);  // Track the number of generations
  const [population, setPopulation] = useState(0);  // Track the population (live cells)

  // Initialize the grid size based on the window size
  useEffect(() => {
    const calculateSize = () => {
      const cellSize = 10; // Smaller cell size for a larger grid
      const width = window.innerWidth - 100; // Subtract the sidebar width
      const height = window.innerHeight;
      setRows(Math.floor(height / cellSize));
      setCols(Math.floor(width / cellSize));
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);

    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  // Initialize the empty grid once rows and cols are set
  useEffect(() => {
    if (rows && cols) {
      const emptyGrid = createEmptyGrid(rows, cols);
      setGrid(emptyGrid);
    }
  }, [rows, cols]);

  // Memoize getNeighbors to avoid recreating it on every render
  const getNeighbors = useCallback((grid, x, y) => {
    const directions = [
      [0, 1], [1, 1], [1, 0], [1, -1],
      [0, -1], [-1, -1], [-1, 0], [-1, 1],
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
    setGrid((oldGrid) => {
      let newGrid = oldGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const liveNeighbors = getNeighbors(oldGrid, rowIndex, colIndex);
          if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
            return 0; // Cell dies
          }
          if (cell === 0 && liveNeighbors === 3) {
            return 1; // Cell is born
          }
          return cell; // Cell survives
        })
      );

      // Update generation and population count
      setGeneration((prev) => prev + 1); // Increment generation
      const currentPopulation = newGrid.flat().reduce((acc, cell) => acc + cell, 0); // Count live cells
      setPopulation(currentPopulation);

      return newGrid;
    });
  }, [getNeighbors]);

  // Use a timer to update the grid at intervals
  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(updateGrid, 100);
      return () => clearInterval(intervalId);
    }
  }, [updateGrid, isRunning]);

  // Start the game and initialize a random grid
  const handleStart = () => {
    setIsRunning(true);
    setGrid(createRandomGrid(rows, cols));
    setGeneration(0); // Reset the generation count
    setPopulation(0); // Reset the population count
  };

  // Reset the game to a random grid and restart the game
  const handleReset = () => {
    setIsRunning(false); // Temporarily stop the game
    setTimeout(() => {
      setGrid(createRandomGrid(rows, cols)); // Reset to a random grid
      setGeneration(0); // Reset the generation count
      setPopulation(0); // Reset the population count
      setIsRunning(true); // Restart the game
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Game board */}
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

      {/* Sidebar */}
      <div className="sidebar">
        <div className="counters">
          <p>Generation: {generation}</p>
          <p>Population: {population}</p>
        </div>

        {!isRunning ? (
          <button className="sidebar-button" onClick={handleStart}>
            <PlayArrowIcon style={{ fontSize: 48 }} /> {/* Start icon */}
          </button>
        ) : (
          <button className="sidebar-button" onClick={handleReset}>
            <RestartAltIcon style={{ fontSize: 48 }} /> {/* Reset icon */}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOfLife;
