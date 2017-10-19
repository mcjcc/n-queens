// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var rowcount = _.reduce(this.get(rowIndex), function(total, val) {
        return total + val;
      });
      if (rowcount > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowcount = this.get('n');
      for (var i = 0; i < rowcount; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rowcount = this.get('n');
      var newBoard = new Board({n: this.get('n')});
      var columnArr = [];
      for (var i = 0; i < rowcount; i++) {
        columnArr.push(this.get(i)[colIndex]);
      }
      newBoard.set(colIndex, columnArr);    
      return newBoard.hasRowConflictAt(colIndex);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      counter = this.get('n');
      for (var i = 0; i < counter; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        } 
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // negative _getFirstRowColumnIndexForMajorDiagonalOn gives the row index (absolute value);
      // positive _getFirstRowColumnIndexForMajorDiagonalOn gives the column index 
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        var position = [0, majorDiagonalColumnIndexAtFirstRow];
        var currentPosition = [position[0], position[1]];
        var start = this.get(0)[majorDiagonalColumnIndexAtFirstRow];
        var diagonalArr = [];
        for (var i = position[1]; i < this.get('n'); i++) {
          diagonalArr.push(this.get(currentPosition[0])[currentPosition[1]]);
          currentPosition[0] += 1;
          currentPosition[1] += 1; 
        }
      } else {
        var position = [majorDiagonalColumnIndexAtFirstRow * -1, 0];
        var currentPosition = [position[0], position[1]];
        var start = this.get(majorDiagonalColumnIndexAtFirstRow * -1)[0];
        var diagonalArr = [];
        for (var i = position[0]; i < this.get('n'); i++) {
          diagonalArr.push(this.get(currentPosition[0])[currentPosition[1]]);
          currentPosition[0] += 1;
          currentPosition[1] += 1;
        }       
      }
      var rowcount = _.reduce(diagonalArr, function(total, val) {
        return total + val;
      });
      if (rowcount > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //make for loop with (initial value equal to the number of rows * -1 +1; i < this.get(n)
        //run has diagonal on i
      for (var i = this.get('n') * -1 + 1; i < this.get('n'); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var startingPos = [];
      startingPos[0] = Math.max( minorDiagonalColumnIndexAtFirstRow - (this.get('n') - 1), 0 );
      startingPos[1] = Math.min( this.get('n') - 1, minorDiagonalColumnIndexAtFirstRow );

      var currentPosition = [startingPos[0], startingPos[1]];
      
      var diagonalArr = [];
      for (var i = 0; i < (this.get('n') - Math.abs(this.get('n') - 1 - minorDiagonalColumnIndexAtFirstRow)); i++) {
        
        diagonalArr.push(this.get(currentPosition[0])[currentPosition[1]]);
        currentPosition[0] += 1;
        currentPosition[1] -= 1;
      }
      var rowcount = _.reduce(diagonalArr, function(total, val) {
        return total + val;
      });
      if (rowcount > 1) {
        return true;
      } else { 
        return false;
      }

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      
      for (var i = 0; i <= ((2 * this.get('n')) - 2); i++ ) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; 
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());





