import GameDemo from '../src/index'


let element = document.getElementById('myThree');
new GameDemo({
  element,
  width: element.clientWidth,
  height: element.clientHeight,
})
