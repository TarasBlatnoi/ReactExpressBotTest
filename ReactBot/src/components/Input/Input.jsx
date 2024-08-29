const Input = ({ name, id, type, label, divClassName = "", ...props }) => {
  return (
    <div className={`${divClassName}`}>
      <label htmlFor={id}>{label}</label>
      <br />
      <input type={type} id={id} name={name} {...props} />
    </div>
  );
};

export default Input;
