import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";

import "./dy.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter link URL", previousUrl);

    if (url === null) {
      return; // cancelled
    }

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("underline")
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Underline
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`px-2 py-1 rounded ${
          editor.isActive("link") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Link
      </button>
      
    </div>
  );
};

const DynamicForm = ({ fields, onSubmit, onChange, submitText = "Submit" }) => {
  const [formData, setFormData] = React.useState(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = field.value || "";
      return acc;
    }, {})
  );

  const editorsRef = React.useRef({});

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect TipTap editor content
    Object.keys(editorsRef.current).forEach((name) => {
      const editorInstance = editorsRef.current[name];
      if (editorInstance) {
        formData[name] = editorInstance.getHTML();
      }
    });

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full bg-white p-5 border border-gray-200 rounded-xl shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          let editor = null;

          if (field.type === "tiptap") {
            editor = useEditor({
              extensions: [StarterKit, Underline, Image, Link],
              content: formData[field.name],
              onUpdate: ({ editor }) => {
                // live preview (optional)
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: editor.getHTML(),
                }));
              },
            });

            editorsRef.current[field.name] = editor;
          }

          return (
            <div
              key={field.name}
              className={`flex flex-col ${
                field.type === "textarea" || field.type === "tiptap"
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <label className="mb-1 text-sm font-semibold text-gray-700">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={(e) => {
                    handleChange(e); // update local state
                    if (onChange) onChange(e.target.name, e.target.value); // notify parent
                  }}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              
              ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
                rows={field.rows || 4}
              />
              ) : field.type === "tiptap" ? (
              <div className="border border-gray-300 rounded-lg p-3 text-black">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} className="min-h-[200px]" />
              </div>
              ) : field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                accept="image/*"
                onChange={handleChange}
                className="block text-sm text-gray-700"
              />
              ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                readOnly={field.readOnly || false}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring text-black"
              />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
