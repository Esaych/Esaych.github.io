let friendsLines;
let groupsLines;

let friendsList = [];
let friendGroups = [];

let noAssociationCount = 0;

let center = null;

var slider;
var slider2;
var search;

function preload() {
  friendsLines = loadStrings('friends.txt');
  groupsLines = loadStrings('groups.txt');
}

function setup() {
  createCanvas(900, 500);
  background(100);
  fill(255);
  noStroke();
  colorMode(HSB, 255);
  
  let curFriend = "";
  let curTimestamp = 0;
  let min_time = 2000000000;
  let max_time = 0;
  
  for (let i = 0; i < friendsLines.length; i++) {
    let line = friendsLines[i];
    if (line.startsWith("name:")) {
      curFriend = line.substring("name:".length);
    }
    if (line.startsWith("timestamp:")) {
      curTimestamp = parseInt(line.substring("timestamp:".length));
      if (curTimestamp < min_time) {
        min_time = curTimestamp;
      }
      if (curTimestamp > max_time) {
        max_time = curTimestamp;
      }
      let newFriend = new Contact(curFriend, curTimestamp);
      friendsList.push(newFriend);
    }
  }
  
  
  slider = createSlider(min_time, max_time, min_time);
  slider.position(width-310, 10);
  slider.style('width', '300px');
  slider2 = createSlider(min_time, max_time, max_time);
  slider2.position(width-310, 30);
  slider2.style('width', '300px');
  
  search = createInput();
  search.position(60, 10);
  
  let curGroup = new Group("init");
  for (let i = 0; i < groupsLines.length; i++) {
    let line = groupsLines[i];
    if (line.startsWith("group:")) {
      console.log("Group: " + curGroup.name + " has " + curGroup.groupMembers.length + " members");
      curGroup = new Group(line.substring("group:".length));
      friendGroups.push(curGroup);
    } else {
      curGroup.addMemberByName(line);
    }
  }
  
  for (let i = 0; i < friendsList.length; i++) {
    let c = friendsList[i];
    c.setLevel();
    c.pickLoyalty();
  }
  
  for (let i = 0; i < friendGroups.length; i++) {
    let g = friendGroups[i];
    g.defineRingOrder();
  }
  
  center = createVector(width/2, height/2);
  
  ellipseMode(CENTER);
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var time = month + ' ' + year;
  return time;
}

function draw() {
  background(255);
  
  
  let min_time = slider.value();
  let max_time = slider2.value();
  if (min_time > max_time) {
    let holder = min_time;
    min_time = max_time;
    max_time = holder;
  }
  
  text(timeConverter(min_time), width-310, 65);
  textAlign(RIGHT);
  text(timeConverter(max_time), width-10, 65);
  textAlign(LEFT);
  
  
  for (let i = 0; i < friendsList.length; i++) {
    let c = friendsList[i];
    if (c.timestamp < min_time || c.timestamp > max_time) {
      continue;
    }
    c.update();
    c.render();
  }
  for (let i = 0; i < friendGroups.length; i++) {
    let g = friendGroups[i];
    g.update();
    g.render();
  }
}


class Contact {
  
  
  constructor(in_name, in_timestamp) {
    this.r = 7;
    this.maxvel = 30;
    
    this.name = in_name;
    this.timestamp = in_timestamp;
    this.pos = createVector(int(random(this.r,width-this.r)), int(random(this.r,height-this.r)));
    
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    this.loyalty = null;
    this.level = 3;
    this.associations = [];
    
    this.between = false;
    
    this.goto = null;
  }
  
  setLevel() {
    this.level = this.associations.length;
    if (this.level > 3) {
      this.level = 3;
    }
    this.pickLoyalty();
  }
  
  pickLoyalty() {
    if (this.associations.length == 1) {
      this.loyalty = this.associations[0];
    } else {
      let indx = int(random(0,this.associations.length));
      this.loyalty = this.associations[indx];
    }
  }
  
  associate(sender) {
    this.associations.push(sender);
  }
  
  render() {
    fill(255);
    circle(this.pos.x, this.pos.y, this.r);
    let mousePos = createVector(mouseX, mouseY);
    if (mousePos.dist(this.pos) < this.r) {
      fill('red');
      text(this.name, this.pos.x, this.pos.y);
    }
    if (search.value() != "" && this.name.startsWith(search.value())) {
      fill('red');
      text(this.name, this.pos.x, this.pos.y);
    }
    if (this.between) {
      stroke(0);
    } else {
      stroke(0, 30);
    }
    for (let i = 0; i < this.associations.length; i++) {
      line(this.pos.x, this.pos.y, this.associations[i].pos.x, this.associations[i].pos.y);
    }
    stroke(0);
  }
  
