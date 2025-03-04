import { Input } from "@headlessui/react";
import { ChangeEvent } from "react";

type textInputProps = {
  label: string;
  name: string;
  isRequired?: boolean;
  placeholder?: string;
  type: "text" | "email" | "tel";
  onChange: (name: string, value: string) => void;
};

const TextInput: React.FC<textInputProps> = ({
  label,
  placeholder,
  name,
  type,
  onChange,
}) => {
  return (
    <section id="text-input" className="my-4 mx-4">
      <label className="text-xs">{label}</label>
      <div>
        <Input
          name={name}
          placeholder={placeholder}
          type={type}
          className="p-4 mt-2 rounded-lg border border-neutral-400 w-full h-[56px] data-[focus]:outline-green-light"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(name, e.target.value)
          }
        />
      </div>
    </section>
  );
};

export default TextInput;
