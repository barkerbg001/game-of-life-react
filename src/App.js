import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Material UI start icon
import PauseIcon from '@mui/icons-material/Pause'; // Material UI pause icon
import StopIcon from '@mui/icons-material/Stop'; // Material UI stop icon
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // Material UI reset icon
import TimerIcon from '@mui/icons-material/Timer'; // Material UI generation icon
import PeopleIcon from '@mui/icons-material/People'; // Material UI population icon
import { Tooltip } from '@mui/material'; // Material UI Tooltip

// Utility to create an empty grid of a given size
const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );
};

// Utility to create a random grid for spawning a population
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

  // Start the game or resume the game
  const handleStart = () => {
    if (population === 0) {
      // If no population, generate a new random grid
      setGrid(createRandomGrid(rows, cols));
    }
    setIsRunning(true); // Resume the game
  };

  // Pause the game (stop updating the grid)
  const handlePause = () => {
    setIsRunning(false);
  };

  // Reset the game to a random grid and restart the game
  const handleReset = () => {
    setGrid(createRandomGrid(rows, cols)); // Reset to a random grid
    setGeneration(0); // Reset the generation count
    setPopulation(0); // Reset the population count
    setIsRunning(true); // Automatically start after resetting
  };

  // Stop the game and reset everything to an empty grid
  const handleStop = () => {
    setIsRunning(false); // Stop the game
    setGrid(createEmptyGrid(rows, cols)); // Reset to an empty grid
    setGeneration(0); // Reset the generation count
    setPopulation(0); // Reset the population count
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
        {/* Play, Pause, Stop, and Reset buttons */}
        {!isRunning ? (
          <button className="sidebar-button" onClick={handleStart}>
            <PlayArrowIcon style={{ fontSize: 48 }} /> {/* Play icon */}
          </button>
        ) : (
          <button className="sidebar-button" onClick={handlePause}>
            <PauseIcon style={{ fontSize: 48 }} /> {/* Pause icon */}
          </button>
        )}
        <button className="sidebar-button" onClick={handleStop}>
          <StopIcon style={{ fontSize: 48 }} /> {/* Stop icon */}
        </button>
        <button className="sidebar-button" onClick={handleReset}>
          <RestartAltIcon style={{ fontSize: 48 }} /> {/* Reset icon */}
        </button>

        {/* Tooltip for generation counter */}
        <Tooltip title="Generation" arrow>
          <div className="counter">
            <TimerIcon style={{ fontSize: 48, color: '#39ff14' }} />
            <p>{generation}</p>
          </div>
        </Tooltip>

        {/* Tooltip for population counter */}
        <Tooltip title="Population" arrow>
          <div className="counter">
            <PeopleIcon style={{ fontSize: 48, color: '#39ff14' }} />
            <p>{population}</p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default GameOfLife;
