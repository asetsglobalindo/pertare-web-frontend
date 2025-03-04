import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type selectInputProps = {
  label: string;
  name: string;
  selected: { id: number; name: string };
  onChange: (value: { id: number; name: string }) => void;
};

const collaborationType = [
  { id: 0, name: "Jenis Kolaborasi" },
  { id: 1, name: "Kerjasama Komunitas" },
  { id: 2, name: "Ide/Inisiatif Program" },
];

const SelectInput: React.FC<selectInputProps> = ({
  label,
  name,
  selected,
  onChange,
}) => {
  return (
    <section id="select-input" className="flex flex-col mb-4 mx-4">
      <label className="text-xs">{label}</label>
      <Listbox value={selected} onChange={onChange} name={name}>
        {({ open }) => (
          <section>
            <ListboxButton className="mt-2 w-[328px] md:w-[368px] h-[56px] text-left p-4  relative outline-1 block border border-neutral-400 rounded-lg data-[open]:border-green-light data-[open]:border-2">
              {selected.name}
              <ChevronDownIcon
                className={clsx(
                  "group pointer-events-none absolute top-2.5 right-2.5 size-6 fill-neutral-900",
                  open && "rotate-180"
                )}
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="border border-neutral-400 w-[368px] max-h-[192px] text-left bg-white"
            >
              {collaborationType.map((type) => (
                <ListboxOption
                  key={type.id}
                  value={type}
                  className="group flex gap-2 bg-white data-[focus]:bg-blue-100 data-[selected]:bg-green-light data-[selected]:text-white p-4"
                >
                  {type.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </section>
        )}
      </Listbox>
    </section>
  );
};

export default SelectInput;
