/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";

interface LineResultProps {
  quality: string;
  value: string;
}

function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value);
}

export default function LineResult(props: LineResultProps) {
  const [quality, setQuality] = useState(props.quality);
  const [value, setValue] = useState(props.value);

  return (
    <li
      class={tw`px-6 py-2 border-b border-gray-200 w-full rounded-t-lg`}
      key={quality}
    >
      <span
        class={tw
          `text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded-full`}
      >
        {quality}
      </span>

      <a
        href="#"
        class={tw
          `ml-3 text-blue-400 hover:text-blue-500 transition duration-300 ease-in-out mb-4`}
        onClick={() => copyToClipboard(value)}
      >
        Copy to clipboard
      </a>
    </li>
  );
}
