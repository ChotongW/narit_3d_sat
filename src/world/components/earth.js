import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
} from "three";

const createEarth = () => {
  const texture = new TextureLoader().load("/images/globe_west_2048.png");
  const spec = {
    map: texture,
  };
  const globe = new Mesh(
    new SphereGeometry(2, 32, 32),
    new MeshStandardMaterial(spec)
  );
  globe.rotation.set(-0.5, -0.1, 0.8);
  return globe;
};

export { createEarth };
