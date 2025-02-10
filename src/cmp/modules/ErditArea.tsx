type EditProps = {
  labelname: string;
  placeforder: string;
  value: string;
  name: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMassage: string;
};

export const EditTextArea = (props: EditProps) => {
  return (
    <div className="mt-3">
      <p style={{ color: "#C0C1C3" }} className="text-xs">
        {props.labelname}
      </p>
      <input
        type="text"
        className="border-0 border-b-2 border-gray-500 p-2 focus:outline-none focus:ring-0 focus:border-blue-500 mt-1"
        placeholder={props.placeforder}
        value={props.value}
        name={props.name}
        onChange={props.onchange}
      />
      {props.errorMassage && (
        <p className="text-red-500 text-xs mt-1">{props.errorMassage}</p>
      )}
    </div>
  );
};
