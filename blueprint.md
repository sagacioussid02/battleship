Battleship Web App – Blueprint Prompt
🕹️ Overview
Build a browser-based Battleship game where:

The user can place their ships manually.

The opponent (a computer) auto-places ships.

Players take turns attacking.

Game logic notifies hits, misses, and which ship was hit.

🧱 Core Features
1. Player Grid Setup
Display a 10×10 grid.

Show a fleet of ships (Carrier, Battleship, Cruiser, Submarine, Destroyer).

Allow user to select a ship and click on the grid to place it (horizontal only for now).

Prevent overlapping and boundary overflows.

2. Ship Placement Completion
Once all ships are placed, user clicks “✅ I am Ready” button.

Transition to battle phase.

3. Computer Setup
Auto-place fleet randomly on a hidden 10×10 grid.

Ensure valid non-overlapping placement.

4. Battle Phase
User clicks on the opponent’s grid to attack.

App displays:

“💥 Hit! You hit a [Ship Name]” if successful

“❌ Miss!” otherwise

Only one attack per turn.

🧩 UI Layout
Left Side: Player grid with visible ships.

Right Side: Computer grid (ships hidden).

Bottom:

Ship selection buttons

“I am Ready” button

Message display area

⚙️ Logic & Rules
Game state transitions: "placement" → "battle"

Ships are placed horizontally only (future: add rotation).

Computer ship characters are stored as first letter of ship name.

Messages update with hit/miss status.

Game ends logic not implemented yet.

💡 Tech Stack
Frontend: React + Tailwind CSS (or plain CSS)

State Management: useState for simplicity

Hosting: Netlify/Vercel for quick deploy

📦 Bonus Features (Future Ideas)
Turn-based back-and-forth (user vs. AI).

End game detection.

Vertical placement and rotation toggle.

Difficulty levels for AI.

Sound effects or hit/miss animations.