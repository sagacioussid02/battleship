import React from 'react';
import './ShipSelection.css';

const ships = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
];

const ShipSelection = ({ selectedShip, placedShips = [], onSelect, shipImages }) => (
  <div className="ship-selection">
    {ships.map((ship) => (
      <button
        key={ship.name}
        className={`ship-btn${selectedShip === ship.name ? ' selected' : ''}`}
        disabled={placedShips && placedShips.includes(ship.name)}
        onClick={() => onSelect(ship.name)}
      >
        {shipImages && shipImages[ship.name] && (
          <img src={shipImages[ship.name]} alt={ship.name} style={{ width: 24, height: 24, marginRight: 6, verticalAlign: 'middle' }} />
        )}
        {ship.name}
      </button>
    ))}
  </div>
);

export default ShipSelection;
