// components/TableComponent.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const TableComponent = ({
  title,
  columns,
  data,
  searchTerm,
  setSearchTerm,
  addPath,
  handleToggleActive,
  handleDelete,
  showAddButton = true,
  showActiveColumn = true,
  showActionColumn = true,
  viewLabel = null,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 rounded shadow-md w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Search */}
        {searchTerm !== undefined && setSearchTerm !== undefined && (
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-xl w-full sm:w-1/3 border-black text-black"
          />
        )}
        {/* Add Button */}
        {showAddButton && (
          <button
            onClick={() => navigate(addPath)}
            className="hover:bg-blue-900 text-white px-4 py-2 rounded-xl cursor-pointer bg-gray-800 w-full sm:w-auto"
          >
            + Add {title}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 ">
          <thead className="text-white bg-gray-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 border border-gray-200">
                  {col}
                </th>
              ))}
              {showActiveColumn && (
                <th className="px-4 py-2 border border-gray-200">Active</th>
              )}
              {showActionColumn && (
                <th className="px-4 py-2 border border-gray-200">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-100">
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-2 border text-gray-500 border-gray-200"
                    >
                      {row[col] ?? "--"}
                    </td>
                  ))}
                  {showActiveColumn && (
                    <td className="px-4 py-2 text-center border border-gray-200">
                      <input
                        type="checkbox"
                        checked={row.isActive}
                        onChange={() =>
                          handleToggleActive(row.id, !row.isActive)
                        }
                        className="form-radio text-blue-600"
                      />
                    </td>
                  )}
                  {/* Action column (last column) */}
                  {showActionColumn && (
                    <td className="px-4 py-2 border text-center border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        {row.editPath && (
                          <Link
                            to={`${row.editPath || `/edit/${row.id}`}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        {row.viewSubPath && (
                          <Link
                            to={row.viewSubPath}
                            className="text-green-600 hover:text-green-800 mx-1"
                            title={`View ${viewLabel || title}`}
                          >
                            View {viewLabel || title}
                          </Link>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showActiveColumn ? 1 : 0) +
                    (showActionColumn ? 1 : 0)
                  }
                  className="text-center py-4 text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
