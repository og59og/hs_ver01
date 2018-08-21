/**
 * Created by SoftFactory on 2018-07-03.
 */

var GRID_ARRAY_SIZE = 10;
var grid = [];


init();
print();

//3부터 쉬프트
shift_right(5);
print('shift_right:3');

init();
shift_left(5);
print('shift_left:3');

init2();
shift_up(5);
print('shift_up:3');

init2();
shift_down(5);
print('shift_down:3');

//0번째 임계값 쉬프트
init();
shift_right(0);
print('shift_right:0');

init();
shift_left(0);
print('shift_left:0');

init2();
shift_up(0);
print('shift_up:0');

init2();
shift_down(0);
print('shift_down:0');

//9번째 임계값 쉬프트
init();
shift_right(9);
print('shift_right:9');

init();
shift_left(9);
print('shift_left:9');

init2();
shift_up(9);
print('shift_up:9');

init2();
shift_down(9);
print('shift_down:9');

function shift_right(pos) {
    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        grid[i].splice(pos, 0, grid[i][pos]);//위치, 삭제카운트, 추가값
    }
}

function shift_left(pos) {
    if (pos == 0)
        console.warn('shift_left pos = 0!. No change in grid.');
    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        grid[i].splice(pos, 0, grid[i][pos]);
        grid[i].shift();
    }
}

function shift_up(pos) {
    if (pos == 0)
        console.warn('shift_up pos = 0!. No change in grid.');
    for (var i = 0; i < pos; i++) {
        grid[i] = grid[i + 1];
    }
}

function shift_down(pos) {
    for (var i = GRID_ARRAY_SIZE - 2; i >= pos; i--) {
        grid[i + 1] = grid[i];
    }
}


function init() {
    grid = new Array(GRID_ARRAY_SIZE);
    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        grid[i] = new Array(GRID_ARRAY_SIZE);
    }

    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        for (var j = 0; j < GRID_ARRAY_SIZE; j++) {
            grid[i][j] = j;
        }
    }

}

function init2() {
    grid = new Array(GRID_ARRAY_SIZE);
    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        grid[i] = new Array(GRID_ARRAY_SIZE);
    }


    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        for (var j = 0; j < GRID_ARRAY_SIZE; j++) {
            grid[j][i] = j;
        }
    }

}

 function print(name) {
     console.log(name + '--------------------------------------------------');
    for (var i = 0; i < GRID_ARRAY_SIZE; i++) {
        var line = '';
        for (var j = 0; j < GRID_ARRAY_SIZE; j++) {
            line += grid[i][j];
        }
        console.log(line);
    }

}

