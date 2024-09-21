
# Game of Life - React Version

## Description
This project is a React implementation of Conway's **Game of Life** with a sleek, modern **black and neon green theme**. It features a dynamic grid that adapts to the size of the screen, as well as interactive controls such as a start button to begin the simulation and a reset button to restart it. The game is controlled via a sidebar containing Material UI icons for starting and resetting the game.

## Features
- **Responsive grid**: The grid adjusts dynamically based on the size of the user's screen.
- **Black and neon green theme**: A modern, cool design for adults.
- **Start and Reset buttons**: Interactive controls for starting and restarting the game, with a sidebar for easy access.
- **Game logic**: Follows Conway's Game of Life rules, including cell birth, death, and survival based on neighbors.
  
## Technologies Used
- **React**: The front-end framework used for the entire application.
- **Material UI**: Used for icons such as the play (start) and reset buttons.
- **CSS Flexbox**: Used for layout design and responsive elements.
  
## How to Run the Project

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd game-of-life-react
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Run the app:
    ```bash
    npm start
    ```

4. Open `http://localhost:3000` in your browser to view the game.

## Project Structure
- **App.js**: Main React component containing the game logic, grid rendering, and button controls.
- **App.css**: Styling for the application, including the theme, grid, and sidebar.

## Conway's Game of Life Rules:
- **Birth**: A dead cell with exactly three live neighbors becomes a live cell.
- **Survival**: A live cell with two or three live neighbors stays alive.
- **Death**: A live cell with fewer than two or more than three live neighbors dies.

## Future Enhancements
- Add more interactive features such as manual cell toggling.
- Implement speed controls for faster or slower simulation.
- Add the ability to load predefined patterns or save current progress.

## License
This project is licensed under the MIT License.
