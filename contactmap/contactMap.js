var ids = ["name","label","email","work tel", "home tel", "mobile tel", "web", "im", "fax", "pager", "video", "organization", "title"]
function addUser(){
  var fields = [];
  for (var i = 0; i < ids.length; i++) {
    var curr = document.getElementById(ids[i])
    if (curr.value != ""){
      fields.push({key: ids[i], value: curr.value});
      curr.value = ""
    }
  }

  addToChart(fields)
}


var currX = 25
var currY = 25
var xConstant = 100
var yConstant = 10
var margin = 20
var contacts = []

function addToChart(newToAdd){
  var newBox = []
  newBox.push({type:"rect", x: currX - margin, y: currY - margin, width: xConstant * 2.5 + margin, height: yConstant * newToAdd.length + margin, isDragging: false})
  for (var i = 0; i < newToAdd.length; i++) {
    newBox.push({type: "label", x:currX, y: currY, text:newToAdd[i].key, isDragging: false})
    currX += xConstant
    newBox.push({type:"label", x:currX, y: currY, text:newToAdd[i].value, isDragging: false})
    currX -= xConstant
    currY += yConstant
  }
  currY +=  margin*1.5

  if (currY > 480) {
    currY = 25
    currX += xConstant* 3
  }
  contacts.push(newBox)
  draw()
}



var canvas = document.getElementById("myChart");
var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

var dragok = false;
var startX;
var startY;

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
function draw (){
  clear()
  var c = document.getElementById("myChart");
  var ctx = c.getContext("2d");
  ctx.font = "10px Arial";
  console.log(contacts);

  for (var i = 0; i < contacts.length; i++) {
    for (var j = 0; j < contacts[i].length; j++) {
      if (contacts[i][j].type == "label"){
        ctx.fillText(contacts[i][j].text, contacts[i][j].x, contacts[i][j].y)
      }
      else if (contacts[i][j].type == "rect"){
        ctx.strokeRect(contacts[i][j].x,contacts[i][j].y,contacts[i][j].width,contacts[i][j].height)
      }
    }
    console.log(contacts[i]);
  }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < contacts.length; i++) {
        var r = contacts[i].find(a => a.type == "rect");
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
            // if yes, set that contacts isDragging=true
            dragok = true;
            r.isDragging = true;
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < contacts.length; i++) {
        contacts[i].find(a => a.type == "rect").isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < contacts.length; i++) {
          for (var j = 0; j < contacts[i].length; j++) {
            var r = contacts[i][j]
            if (contacts[i].find(a => a.type == "rect").isDragging) {
                r.x += dx;
                r.y += dy;
            }
          }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}
