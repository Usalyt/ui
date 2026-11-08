import React from "react";
import { Combobox } from "tu-ui";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
];

export function ComboboxDemo() {
  const [selected, setSelected] = React.useState("");

  return (
    <div className="w-64">
      <Combobox
        options={frameworks}
        value={selected}
        onChange={setSelected}
        placeholder="Select framework..."
      />
    </div>
  );
}
