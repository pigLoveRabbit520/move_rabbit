import GameDemo from '../src/index'
import { PhysicsLoader } from '@enable3d/ammo-physics';

PhysicsLoader('/ammo', () => {
  let element = document.getElementById('myThree');
  new GameDemo({
    element,
    width: element.clientWidth,
    height: element.clientHeight,
  })
});
