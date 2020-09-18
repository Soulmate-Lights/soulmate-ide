import useInterval from "@use-it/interval";
import { Canvas, extend, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

function Box({ color, ...props }) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  return (
    <mesh {...props} ref={mesh} scale={[0.5, 0.5, 0.5]}>
      <sphereBufferGeometry args={[1.2, 16, 16]} attach="geometry" />
      <meshStandardMaterial
        attach="material"
        color={color || "red"}
        opacity={1}
      />
    </mesh>
  );
}

let offset = 0;

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((/* state */) => {
    controls.current.update();
  });
  return <orbitControls args={[camera, domElement]} ref={controls} />;
};

const Boxes = () => {
  const boxes = [];

  useFrame((/* state */) => {
    offset++;
  });

  for (let x = -10; x < 10; x += 2) {
    for (let y = -10; y < 10; y += 2) {
      for (let z = -10; z < 10; z += 2) {
        const hue = x * 5 + y * 5 + z * 5 + offset * 2;
        boxes.push(
          <Box
            color={`hsl(${Math.abs(hue)}, 100%, 50%)`}
            position={[x, y, z]}
          />
        );
      }
    }
  }

  return boxes;
};

const Drawer = () => {
  const [offset, setOffset] = useState(0);
  useInterval(() => {
    setOffset(offset + 1);
  }, 1);

  return (
    <div style={{ width: "100%", height: "100%", outline: "none" }}>
      <Canvas
        camera={{
          fov: 1000,
          near: 0.1,
          far: 1000,
          position: [0, 0, -30],
        }}
        colorManagement
        pixelRatio={window.devicePixelRatio}
        scroll={{ resize: false }}
        style={{ outline: "none" }}
      >
        <CameraControls />
        <directionalLight intensity={0.5} />

        <ambientLight intensity={0.2} />
        <spotLight angle={0.15} penumbra={1} position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />

        <Boxes />
      </Canvas>
    </div>
  );
};

export default Drawer;
