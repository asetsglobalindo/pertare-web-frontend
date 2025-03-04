import { Checkbox, Field, Label } from "@headlessui/react";

type checkBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<checkBoxProps> = ({ checked, onChange }) => {
  const handleCheckboxChange = (e: boolean) => {
    onChange(e);
  };

  return (
    <Field className="flex items-center gap-2 md:mx-0 mx-4">
      <Checkbox
        checked={checked}
        onChange={(e: boolean) => handleCheckboxChange(e)}
        className="group block border border-neutral-400 size-5 rounded border bg-white data-[checked]:bg-green-light"
      >
        {/* Checkmark icon */}
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Checkbox>
      <Label className="cursor-pointer">
        Saya Setuju dengan ketentuan dari PT Pertamina Retail
      </Label>
    </Field>
  );
};

export default CheckBox;
