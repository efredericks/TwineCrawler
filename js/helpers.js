function randomInt(min, max) {  
  return Math.floor(Math.random()*(max-min)+min);
} 
function randomEnum(obj) {
  return Math.floor(Math.random() * Object.keys(obj).length);
}
function randomListItem(obj) {
 return obj[Math.floor(Math.random() * obj.length)];
}

function getRandomFreeCellIndex(cells) {
  return Math.floor(Math.random() * cells.length);
}