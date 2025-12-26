type PropTypes = {
  width?: number;
};

const CalcLogo = (props: PropTypes) => {
  const { width = 150 } = props;

  return (
    <div
      style={{
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <a
        href="https://be-exchange.org/ll97-calculator/"
        target="_blank"
        rel="noreferrer"
      >
        <img width={width} alt="a" src="beex_CC_art_webheader.webp"></img>
      </a>
    </div>
  );
};

export default CalcLogo;
