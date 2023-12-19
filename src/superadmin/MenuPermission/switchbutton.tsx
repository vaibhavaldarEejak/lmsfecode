import React from "react";
import { InputSwitch } from "primereact/inputswitch";

type Props = {
  status: any;
  handleChange: (e: any) => void;
  labelOn?: any;
  labelOff?: any;
};

const SwitchButton: React.FC<Props> = ({
  handleChange,
  status,
  labelOn,
  labelOff,
}) => {
  return (
    <>
      <InputSwitch
        checked={status}
        style={{ borderRadius: "20px" }}
        onChange={() => handleChange(!status)}
      ></InputSwitch>
    </>
  );
};

SwitchButton.defaultProps = {
  labelOn: "Draft",
  labelOff: "Published",
};

export { SwitchButton };
