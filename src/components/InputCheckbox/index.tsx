import classNames from "classnames";
import { useRef, useEffect, useState } from "react";
import { InputCheckboxComponent } from "./types";

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`);
  const [isChecked, setIsChecked] = useState(() => {
    // Initialize the state from local storage if available, or use the provided `checked` prop
    const storedState = localStorage.getItem(inputId);
    return storedState !== null ? JSON.parse(storedState) : checked;
  });

  // Save the checkbox state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(inputId, JSON.stringify(isChecked));
  }, [inputId, isChecked]);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": isChecked, // Apply checked style when isChecked is true
          "RampInputCheckbox--label-disabled": disabled,
        })}
        onClick={toggleCheckbox} // Toggle the checkbox when the label is clicked
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={isChecked}
        disabled={disabled}
        onChange={() => {
          setIsChecked(!isChecked); // Toggle the isChecked state when the input changes (for accessibility)
          onChange(!isChecked); // Notify parent component of the change
        }}
      />
    </div>
  );
};
