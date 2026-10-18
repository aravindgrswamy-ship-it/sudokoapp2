// Sudoku engine: generator with unique solutions, for 4x4 and 9x9 grids.
(function (root) {
  "use strict";

  // Difficulty presets. "clues" = number of given cells.
  var LEVELS = {
    easy:   { size: 4, box: 2, clues: 8,  label: "Easy (4x4)" },
    medium: { size: 9, box: 3, clues: 38, label: "Medium (9x9)" },
    hard:   { size: 9, box: 3, clues: 27, label: "Hard (9x9)" }
  };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function canPlace(g, n, box, r, c, v) {
    for (var i = 0; i < n; i++) {
      if (g[r * n + i] === v || g[i * n + c] === v) return false;
    }
    var br = r - (r % box), bc = c - (c % box);
    for (var y = 0; y < box; y++)
      for (var x = 0; x < box; x++)
        if (g[(br + y) * n + bc + x] === v) return false;
    return true;
  }

  // Fill a grid completely with random backtracking.
  function fill(g, n, box, pos) {
    if (pos === n * n) return true;
    if (g[pos] !== 0) return fill(g, n, box, pos + 1);
    var r = Math.floor(pos / n), c = pos % n;
    var vals = [];
    for (var v = 1; v <= n; v++) vals.push(v);
    shuffle(vals);
    for (var k = 0; k < vals.length; k++) {
      if (canPlace(g, n, box, r, c, vals[k])) {
        g[pos] = vals[k];
        if (fill(g, n, box, pos + 1)) return true;
        g[pos] = 0;
      }
    }
    return false;
  }

  // Count solutions, stopping at `limit` (2 is enough to test uniqueness).
  // Picks the empty cell with fewest candidates to stay fast on 9x9.
  function countSolutions(g, n, box, limit) {
    var best = -1, bestCands = null;
    for (var p = 0; p < n * n; p++) {
      if (g[p] !== 0) continue;
      var r = Math.floor(p / n), c = p % n, cands = [];
      for (var v = 1; v <= n; v++) if (canPlace(g, n, box, r, c, v)) cands.push(v);
      if (cands.length === 0) return 0;
      if (bestCands === null || cands.length < bestCands.length) {
        best = p; bestCands = cands;
        if (cands.length === 1) break;
      }
    }
    if (best === -1) return 1; // no empty cell: one solution
    var total = 0;
    for (var k = 0; k < bestCands.length; k++) {
      g[best] = bestCands[k];
      total += countSolutions(g, n, box, limit - total);
      g[best] = 0;
      if (total >= limit) break;
    }
    return total;
  }

  // Build a puzzle: returns { size, box, puzzle[], solution[] }.
  function generate(level) {
    var cfg = LEVELS[level];
    var n = cfg.size, box = cfg.box;
    var solution = new Array(n * n).fill(0);
    fill(solution, n, box, 0);
    var puzzle = solution.slice();
    var order = [];
    for (var i = 0; i < n * n; i++) order.push(i);
    shuffle(order);
    var clues = n * n;
    for (var k = 0; k < order.length && clues > cfg.clues; k++) {
      var p = order[k], keep = puzzle[p];
      puzzle[p] = 0;
      if (countSolutions(puzzle.slice(), n, box, 2) !== 1) {
        puzzle[p] = keep; // removing breaks uniqueness, put it back
      } else {
        clues--;
      }
    }
    return { size: n, box: box, puzzle: puzzle, solution: solution, clues: clues };
  }

  var api = {
    LEVELS: LEVELS,
    generate: generate,
    countSolutions: countSolutions,
    canPlace: canPlace
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Sudoku = api;
})(typeof window !== "undefined" ? window : this);
