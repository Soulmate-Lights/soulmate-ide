import { useSWR } from "~/hooks/useSWR";

const SoulmateEditor = ({ selectedSoulmate }) => {
  const buildId = selectedSoulmate.build;
  const data = useSWR(`https://editor.soulmatelights.com/build/${buildId}`);

  const { sketches = [], config = {} } = data;

  return (
    <div>
      <div>{sketches.map((s) => s.name)}</div>
      {JSON.stringify(config)}
    </div>
  );
};

export default SoulmateEditor;
