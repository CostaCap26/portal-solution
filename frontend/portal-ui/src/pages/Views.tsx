import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DataGrid from "../components/grid/DataGrid";
import GridToolbar from "../components/grid/GridToolbar";
import { useState } from "react";
import axios from "axios";
import type { FilterCondition } from "../components/grid/types";

export default function Views() {
    const { slug, datasetId } = useParams();
    const { auth } = useAuth();

    const numericDatasetId = datasetId ? Number(datasetId) : null;

    const [total, setTotal] = useState<number>(0);
    const [columns, setColumns] = useState<string[]>([]);

    const [filters, setFilters] = useState<FilterCondition[]>([]);
    const [appliedFilters, setAppliedFilters] = useState<FilterCondition[]>([]);

    const [sortColumn, setSortColumn] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // 🔥 PAGE STATE CENTRALIZZATO
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    if (!auth) return <Navigate to="/" replace />;
    if (!slug || !numericDatasetId) return <div>View non valida</div>;

    const handleApplyFilters = () => {
        setPage(1);
        setAppliedFilters(filters);
    };

    const handleResetFilters = () => {
        setFilters([]);
        setAppliedFilters([]);
        setPage(1);
    };

    const handleSortChange = (col: string, dir: "asc" | "desc") => {
        setSortColumn(col);
        setSortDirection(dir);
    };

    // 🔥 EXPORT ORA USA LA PAGINA CORRENTE
    const handleExport = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5202/api/portal/${slug}/views/users/export`,
                {
                    page,
                    pageSize,
                    sortColumn,
                    sortDirection,
                    filters: appliedFilters
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    },
                    responseType: "blob"
                }
            );

            const blob = response.data as Blob;
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "export.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Export error:", err);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-50">

            <GridToolbar
                total={total}
                columns={columns}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onExport={handleExport}
            />

            <DataGrid
                token={auth.token}
                onTotalChange={setTotal}
                onColumnsChange={setColumns}
                appliedFilters={appliedFilters}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />

        </div>
    );
}