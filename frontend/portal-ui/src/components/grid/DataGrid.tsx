import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { FilterCondition } from "./types";

type ApiResponse =
    | Record<string, unknown>[]
    | {
        totalCount?: number;
        data?: Record<string, unknown>[];
    };

type Props = {
    token: string;
    onTotalChange: (total: number) => void;
    onColumnsChange?: (columns: string[]) => void;
    appliedFilters: FilterCondition[];
    sortColumn: string;
    sortDirection: "asc" | "desc";
    onSortChange: (col: string, dir: "asc" | "desc") => void;

    // 🔥 NUOVI PROPS
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
};

export default function DataGrid({
    token,
    onTotalChange,
    onColumnsChange,
    appliedFilters,
    sortColumn,
    sortDirection,
    onSortChange,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange
}: Props) {
    const [rows, setRows] = useState<Record<string, unknown>[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axios.post<ApiResponse>(
                `http://localhost:5202/api/portal/demo/views/users/query`,
                {
                    page,
                    pageSize,
                    sortColumn,
                    sortDirection,
                    filters: appliedFilters
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            let safeData: Record<string, unknown>[] = [];
            let totalCount = 0;

            if (Array.isArray(response.data)) {
                safeData = response.data;
                totalCount = response.data.length;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                safeData = response.data.data;
                totalCount =
                    response.data.totalCount ?? response.data.data.length;
            }

            setRows(safeData);
            setTotal(totalCount);
            onTotalChange(totalCount);

            if (safeData.length > 0) {
                const dynamicColumns = Object.keys(safeData[0]);
                setColumns(dynamicColumns);
                onColumnsChange?.(dynamicColumns);
            } else {
                setColumns([]);
            }
        } catch (err) {
            console.error("Grid fetch error:", err);
            setRows([]);
            setColumns([]);
            setTotal(0);
            onTotalChange(0);
        } finally {
            setLoading(false);
        }
    }, [
        token,
        page,
        pageSize,
        sortColumn,
        sortDirection,
        appliedFilters,
        onTotalChange,
        onColumnsChange
    ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleSort = (column: string) => {
        if (sortColumn === column) {
            const newDir = sortDirection === "asc" ? "desc" : "asc";
            onSortChange(column, newDir);
        } else {
            onSortChange(column, "asc");
        }
    };

    const formatValue = (value: unknown) => {
        if (value === null || value === undefined) return "";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (typeof value === "string" && value.includes("T")) {
            const date = new Date(value);
            if (!isNaN(date.getTime()))
                return date.toLocaleDateString("it-IT");
        }
        return String(value);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)]">
            <div className="flex-1 overflow-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => toggleSort(col)}
                                    className="px-4 py-3 text-left cursor-pointer select-none border-b"
                                >
                                    {col}
                                    {sortColumn === col &&
                                        (sortDirection === "asc"
                                            ? " ↑"
                                            : " ↓")}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length > 0
                                            ? columns.length
                                            : 1
                                    }
                                    className="text-center py-6"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length > 0
                                            ? columns.length
                                            : 1
                                    }
                                    className="text-center py-6"
                                >
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-slate-50"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            className="px-4 py-2"
                                        >
                                            {formatValue(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="border-t bg-white px-4 py-3 text-sm flex justify-between items-center sticky bottom-0">
                <div className="flex items-center gap-4">
                    <div>
                        Total records: <strong>{total}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>Per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) =>
                                onPageSizeChange(Number(e.target.value))
                            }
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span>
                        Page {page} of{" "}
                        {Math.max(Math.ceil(total / pageSize), 1)}
                    </span>

                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        disabled={page * pageSize >= total}
                        onClick={() => onPageChange(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}