import { extend, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  useFrame((_state) => {
    controls.current.update();
  });
  return <orbitControls args={[camera, domElement]} ref={controls} />;
};

export default CameraControls;
