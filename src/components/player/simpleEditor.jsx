import React, { useRef, useState, useEffect } from "react";

export default function Editor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState([]);

  const formatText = (command, value = null) => {
    const isActive = document.queryCommandState(command);
    if (isActive) {
      document.execCommand(command, false, null);
    } else {
      document.execCommand(command, false, value);
    }
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    setActiveFormats(formats);
  };

  const clearFormat = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const contents = range.cloneContents();

    const textOnly = document.createDocumentFragment();
    contents.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textOnly.appendChild(node.cloneNode());
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        textOnly.appendChild(document.createTextNode(node.textContent));
      }
    });

    range.deleteContents();
    range.insertNode(textOnly);
    selection.removeAllRanges();
    updateActiveFormats();
    if (onChange) onChange(editorRef.current.innerHTML);
  };

  const applyColor = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const wrapper = document.createElement("span");
    wrapper.style.color = color;

    try {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
      selection.removeAllRanges();
      updateActiveFormats();
      if (onChange) onChange(editorRef.current.innerHTML);
    } catch (e) {
      console.error("Color error:", e);
    }
  };

  const insertLinkDirectly = () => {
    const url = prompt("Enter URL:");
    if (!url) return;

    const editor = editorRef.current;
    if (!editor) return;

    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.target = "_blank";
    linkElement.rel = "noopener noreferrer";
    linkElement.textContent = url;

    editor.appendChild(linkElement);
    editor.appendChild(document.createTextNode(" "));
    updateActiveFormats();
    if (onChange) onChange(editor.innerHTML);
  };

  const handleInput = () => {
    if (!onChange) return;
    onChange(editorRef.current.innerHTML);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => {
      document.removeEventListener("selectionchange", updateActiveFormats);
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      {/* Toolbar */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => formatText("bold")}
          className={activeFormats.includes("bold") ? "active" : ""}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => formatText("italic")}
          className={activeFormats.includes("italic") ? "active" : ""}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => formatText("underline")}
          className={activeFormats.includes("underline") ? "active" : ""}
          type="button"
        >
          Underline
        </button>
        <button onClick={clearFormat} type="button">
          Clear
        </button>
        <button onClick={() => applyColor("red")} type="button">
          Red
        </button>
        <button onClick={() => applyColor("blue")} type="button">
          Blue
        </button>
        <button onClick={insertLinkDirectly} type="button">
          Add Link
        </button>
      </div>

      {/* Content Editable Div */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          minHeight: "300px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "16px",
          lineHeight: "1.6",
          background: "white",
          whiteSpace: "pre-wrap",
          outline: "none",
        }}
        data-placeholder={placeholder}
      ></div>

      {/* Styles */}
      <style>
        {`
          button {
            padding: 6px 12px;
            font-size: 14px;
            border: 1px solid #ccc;
            background: #f9f9f9;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background: #eee;
          }
          button.active {
            background: #4f46e5;
            color: white;
            border-color: #4f46e5;
          }
          div[contenteditable][data-placeholder]:empty::before {
            content: attr(data-placeholder);
            color: #999;
            pointer-events: none;
            display: block; /* Chrome fix */
          }
        `}
      </style>
    </div>
  );
}