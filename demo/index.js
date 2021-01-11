import GameDemo from '../src/index'


let element = document.getElementById('myThree')
console.log(`begin for threejs`)
new GameDemo({
  element,
  width: element.clientWidth,
  height: element.clientHeight,
})
