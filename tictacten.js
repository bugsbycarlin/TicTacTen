
// set up web app specific stuff
function initialize()
{
  // prevents user from dragging the webpage
  $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
  // add events for mouse and touch
  //document.addEventListener("mouseup", click_event, false);
  //document.addEventListener("touchstart", touch_event, false);

  // set the width and height of our canvas
  //canvas = document.getElementById('canvas');
  canvas = $("#canvas")[0];
  canvas.width = 1024;
  canvas.height = 700;

  $("canvas").bind("mouseup",click_event);

  // this little function I cooked up allows us to work as though the
  // top and left edges of the canvas are zero, by subtracting off
  // the web browser left and top values.
  //var pos = findPos(canvas);
  //canvas.left = pos[0];
  //canvas.top = pos[1];

  // initialize the actual game!
  initializeGame();

  // hide the loading div, show the canvas
  canvas.style.visibility = 'visible';
  var loadingdiv = document.getElementById('loadingdiv');
  loadingdiv.style.visibility = 'hidden'; 
  loadingdiv.style.opacity = 0;
}

// initialize actual game stuff
function initializeGame()
{
  gameover = false;
  catgame = false;

  clearBoard();

  drawBoard();
}

board = [];
bigBoard = [];

gameover = false;
catgame = false;

turn = "X";

LittleX = new Image();
LittleX.src = "LittleX.png";
LittleO = new Image();
LittleO.src = "LittleO.png";

BigX = new Image();
BigX.src = "BigX.png";
BigO = new Image();
BigO.src = "BigO.png";

BigBoardShadow = new Image();
BigBoardShadow.src = "BigBoardShadow.png";

Cat = new Image();
Cat.src = "Cat.gif";

bigBoard_i = -1;
bigBoard_j = -1;

bigMoveHistory = [];

function clearBoard()
{
  for(var i = 0; i < 3; i++)
  {
    board[i] = [];
    for(var j = 0; j < 3; j++)
    {
      board[i][j] = [];
      for(var k = 0; k < 3; k++)
      {
        board[i][j][k] = [];
        for(var l = 0; l < 3; l++)
        {
          board[i][j][k][l] = "";
        }
      }
    }
  }




  for(var i = 0; i < 3; i++)
  {
    bigBoard[i] = [];
    for(var j = 0; j < 3; j++)
    {
      bigBoard[i][j] = "";
    }
  }
}

// check whether a given little board is full
function boardFull(i,j)
{
  sub_board = bigBoard;
  if(0 <= i && i < 3 && 0 <= j && j < 3)
  {
    sub_board = board[i][j];
  }

  full = true;
  for(var k = 0; k < 3; k++)
  {
    for(var l = 0; l < 3; l++)
    {
      if(sub_board[k][l] == "")
      {
        full = false;
      }
    }
  }

  return full;
}

// check each little board to see whether the big board has been taken
function checkBigBoards()
{
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      if(bigBoard[i][j] == "")
      {
        winner = boardWinner(i,j);
        
        if(winner != "")
        {
          bigBoard[i][j] = winner;
        }
      }
    }
  }

  winner = boardWinner(-1,-1)
  if(winner != "")
  {
    gameover = true;
    if(winner == "C")
    {
      catgame = true;
    }
  }
}

// who wins this board?
function boardWinner(i,j)
{
  sub_board = bigBoard;
  if(0 <= i && i < 3 && 0 <= j && j < 3)
  {
    sub_board = board[i][j];
  }

  for(var k = 0; k < 3; k++)
  {
    // row checks
    if(sub_board[k][0] != "" && sub_board[k][0] != "C"
      && sub_board[k][0] == sub_board[k][1]
      && sub_board[k][0] == sub_board[k][2])
    {
      return sub_board[k][0];
    }

    // col checks
    if(sub_board[0][k] != "" && sub_board[0][k] != "C"
      && sub_board[0][k] == sub_board[1][k]
      && sub_board[0][k] == sub_board[2][k])
    {
      return sub_board[0][k];
    }
  }

  // cross checks
  if(sub_board[0][0] != "" && sub_board[0][0] != "C"
    && sub_board[0][0] == sub_board[1][1]
    && sub_board[0][0] == sub_board[2][2])
  {
    return sub_board[0][0];
  }

  if(sub_board[0][2] != "" && sub_board[0][2] != "C"
    && sub_board[0][2] == sub_board[1][1]
    && sub_board[0][2] == sub_board[2][0])
  {
    return sub_board[0][2];
  }

  if(boardFull(i,j))
  {
    return "C";
  }

  return "";
}

