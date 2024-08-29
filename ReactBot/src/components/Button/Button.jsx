const Button = (props) => {
  return (
    <button className={"button" + props.className} {...props}>
      Button
    </button>
  );
};

export default Button;
