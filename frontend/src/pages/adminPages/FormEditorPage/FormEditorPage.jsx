import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FIELD_TYPES = [
  "text",
  "textarea",
  "radio",
  "checkbox",
  "date",
  "email",
  "number",
  "password",
];

const FormEditorPage = () => {
  const navigate = useNavigate();
  const { catId } = useParams();
  const [fields, setFields] = useState([]);
  const [category, setCategory] = useState(null);
  const [savedFields, setSavedFields] = useState([]);
  const deleteUnsavedField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    options: [""],
  });

  useEffect(() => {
    fetchSavedForm();
  }, []);

  const fetchSavedForm = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/get-form/${catId}`
      );
      if (res.data && res.data.fields) {
        setSavedFields(res.data.fields);
      }
    } catch (err) {
      console.error("Error fetching form:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/admin/get-single-category/${catId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
      })

      .catch((err) => console.error("Error fetching Category:", err));
  }, [catId]);

  const handleFieldChange = (e) => {
    setNewField({ ...newField, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newField.options];
    updatedOptions[index] = value;
    setNewField({ ...newField, options: updatedOptions });
  };

  const addOption = () => {
    setNewField({ ...newField, options: [...newField.options, ""] });
  };

  const addField = () => {
    setFields([...fields, newField]);
    setNewField({ label: "", type: "text", options: [""] });
  };

  const saveForm = async () => {
    try {
      await axios.post("http://localhost:5000/admin/save-form", {
        title: catId,
        fields: [...savedFields, ...fields],
      });
      toast.success("Form saved successfully");
      setFields([]);
      fetchSavedForm();
      navigate("/admin/view-all-category");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deleteSavedField = async (index) => {
    try {
      const updatedFields = savedFields.filter((_, i) => i !== index);
      await axios.post("http://localhost:5000/admin/save-form", {
        title: catId,
        fields: updatedFields,
      });
      setSavedFields(updatedFields);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="sm:px-4 md:px-6 py-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-black">
        Edit Form: {category?.name || "Loading..."}
      </h2>

      {/* Add Field Row */}
      <div className="flex gap-4 items-center flex-wrap mb-6 border p-4 rounded-md">
        <input
          type="text"
          name="label"
          placeholder="Field Label"
          value={newField.label}
          onChange={handleFieldChange}
          className="border px-3 py-2 w-40"
        />
        <select
          name="type"
          value={newField.type}
          onChange={handleFieldChange}
          className="border px-3 py-2 w-40"
        >
          {FIELD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        {(newField.type === "radio" || newField.type === "checkbox") && (
          <div className="flex flex-wrap items-center gap-2">
            {newField.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="border px-3 py-2 w-32"
              />
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 underline"
            >
              + Add Option
            </button>
          </div>
        )}

        <button
          onClick={addField}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Field
        </button>
      </div>

      {/* Unsaved Fields Preview */}
      {fields.length > 0 && (
        <div className="mb-6 border p-4 rounded">
          <h3 className="font-semibold mb-2">Unsaved Fields:</h3>
          {fields.map((f, i) => (
            <div
              key={i}
              className="mb-2 text-gray-700 flex justify-between items-center"
            >
              <span>
                {f.label} ({f.type}){" "}
                {(f.type === "radio" || f.type === "checkbox") &&
                  `- Options: ${f.options.join(", ")}`}
              </span>
              <button
                onClick={() => deleteUnsavedField(i)}
                className="text-red-600 text-sm font-bold"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={saveForm}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Form
      </button>

      {savedFields.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-bold mb-3">Saved Fields</h3>
          {savedFields.map((field, i) => (
            <div
              key={i}
              className="mb-2 text-gray-800 flex justify-between items-center"
            >
              <span>
                {field.label} ({field.type}){" "}
                {(field.type === "radio" || field.type === "checkbox") &&
                  `- Options: ${field.options.join(", ")}`}
              </span>
              <button
                onClick={() => deleteSavedField(i)}
                className="text-red-600 text-sm font-bold"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormEditorPage;
