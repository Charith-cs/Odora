import { useState } from "react";
import type { AdminTableProps } from "../../../../types/types";

const Table = <T extends Record<string, any>>({
    columns,
    data,
    title,
    actions,
}: AdminTableProps<T>) => {

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredData = data.filter((item) => {
        return columns.some((col) =>
            String(item[col.key] ?? "")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    });


    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className=" p-2">
            <h1 className="text-2xl md:text-3xl  font-semibold">{title}</h1>

            <div className="  h-4/5 overflow-x-auto overflow-y-auto">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between my-4">

                    <div className="relative w-[90vw] md:w-2/3 ml-2">
                        <input
                            type="text"
                            placeholder="Search ..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className=" w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>

                </div>


                <table className="hidden md:table w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            {columns.map((col) => (
                                <th key={String(col.key)} className="px-4">
                                    {col.label}
                                </th>
                            ))}
                            {actions && <th className="px-4">Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="text-center py-6 text-gray-400"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-4">
                                            {col.render
                                                ? col.render(row[col.key], row, index)
                                                : row[col.key]}
                                        </td>
                                    ))}

                                    {actions && (
                                        <td className="px-4 py-4">{actions(row, index)}</td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="block md:hidden">
                {paginatedData.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm font-medium text-gray-500">
                        No data found
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedData.map((row, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="grid grid-cols-2 gap-4">

                                    <div className="space-y-3">
                                        {columns
                                            .slice(0, Math.ceil(columns.length / 2))
                                            .map((col) => (
                                                <div key={String(col.key)}>
                                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        {col.label}
                                                    </div>

                                                    <div className="break-words text-sm font-medium text-gray-700">
                                                        {col.render
                                                            ? col.render(row[col.key], row, index)
                                                            : row[col.key]}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="space-y-3">
                                        {columns
                                            .slice(Math.ceil(columns.length / 2))
                                            .map((col) => (
                                                <div key={String(col.key)}>
                                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        {col.label}
                                                    </div>

                                                    <div className="break-words text-sm font-medium text-gray-700">
                                                        {col.render
                                                            ? col.render(row[col.key], row, index)
                                                            : row[col.key]}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                </div>

                                {actions && (
                                    <>
                                        <div className="my-4 h-px bg-gray-100" />

                                        <div className="flex flex-wrap justify-end gap-2">
                                            {actions(row, index)}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Table;