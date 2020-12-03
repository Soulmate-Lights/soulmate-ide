const NameLabel = ({ value, onChange, disabled }) => {
  const [editing, setEditing] = useState(!value);

  if (editing)
    return (
      <input
        autoFocus
        className="inline p-1"
        defaultValue={value}
        onBlur={() => {
          onChange(value);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setEditing(false);
          if (e.key === "Enter") {
            onChange(e.target.value);
            setEditing(false);
          }
        }}
        type="text"
      />
    );

  return (
    <div
      className={classnames(
        "inline p-1 border-2 border-transparent rounded-lg",
        { "hover:border-white": !disabled }
      )}
      onClick={() => {
        if (!disabled) setEditing(true);
      }}
    >
      {value}
    </div>
  );
};

export default NameLabel;
