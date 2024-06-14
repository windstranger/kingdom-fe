export const Button = (props) => {
  return (
    <button className={'p-4 rounded border'} {...props}>
      {props.children}
    </button>
  );
};
