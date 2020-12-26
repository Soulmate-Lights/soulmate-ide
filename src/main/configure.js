import Header from "~/components/Header";

const flashConfigToChip = (config) => {};

const sections = "rounded-lg overflow-hidden border-2";

const Section = (props) => (
  <div className="p-4 border-t-2 first:border-t-0" {...props} />
);

{
  /* <p class="mt-1 max-w-2xl text-sm text-gray-500">
  This information will be displayed publicly so be careful what you share.
</p> */
}

const Title = ({ children }) => (
  <h3 className="text-lg font-medium text-gray-900 leading-6">{children}</h3>
);

const Configure = () => {
  const [config, setConfig] = useState({});

  const setValue = (key, value) => {
    setConfig({ ...config, key: value });
  };

  const valid = false;

  return (
    <div className="flex-grow">
      <Header title="Configure your Soulmate" />

      <div className="p-8">
        <div className={sections}>
          <Section>
            <Title>Layout</Title>
            <input placeholder="rows" />
            <input placeholder="columns" />
          </Section>

          <Section>
            <Title>Power</Title>
            <input placeholder="2000" />
          </Section>

          <Section>
            <Title>What kind of LEDs are you using?</Title>
            <input type="radio" />
            Three-wire
            <input type="radio" />
            Four-wire
          </Section>

          <Section>
            <Title>What kind of ESP32 are you using?</Title>
            <div>M5 chip</div>

            <div>Custom chip</div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Configure;
