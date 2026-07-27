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
            <h1 className="text-2xl md:text-3xl font-bold text-[#2596be]">{title}</h1>

            <div className="h-4/5 overflow-x-auto overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 my-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="relative w-full lg:w-2/3">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be] transition"
                            />
                        </div>
                    </div>
                </div>


                <table className="hidden md:table w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((col) => (
                                <th key={String(col.key)} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{col.label}</th>
                            ))}

                            {actions && (
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl">📄</span>
                                        <p className="font-semibold text-gray-500">No data found</p>
                                        <p className="text-sm">There are no records matching your search.</p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            paginatedData.map((row, index) => (
                                <tr key={index} className="hover:bg-sky-50 transition-colors duration-200">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-6 py-5 text-gray-700">
                                            {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                                        </td>
                                    ))}

                                    {actions && (
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center items-center gap-2 flex-wrap">{actions(row, index)}</div>
                                        </td>
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