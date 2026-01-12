import { useLocalStorage } from "@uidotdev/usehooks";
import emmet from "emmet-core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-tsx";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-html";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";

import Beautify from "ace-builds/src-noconflict/ext-beautify";
import Emmet from "ace-builds/src-noconflict/ext-emmet";
Emmet.isSupportedMode = () => true;

Emmet.setCore(emmet);
import { useRef } from "react";
import { initDataEditors } from "../utils/initData.ts";

export const CodeEditor = ({ selected, code, onChange }: any) => {
  const [tabSize, setTabSize] = useLocalStorage<number>("tabSize", 2);
  const editorRef = useRef(null);
  console.log({ Emmet });

  const onPrettier = () => {
    if (editorRef.current?.editor) {
      Beautify.beautify(editorRef.current?.editor.getSession());
    }
  };

  const selectedCode = code[selected];
  console.log({ tabSize });
  return (
    <div className="flex flex-1 h-full">
      <AceEditor
        mode="tsx"
        theme="monokai"
        value={selectedCode}
        onChange={onChange}
        editorProps={{ $blockScrolling: true }}
        tabSize={tabSize}
        style={{ width: "100%", height: "calc(100% - 25px)" }}
        ref={editorRef}
        commands={Emmet.commands}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          enableAutoIndent: true,
          enableEmmet: true,
        }}
      />
      <div className="flex-auto flex">
        <button title="Format (Ctrl+Shift+B)" className="mx-4 px-3  border-1 border-orange-500" onClick={onPrettier}>
          --format
        </button>
        <div>indent:</div>
        <input
          value={tabSize}
          onChange={(ev) => setTabSize(parseInt(ev.target.value))}
          type="number"
          min={1}
          max={16}
          className="min-w-5 ml-3"
        />
      </div>
    </div>
  );
};
