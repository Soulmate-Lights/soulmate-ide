const Boxes = ({ pixels }) => {
  const boxes = [];
  if (!pixels) return null;
  let i = 0;

  for (let x = -10; x < 10; x += 2) {
    for (let y = -10; y < 10; y += 2) {
      for (let z = -10; z < 10; z += 2) {
        boxes.push(
          <mesh key={`${x}-${y}-${z}`} position={[x, y, z]} scale={[1, 1, 1]}>
            <sphereBufferGeometry args={[0.6, 24, 0]} attach="geometry" />
            <meshStandardMaterial
              attach="material"
              color={`rgb(${pixels[i]?.r}, ${pixels[i]?.g}, ${pixels[i]?.b})`}
              opacity={1}
            />
          </mesh>
        );
        i++;
      }
    }
  }

  return boxes;
};

export default Boxes;
