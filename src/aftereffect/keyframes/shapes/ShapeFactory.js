import CurveShape from './CurveShape';
// import EllipseShape from './EllipseShape';
// import RectShape from './RectShape';
// import StartShape from './StartShape';

/**
 * getShape
 * @ignore
 * @param {*} item data
 * @param {*} session session
 * @return {shape}
 */
function getShape(item, session) {
  let shape = null;
  switch (item.ty) {
  case 'sh':
    shape = new CurveShape(item, session);
    break;
  // case 'el':
  //   shape = new EllipseShape(item, session);
  //   break;
  // case 'rc':
  //   shape = new RectShape(item, session);
  //   break;
  // case 'sr':
  //   shape = new StartShape(item, session);
  //   break;
  default:
    break;
  }
  return shape;
}

export {getShape};