function drawBoard()
{
  // clear the screen
  var context = canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the cat
  if(catgame)
  {
    context.drawImage(Cat, 212, 50, 600, 600);
  }

  // draw the shadow for the current big board
  if(gameover == false && bigBoard_j > -1 && bigBoard_j > -1)
  {
    context.drawImage(BigBoardShadow, 212 + 200 * bigBoard_i, 50 + 200 * bigBoard_j);
  }

  // draw the big board lines
  drawSingleBoard(context, 212, 50, 600, "777777")

  // draw the big tiles
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      if(bigBoard[i][j] == "O")
      {
        context.drawImage(BigO, 235 + 200 * i, 75 + 200 * j);
      }
      else if(bigBoard[i][j] == "X")
      {
        context.drawImage(BigX, 235 + 200 * i, 75 + 200 * j);
      }
      else if(bigBoard[i][j] == "C")
      {
        context.drawImage(Cat, 212 + 200 * i, 50 + 200 * j, 200, 200);
      }
    }
  }


  // draw the small board lines
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      drawSingleBoard(context, 235 + 200 * i, 75 + 200 * j, 150, "AAAAAA");
    }
  }

  // draw the little tiles
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 3; j++)
    {
      for(var k = 0; k < 3; k++)
      {
        for(var l = 0; l < 3; l++)
        {
          if(board[i][j][k][l] == "O")
          {
            context.drawImage(LittleO, 235 + 200 * i - 1 + 51 * k, 75 + 200 * j - 1 + 51 * l);
          }
          else if(board[i][j][k][l] == "X")
          {
            context.drawImage(LittleX, 235 + 200 * i - 1 + 51 * k, 75 + 200 * j - 1 + 51 * l);
          }
        }
      }
    }
  }
}

function drawSingleBoard(context, left, top, size, color)
{
  context.strokeStyle = "#" + color;
  context.lineWidth = 2;
  
  context.beginPath();
  context.moveTo(left, top + size / 3);
  context.lineTo(left + size, top + size / 3);
  context.stroke();

  context.beginPath();
  context.moveTo(left, top + 2 * size / 3);
  context.lineTo(left + size, top + 2 * size / 3);
  context.stroke();

  context.beginPath();
  context.moveTo(left + size / 3, top);
  context.lineTo(left + size / 3, top + size);
  context.stroke();

  context.beginPath();
  context.moveTo(left + 2 * size / 3, top);
  context.lineTo(left + 2 * size / 3, top + size);
  context.stroke();
}

// handle a click event (by passing to do_click)
function click_event(ev)
{
  ev.preventDefault();

  do_click(ev.offsetX, ev.offsetY);
}

// // handle a touch event (by passing to do_click)
// function touch_event(ev)
// {
//   console.log(ev);
//   var touch = ev.touches[0];
//   var x = touch.pageX - canvas.left;
//   var y = touch.pageY - canvas.top;
//   do_click(x,y);
// }

// this is where clicks and touches are really handled. click things,
// stuff happens, you know the drill.
function do_click(x,y)
{
  if(gameover)
  {
    return;
  }

  lastX = x;
  lastY = y;

  // this click was inside the board
  if(212 <= x && x <= 812 && 50 <= y && y <= 650)
  {
    i = Math.floor((x - 212) / 200.0);
    j = Math.floor((y - 50) / 200.0);
    
    if((bigBoard_i == i && bigBoard_j == j) || (bigBoard_i == -1 && bigBoard_j == -1))
    {
      k = Math.floor((x - 212 - 200 * i - 25) / 50.0)
      l = Math.floor((y - 50 - 200 * j - 25) / 50.0)

      // legal move
      if(0 <= k && k <= 2 && 0 <= l && l <= 2 && board[i][j][k][l] == "")
      {
        board[i][j][k][l] = turn;
        if(turn == "X")
        {
          turn = "O";
        }
        else if(turn == "O")
        {
          turn = "X";
        }

        // unshift puts stuff onto the back of the array, so we can look 
        // at history with positive indices
        bigMoveHistory.unshift([bigBoard_i,bigBoard_j]);

        bigBoard_i = k;
        bigBoard_j = l;

        if(boardFull(bigBoard_i,bigBoard_j))
        {
          bigBoard_i = -1;
          bigBoard_j = -1;
        }

        // house rule
        if(bigMoveHistory.length > 4 
          && bigMoveHistory[1][0] == bigBoard_i && bigMoveHistory[1][1] == bigBoard_j
          && bigMoveHistory[3][0] == bigBoard_i && bigMoveHistory[3][1] == bigBoard_j)
        {
          bigBoard_i = -1;
          bigBoard_j = -1;
        }

        checkBigBoards();
      }
    }
  }

  drawBoard();
}


