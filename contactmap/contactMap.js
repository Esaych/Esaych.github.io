var ids = ["name","label","email","work tel", "home tel", "mobile tel", "web", "im", "fax", "pager", "video", "organization"]
function addUser(){
  var fields = [];
  for (var i = 0; i < ids.length; i++) {
    if (document.getElementById(ids[i]).value != ""){
      fields.push({key: ids[i], value: document.getElementById(ids[i]).value});
    }
  }
  
  addToChart(fields)
}


var currX = 25
var currY = 25
var xConstant = 100
var yConstant = 10
var margin = 20


function addToChart(newToAdd){
  var c = document.getElementById("myChart");
  var ctx = c.getContext("2d");
  ctx.font = "10px Arial";

  ctx.strokeRect(currX - margin, currY - margin, xConstant * 2.5 + margin, yConstant * newToAdd.length + margin)
  for (var i = 0; i < newToAdd.length; i++) {
    ctx.fillText(newToAdd[i].key, currX, currY)
    currX += xConstant
    ctx.fillText(newToAdd[i].value, currX, currY)
    currX -= xConstant
    currY += yConstant
  }
  currY +=  margin*1.5

  if (currY > 480) {
    currY = 25
    currX += xConstant* 3
  }

}
