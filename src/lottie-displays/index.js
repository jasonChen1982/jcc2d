import {
  DisplayRegister,
  LoaderRegister,
} from '../lottie-core/index';

import {LottieLoader} from '../utils/Loader';
LoaderRegister.registerLoader(LottieLoader);

import CompElement from './core/CompElement';
import PathPrimitive from './core/PathPrimitive';
// import PathLottie from './core/PathLottie';
import SolidElement from './core/SolidElement';
import SpriteElement from './core/SpriteElement';

DisplayRegister.setDisplayByType(DisplayRegister.Type.Null, CompElement);
DisplayRegister.setDisplayByType(DisplayRegister.Type.Path, PathPrimitive);
// DisplayRegister.setDisplayByType(DisplayRegister.Type.Path, PathLottie);
DisplayRegister.setDisplayByType(DisplayRegister.Type.Shape, CompElement);
DisplayRegister.setDisplayByType(DisplayRegister.Type.Solid, SolidElement);
DisplayRegister.setDisplayByType(DisplayRegister.Type.Sprite, SpriteElement);
DisplayRegister.setDisplayByType(DisplayRegister.Type.Container, CompElement);
