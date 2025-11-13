import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const AdminTable = ({ columns, data, renderActions, loading }) => (
  <div className="admin-card overflow-hidden">
    {loading ? (
      <div className="flex flex-col justify-center items-center p-12">
        <LoadingSpinner />
        <p className="mt-4 text-lg admin-body">
          Chargement des articles...
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full">
          <thead className="bg-blue-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="admin-table-header px-6 py-4 text-left admin-body-small font-semibold uppercase tracking-wider text-blue-700"
                >
                  {column.label}
                </th>
              ))}
              <th className="admin-table-header px-6 py-4 text-right admin-body-small font-semibold uppercase tracking-wider text-blue-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="admin-table-body divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-8 text-center admin-body text-gray-500 italic"
                >
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="admin-table-row hover:bg-blue-25 transition duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="admin-table-cell px-6 py-4 whitespace-nowrap admin-body"
                    >
                      {column.render ? (
                        column.render(item[column.key], item)
                      ) : column.key === "title" ? (
                        <p className="admin-body font-semibold">{item[column.key]}</p>
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                  <td className="admin-table-cell px-6 py-4 whitespace-nowrap text-right admin-body font-medium">
                    {renderActions(item)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AdminTable;
