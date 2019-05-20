ArrayList<Contact> friendsList = new ArrayList<Contact>();
ArrayList<Group> friendGroups = new ArrayList<Group>();

void setup() {

  size(900, 500);
  background(255);
  fill(255);
  noStroke();
  colorMode(HSB, 255);
  
  String lines[] = loadStrings("friends.txt");
  String curFriend = "";
  String curTimestamp = "";
  for (String line : lines) {
    if (line.startsWith("name:")) {
      curFriend = line.substring("name:".length());
    }
    if (line.startsWith("timestamp:")) {
      curTimestamp = line.substring("timestamp:".length());
      
      Contact newFriend = new Contact(curFriend, parseInt(curTimestamp));
      friendsList.add(newFriend);
    }
  }
  lines = loadStrings("groups.txt");
  Group curGroup = new Group("init");
  for (String line : lines) {
    if (line.startsWith("group:")) {
      println("Group: " + curGroup.name + " has " + curGroup.groupMembers.size() + " members");
      curGroup = new Group(line.substring("group:".length()));
      friendGroups.add(curGroup);
    } else {
      curGroup.addMemberByName(line);
    }
  }
  
  ellipseMode(CENTER);
  
}

void draw() {
  background(255);
  for (Contact c : friendsList) {
    c.update();
    c.render();
  }
  for (Group g : friendGroups) {
    g.update();
    g.render();
  }
}

class Contact {
  String name;
  int timestamp;
  PVector pos;
  PVector vel;
  PVector acc;
  
  int r = 15;
  int maxvel = 10;
  
  Contact(String in_name, int in_timestamp) {
    name = in_name;
    timestamp = in_timestamp;
    pos = new PVector(int(random(0+r,width-r)), int(random(0+r,height-r)));
    vel = new PVector(0,0);
    acc = new PVector(0,0);
  }
  
  void render() {
    fill(#FFFFFF);
    circle(pos.x, pos.y, r);
  }
  
  void update() {
    //repel(friendsList.get(int(random(0,friendsList.size()))).pos);
    
    acc.mult(0.1);
    vel.add(acc);
    if (vel.mag() > maxvel) {
      vel.normalize().mult(maxvel);
    }
    vel.mult(0.95);
    pos.add(vel);
  }
  
  void attract(PVector to) {
    acc.add(to.copy().sub(pos).normalize().div(to.dist(pos)));
  }
  
  void repel(PVector from) {
    acc.add(pos.copy().sub(from).normalize().div(from.dist(pos)));
  }
  
  void orbit(PVector origin) {
    acc.mult(0);
    vel = origin.copy().sub(pos).normalize().rotate(HALF_PI);
  }
  
}

class Group {
  String name;
  ArrayList<Contact> groupMembers = new ArrayList<Contact>();
  PVector pos;
  
  int r = 2;
  int ring = 50;
  
  Group(String in_name) {
    name = in_name;
    pos = new PVector(int(random(0+ring,width-ring)), int(random(0+ring,height-ring)));
  }
  
  void addMemberByName(String memberName) {
    for (Contact c : friendsList) {
      if (c.name.equals(memberName)) {
        groupMembers.add(c);
      }
    }
  }
  
  void render() {
    fill(#FF0000);
    circle(pos.x, pos.y, r);
    stroke(#FF0000);
    noFill();
    circle(pos.x, pos.y, ring);
    circle(pos.x, pos.y, ring*2);
    circle(pos.x, pos.y, ring*3);
    text(name, pos.x, pos.y);
  }
  
  void update() {
    for (Group g : friendGroups) {
      if (pos.copy().dist(g.pos) < ring*3)
        pos.add(pos.copy().sub(g.pos).normalize().mult(random(0.3,0.5)));
      if (pos.x > width-ring*2)
        pos.x = width-ring*2;
      if (pos.x < ring*2)
        pos.x = ring*2;
      if (pos.y > height-ring*2)
        pos.y = height-ring*2;
      if (pos.y < ring*2)
        pos.y = ring*2;
    }
    for (Contact c : groupMembers) {
      float dist = c.pos.dist(pos);
      if (dist > ring/2) {
        c.attract(pos);
      } else if (dist < ring/2*0.9) {
        c.repel(pos);
      } else {
        c.orbit(pos);
      }
    }
  }
}

void mouseReleased() {

}