  update() {
    this.acc.normalize().mult(0.5);
    this.vel.add(this.acc);
    if (this.vel.mag() > this.maxvel) {
      this.vel.normalize().mult(this.maxvel);
    }
    this.vel.mult(0.9);
    this.pos.add(this.vel);
    
    if (this.associations.length > 0) {
      if (random(0,100000) < 1) {
        this.pickLoyalty();
      }
    } else {
      if (frameCount > 10 && this.goto == null) {
        noAssociationCount += 1;
        this.goto = createVector(int(noAssociationCount * 10 / height)*10 + 10, noAssociationCount * 10 % height);
      }
      if (this.goto != null) {
        let vec = this.goto.copy().sub(this.pos);
        if (vec.mag() > 5) {
          vec = vec.normalize().mult(5);
        }
        this.pos.add(vec);
      }
    }
    
    if (this.loyalty != null) {
      if (this.pos.dist(this.loyalty.pos) < this.loyalty.ring * this.level * 1.2) {
        this.between = false;
      } else {
        this.between = true;
      }
    }
    
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.x > width) {
      this.pos.x = width;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
    }
  }
  
  ping(sender) {
    if (sender === this.loyalty) {
      let dist = this.pos.dist(sender.pos);
      if (dist > sender.ring*this.level) {
        this.attract(sender.pos);
      } else if (dist < sender.ring*this.level*0.9) {
        this.repel(sender.pos);
      } else {
        this.orbit(sender.pos);
      }
    }
  }
  
  attract(to) { 
      this.acc.add(to.copy().sub(this.pos).normalize().div(to.dist(this.pos)).mult(5));
  }
  
  repel(from) {
    this.acc.add(this.pos.copy().sub(from).normalize().div(from.dist(this.pos)).mult(5));
  }
  
  orbit(origin) {
    this.acc.mult(0);
    
    var members = this.loyalty.ringMembers[this.level];
    var num = members.indexOf(this);
    var total = members.length;
    
    var angle = num*TWO_PI/total;
    
    let dirVec = createVector(this.loyalty.pos.x, this.loyalty.pos.y, this.pos.x, this.pos.y);
    let vert = createVector(this.loyalty.pos.x, this.loyalty.pos.y, this.loyalty.pos.x, this.loyalty.pos.y + this.loyalty.ring*this.level);
    let angl = vert.angleBetween(dirVec);
    
    let quadrant = 0;
    // 4 | 1
    // 3 | 2
    if (this.pos.x < this.loyalty.pos.x) {
      if (this.pos.y < this.loyalty.pos.y) {
        quadrant = 4;
      } else {
        quadrant = 3;
      }
    } else {
      if (this.pos.y < this.loyalty.pos.y) {
        quadrant = 1;
      } else {
        quadrant = 2;
      }
    }
    let upperRange = 0.11;
    if (quadrant == 1) {
      angl = map(angl, 0, upperRange, 0, PI/2);
    } else if (quadrant == 2) {
      angl = map(angl, upperRange, 0, PI/2, PI);
    } else if (quadrant == 3) {
      angl = map(angl, 0, upperRange, PI, 3*PI/2);
    } else {
      angl = map(angl, upperRange, 0, 3*PI/2, TWO_PI);
    }
    
    //if (angl > 0) {
      this.vel = origin.copy().sub(this.pos).normalize().rotate(HALF_PI);
    //}
    
    //console.log(.indexOf(this));
  }
  
}

class Group {
  
  constructor(in_name) {
    this.r = 2;
    this.ring = 25;
    this.groupMembers = [];
    this.ringMembers = [[], [], [], []];
    
    this.name = in_name;
    this.pos = createVector(int(width/2 + random(this.ring*-3, this.ring*3)), int(height/2 + random(this.ring*-3,this.ring*3)));
    
    this.vert = createVector(1,1,1,0);
    
    if (in_name == "subtle asian traits") {
      this.pos = createVector(width/2, height/2);
    }
  }
  
  addMemberByName(memberName) {
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].name == memberName) {
        this.groupMembers.push(friendsList[i]);
        friendsList[i].associate(this);
      }
    }
  }
  
  defineRingOrder() {
    for (let i = 0; i < friendsList.length; i++) {
      let c = friendsList[i];
      this.ringMembers[c.level].push(c);
    }
  }
  
  render() {
    fill('red');
    circle(this.pos.x, this.pos.y, this.r);
    noFill();
    stroke('yellow');
    circle(this.pos.x, this.pos.y, this.ring);
    circle(this.pos.x, this.pos.y, this.ring*2);
    circle(this.pos.x, this.pos.y, this.ring*3);
    fill('black');
    text(this.name, this.pos.x, this.pos.y);
  }
  
  update() {
    for (let i = 0; i < friendGroups.length; i++) {
      let g = friendGroups[i];
      if (this.pos.copy().dist(g.pos) < this.ring*8) {
        this.pos.add(this.pos.copy().sub(g.pos).normalize().mult(random(0.3,0.5)));
      }
      if (this.pos.x > width-this.ring*3) {
        this.pos.x = width-this.ring*3;
      }
      if (this.pos.x < this.ring*6) {
        this.pos.x = this.ring*6;
      }
      if (this.pos.y > height-this.ring*3) {
        this.pos.y = height-this.ring*3;
      }
      if (this.pos.y < this.ring*3) {
        this.pos.y = this.ring*3;
      }
      if (this.pos.x > width/2 && this.pos.y < this.ring*3+70) {
        this.pos.y = this.ring*3+70;
      }
    }
    let mousePos = createVector(mouseX, mouseY);
    if (mousePos.dist(this.pos) < this.ring*3) {
      for (let i = 0; i < this.groupMembers.length; i++) {
        this.groupMembers[i].loyalty = this;
      }
    }
    for (let i = 0; i < this.groupMembers.length; i++) {
      this.groupMembers[i].ping(this);
    }
  }
}
