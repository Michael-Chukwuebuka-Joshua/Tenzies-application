export default function Die(props) {
  return (
    <button
    disabled={props.disabled}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
      className={`die ${props.isHeld ? "held" : ""}`}
      onClick={props.hold}
    >
      {props.value}
    </button>
  );
}
