import { createContainer } from "unstated-next";

const SketchesContainer = () => {
  const [selected, setSelected] = useState([]);

  return { selected, setSelected };
};

export default createContainer(SketchesContainer);
