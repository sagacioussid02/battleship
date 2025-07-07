import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';
import ShipSelection from './ShipSelection';
import ReadyButton from './ReadyButton';
import MessageDisplay from './MessageDisplay';
import './Grid.css';

const SHIPS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];

const GRID_SIZE = 10;

const SHIP_IMAGES = {
  Carrier: process.env.PUBLIC_URL + '/ships/carrier.png',
  Battleship: process.env.PUBLIC_URL + '/ships/battleship.png',
  Cruiser: process.env.PUBLIC_URL + '/ships/cruiser.png',
  Submarine: process.env.PUBLIC_URL + '/ships/submarine.png',
  Destroyer: process.env.PUBLIC_URL + '/ships/destroyer.png',
};

function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({ ship: null, hit: false }))
  );
}

function App() {
  // UI state
  const [playerGrid, setPlayerGrid] = useState(createEmptyGrid());
  const [computerGrid, setComputerGrid] = useState(createEmptyGrid());
  const [selectedShip, setSelectedShip] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [phase, setPhase] = useState('placement'); // 'placement' | 'battle'
  const [message, setMessage] = useState('Place your ships!');
  const [placementDirection, setPlacementDirection] = useState('horizontal'); // 'horizontal' | 'vertical'

  // Helper: find ship cells for undo
  function getShipCells(grid, shipName) {
    const cells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c].ship === shipName) {
          cells.push([r, c]);
        }
      }
    }
    return cells;
  }

  // Place or undo ship
  const handlePlayerCellClick = (row, col) => {
    if (phase !== 'placement') return;
    const shipObj = SHIPS.find(s => s.name === selectedShip);
    if (!shipObj) return;
    // Undo: If clicking on a cell that already contains this ship, remove it
    if (playerGrid[row][col].ship === selectedShip) {
      const newGrid = playerGrid.map(r => r.map(c => ({ ...c })));
      for (const [r, c] of getShipCells(playerGrid, selectedShip)) {
        newGrid[r][c].ship = null;
      }
      setPlayerGrid(newGrid);
      setPlacedShips(placedShips.filter(name => name !== selectedShip));
      setSelectedShip(selectedShip); // keep selected for re-placement
      setMessage(`${selectedShip} removed. Place again.`);
      return;
    }
    // Only allow placement if ship is selected and not already placed
    if (!selectedShip || placedShips.includes(selectedShip)) return;
    // Check boundaries
    if (placementDirection === 'horizontal') {
      if (col + shipObj.size > GRID_SIZE) {
        setMessage('Ship does not fit!');
        return;
      }
    } else {
      if (row + shipObj.size > GRID_SIZE) {
        setMessage('Ship does not fit!');
        return;
      }
    }
    // Check overlap
    for (let i = 0; i < shipObj.size; i++) {
      const r = placementDirection === 'horizontal' ? row : row + i;
      const c = placementDirection === 'horizontal' ? col + i : col;
      if (playerGrid[r][c].ship) {
        setMessage('Ships cannot overlap!');
        return;
      }
    }
    // Place ship
    const newGrid = playerGrid.map(r => r.map(c => ({ ...c })));
    for (let i = 0; i < shipObj.size; i++) {
      const r = placementDirection === 'horizontal' ? row : row + i;
      const c = placementDirection === 'horizontal' ? col + i : col;
      newGrid[r][c].ship = shipObj.name;
    }
    setPlayerGrid(newGrid);
    setPlacedShips([...placedShips, shipObj.name]);
    setSelectedShip(null); // unselect after placement
    setMessage(`${shipObj.name} placed!`);
  };

  // Place computer ships randomly
  function placeComputerShips() {
    const newGrid = createEmptyGrid();
    for (const ship of SHIPS) {
      let placed = false;
      while (!placed) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = direction === 'horizontal'
          ? Math.floor(Math.random() * GRID_SIZE)
          : Math.floor(Math.random() * (GRID_SIZE - ship.size + 1));
        const col = direction === 'horizontal'
          ? Math.floor(Math.random() * (GRID_SIZE - ship.size + 1))
          : Math.floor(Math.random() * GRID_SIZE);
        // Check overlap
        let overlap = false;
        for (let i = 0; i < ship.size; i++) {
          const r = direction === 'horizontal' ? row : row + i;
          const c = direction === 'horizontal' ? col + i : col;
          if (newGrid[r][c].ship) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          for (let i = 0; i < ship.size; i++) {
            const r = direction === 'horizontal' ? row : row + i;
            const c = direction === 'horizontal' ? col + i : col;
            newGrid[r][c].ship = ship.name;
          }
          placed = true;
        }
      }
    }
    return newGrid;
  }

  // Helper: check if all ships are sunk
  function allShipsSunk(grid) {
    for (let row of grid) {
      for (let cell of row) {
        if (cell.ship && !cell.hit) return false;
      }
    }
    return true;
  }

  // AI random attack
  function aiAttack() {
    let available = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!playerGrid[r][c].hit) available.push([r, c]);
      }
    }
    if (available.length === 0) return;
    const [row, col] = available[Math.floor(Math.random() * available.length)];
    const newGrid = playerGrid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].hit = true;
    setPlayerGrid(newGrid);
    if (playerGrid[row][col].ship) {
      setMessage('Opponent hit your ship!');
    } else {
      setMessage('Opponent missed!');
    }
    // End game check
    if (allShipsSunk(newGrid)) {
      setMessage('Game over! Opponent wins!');
      setPhase('gameover');
    }
  }

  // Handle Ready button
  const handleReady = () => {
    if (placedShips.length !== SHIPS.length) return;
    setPhase('battle');
    setComputerGrid(placeComputerShips());
    setMessage('Opponent is ready! Start attacking!');
  };

  // Handle attack on computer grid
  const handleAttack = (row, col) => {
    if (phase !== 'battle') return;
    const cell = computerGrid[row][col];
    if (cell.hit) {
      setMessage('You already attacked this cell!');
      return;
    }
    const newGrid = computerGrid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].hit = true;
    setComputerGrid(newGrid);
    if (cell.ship) {
      setMessage('Hit!');
    } else {
      setMessage('Miss!');
    }
    // Check for game over
    if (allShipsSunk(newGrid)) {
      setMessage('Congratulations! You sank all enemy ships!');
      setPhase('gameover');
    } else {
      // AI turn
      setTimeout(aiAttack, 1000);
    }
  };

  // Restart game
  const handleRestart = () => {
    setPlayerGrid(createEmptyGrid());
    setComputerGrid(createEmptyGrid());
    setSelectedShip(null);
    setPlacedShips([]);
    setPhase('placement');
    setMessage('Place your ships!');
  };

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <div className="game-board">
        <div className="grid-container">
          <div className="grid-header">Your Ships</div>
          <div className="grid">
            <Grid
              grid={playerGrid}
              onCellClick={handlePlayerCellClick}
              showShips={true}
            />
          </div>
        </div>
        <div className="grid-container">
          <div className="grid-header">Enemy Ships</div>
          <div className="grid">
            <Grid
              grid={computerGrid}
              onCellClick={handleAttack}
              showShips={false}
            />
          </div>
        </div>
      </div>
      <div className="controls">
        {phase === 'placement' && (
          <div>
            <ShipSelection
              selectedShip={selectedShip}
              placedShips={placedShips}
              onSelect={setSelectedShip}
              shipImages={SHIP_IMAGES}
            />
            <div style={{ margin: '10px 0' }}>
              <button
                onClick={() => setPlacementDirection('horizontal')}
                style={{
                  background: placementDirection === 'horizontal' ? '#1976d2' : '#e3f2fd',
                  color: placementDirection === 'horizontal' ? '#fff' : '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: 6,
                  padding: '8px 16px',
                  marginRight: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Horizontal
              </button>
              <button
                onClick={() => setPlacementDirection('vertical')}
                style={{
                  background: placementDirection === 'vertical' ? '#1976d2' : '#e3f2fd',
                  color: placementDirection === 'vertical' ? '#fff' : '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Vertical
              </button>
            </div>
            <MessageDisplay message={message} />
          </div>
        )}
        {phase === 'battle' && (
          <MessageDisplay message={message} />
        )}
        {phase === 'gameover' && (
          <div>
            <MessageDisplay message={message} />
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
        {phase === 'placement' && (
          <ReadyButton
            disabled={placedShips.length !== SHIPS.length}
            onClick={handleReady}
          />
        )}
      </div>
      {phase === 'placement' && (
        <div className="instructions">
          <p>Instructions:</p>
          <ul>
            <li>Select a ship and place it on your grid.</li>
            <li>Ships can only be placed horizontally or vertically.</li>
            <li>Once all ships are placed, press "Ready" to start the game.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
