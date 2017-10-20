/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
var rooksToggler = function(newBoard, n) {
  for (var i = 0; i < n; i++) { // row
    for (var j = 0; j < n; j++) { // column 
      if (newBoard.get(i)[j] === 0) {
        newBoard.togglePiece(i, j);
      }
      if (newBoard.hasColConflictAt(j)) {
        newBoard.togglePiece(i, j);
        continue;
      }
      if (newBoard.hasRowConflictAt(i)) {
        newBoard.togglePiece(i, j);
        break;
      }
    }
  }
  return newBoard.rows();
};

window.findNRooksSolution = function(n) {
  newBoard = new Board({n: n});

  var solution = rooksToggler(newBoard, n); //fixme

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var rooksArr = [];

  // recursiveFunc(boardList, 0);
  var recursiveFunc = function(boardList, currentRow) {
    
    if ( currentRow === n ) {
      return boardList;
    }
    
    var currentBoardList = [];
  // create new boards (branches) for every iteration 
    for (var i = 0; i < boardList.length; i++) {
      for (var j = 0; j < n; j++) {
        var stringifiedArray = JSON.stringify(boardList[i]);
        var parsedArray = JSON.parse(stringifiedArray);
        var newBoard = new Board(parsedArray);

        // var newBoard = new Board(boardList[i]);
        newBoard.togglePiece(currentRow, j);
        currentBoardList.push(newBoard);
      } //row
    }
    
    // filter list of has any rooks conflicts
    currentBoardList = currentBoardList.filter(function(element) {
      return !element.hasAnyRooksConflicts();
    });
    
    // store as a list of arrays instead of board objects
    var currentBoardListArrayForm = currentBoardList.map(function(e) {
      return e.rows();
    });
    
    return recursiveFunc(currentBoardListArrayForm, currentRow + 1);
  };

  // create a rook at every position of row 0
  for (var i = 0; i < n; i++) {
    var board = new Board({n: n});
    board.togglePiece(0, i);
    rooksArr = rooksArr.concat(recursiveFunc([board.rows()], 1));
  }
  console.log('rooksArr: ', JSON.stringify(rooksArr));
  var solutionCount = rooksArr.length; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);

  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {

  // if (n === 0) {
  //   newBoard = new Board({n: 0});
  // }

  // for ( var s = 0; s < n; s++) { // columns
  //   newBoard = new Board({n: n});
  //   newBoard.togglePiece(0, s);
  //   console.log('level', s);
  //   for (var i = 0; i < n; i++) { // rows
  //     for ( var j = 0; j < n; j++) { // columns
  //       if (newBoard.get(i)[j] === 0) {
  //         newBoard.togglePiece(i, j);
  //       }
  //       if (newBoard.hasColConflictAt(j) || newBoard.hasMajorDiagonalConflictAt(j - i) || newBoard.hasMinorDiagonalConflictAt(j + i)) {
  //         newBoard.togglePiece(i, j);
  //         continue;
  //       }  
  //       if (newBoard.hasRowConflictAt(i)) {
  //         newBoard.togglePiece(i, j);
  //         break;
  //       }  
  //     }  
  //   }
  //   var numberOfQueens = 0;
  //   for (var i = 0; i < n; i++) {
  //     if (newBoard.rows()[i].includes(1)) {
  //       numberOfQueens += 1;
  //     }
  //   }
  //   console.log('number queens', numberOfQueens);
  //   if (numberOfQueens === n) {
  //     break;
  //   }
  // }
  // recursiveFunc(boardList, 0);

  if (n === 0) {  
    return [];
  } 
  if (n === 2) {
    return [[], []];
  } 
  if (n === 3) {
    return [[], [], []];
  }

  var queensArr = [];

  // recursiveFunc(boardList, 0);
  var recursiveFunc = function(boardList, currentRow) {
    
    if ( currentRow === n ) {
      return boardList;
    }

    
    
    var currentBoardList = [];
  // create new boards (branches) for every iteration 
    for (var i = 0; i < boardList.length; i++) {
      for (var j = 0; j < n; j++) {
        var stringifiedArray = JSON.stringify(boardList[i]);
        var parsedArray = JSON.parse(stringifiedArray);
        var newBoard = new Board(parsedArray);

        // var newBoard = new Board(boardList[i]);
        newBoard.togglePiece(currentRow, j);
        currentBoardList.push(newBoard);
      } //row
    }
    
    // filter list of has any rooks conflicts
    currentBoardList = currentBoardList.filter(function(element) {
      return !element.hasAnyQueensConflicts();
    });
    
    // store as a list of arrays instead of board objects
    var currentBoardListArrayForm = currentBoardList.map(function(e) {
      return e.rows();
    });
    
    return recursiveFunc(currentBoardListArrayForm, currentRow + 1);
  };

  // create a rook at every position of row 0
  for (var i = 0; i < n; i++) {
    var board = new Board({n: n});
    board.togglePiece(0, i);
    queensArr = queensArr.concat(recursiveFunc([board.rows()], 1));
  }
  console.log('queensArr: ', JSON.stringify(queensArr[0]));
  
  
  
  var solution = queensArr[0]; 

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
                                              
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var queensArr = [];

  // recursiveFunc(boardList, 0);
  var recursiveFunc = function(boardList, currentRow) {
    
    if ( currentRow === n ) {
      return boardList;
    }
    
    var currentBoardList = [];
  // create new boards (branches) for every iteration 
    for (var i = 0; i < boardList.length; i++) {
      for (var j = 0; j < n; j++) {
        var stringifiedArray = JSON.stringify(boardList[i]);
        var parsedArray = JSON.parse(stringifiedArray);
        var newBoard = new Board(parsedArray);

        // var newBoard = new Board(boardList[i]);
        newBoard.togglePiece(currentRow, j);
        currentBoardList.push(newBoard);
      } //row
    }
    
    // filter list of has any rooks conflicts
    currentBoardList = currentBoardList.filter(function(element) {
      return !element.hasAnyQueensConflicts();
    });
    
    // store as a list of arrays instead of board objects
    var currentBoardListArrayForm = currentBoardList.map(function(e) {
      return e.rows();
    });
    
    return recursiveFunc(currentBoardListArrayForm, currentRow + 1);
  };

  // create a rook at every position of row 0
  for (var i = 0; i < n; i++) {
    var board = new Board({n: n});
    board.togglePiece(0, i);
    queensArr = queensArr.concat(recursiveFunc([board.rows()], 1));
  }
  console.log('queensArr: ', JSON.stringify(queensArr));
  var solutionCount = queensArr.length; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
