import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/themes/prism-dark.css";

export default function CodeEditor({ code, language, onChange }) {
  return (
    <div className="grow w-full border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 min-h-[500px] bg-[#1d1f21] relative custom-scrollbar shadow-inner">
      <Editor
        value={code || ""}
        onValueChange={onChange}
        highlight={(code) =>
          highlight(code, languages[language] || languages.javascript, language)
        }
        padding={24}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          minHeight: "500px",
          backgroundColor: "transparent",
          color: "#f8f8f2",
        }}
        className="min-h-[500px]"
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
