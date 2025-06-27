let moveCount = 0;

const cups = [
    { max: 4, current: 4 },
    { max: 9, current: 9 },
    { max: 9, current: 0 }
  ];
  
  let history = [];
  let dumpUses = 0;
  let draggingCup = null;
  
  function render() {
    cups.forEach((cup, i) => {
      const fillEl = document.getElementById(`fill-${i}`);
      const height = (cup.current / cup.max) * 100;
      fillEl.style.height = height + "%";

      const amountEl = document.getElementById(`amount-${i}`);
      amountEl.textContent = `${cup.current}oz`;
    });
  
    checkWin();
  }
  
  function saveState() {
    history.push(JSON.parse(JSON.stringify(cups)));
  }
  
  function undoMove() {
    
    if (history.length === 0) return;
    cups.splice(0, 3, ...history.pop());
    moveCount = Math.max(0, moveCount - 1);
    updateMoveCount();
  
    render();
  }
  
  function dumpCup() {
    if (dumpUses >= 2) {
      alert("You can only dump twice!");
      return;
    }
  
    let smallestIndex = -1;
    let minAmount = Infinity;
  
    cups.forEach((cup, i) => {
      if (cup.current > 0 && cup.current < minAmount) {
        smallestIndex = i;
        minAmount = cup.current;
      }
    });
  
    if (smallestIndex === -1) {
      alert("No cups with water to dump.");
      return;
    }
  
    saveState();
    cups[smallestIndex].current = 0;
    dumpUses++;
    render();
  }
  
  function checkWin() {
    const messageEl = document.getElementById("message");
    const win = cups.some(cup => cup.current === 6);
    if (win) {
      messageEl.textContent = "🎉 You won!";
    } else {
      messageEl.textContent = "";
    }
  }

  function resetGame() {
    cups[0].current = 4;
    cups[1].current = 9;
    cups[2].current = 0;
    dumpUses = 0;
    history = [];
    moveCount = 0;
    updateMoveCount();
    render();
    document.getElementById("message").textContent = "";
  }
  
  // Drag-and-drop interaction
  document.querySelectorAll(".cup").forEach(cupEl => {
    cupEl.addEventListener("dragstart", e => {
      draggingCup = parseInt(cupEl.dataset.id);
    });
  
    cupEl.addEventListener("dragover", e => {
      e.preventDefault();
    });
  
    cupEl.addEventListener("drop", e => {
      const targetCup = parseInt(cupEl.dataset.id);
      if (draggingCup === null || draggingCup === targetCup) return;
  
      saveState();
      moveCount++;
      updateMoveCount();
      pourWater(draggingCup, targetCup);
      draggingCup = null;
      render();
    });
  
    cupEl.setAttribute("draggable", true);
  });
  
  function pourWater(from, to) {
    const source = cups[from];
    const dest = cups[to];
  
    const availableSpace = dest.max - dest.current;
    const amount = Math.min(availableSpace, source.current);
  
    if (amount === 0) return;
  
    source.current -= amount;
    dest.current += amount;
  }

  function updateMoveCount() {
    document.getElementById("move-count").textContent = moveCount;
  }

  function toggleRules() {
    const rules = document.getElementById("rules");
    const btn = event.target;
  
    if (rules.style.display === "none") {
      rules.style.display = "block";
      btn.textContent = "Hide Rules";
    } else {
      rules.style.display = "none";
      btn.textContent = "Show Rules";
    }
  }
  
  render();
  