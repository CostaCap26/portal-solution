import type { FilterCondition } from "./types";
import { Plus, Trash2, Filter, Download, RotateCcw } from "lucide-react";

type Props = {
    total: number;
    columns: string[];
    filters: FilterCondition[];
    onFiltersChange: (filters: FilterCondition[]) => void;
    onExport: () => void;
    onApply: () => void;
    onReset: () => void;
};

export default function GridToolbar({
    total,
    columns,
    filters,
    onFiltersChange,
    onExport,
    onApply,
    onReset
}: Props) {

    const updateFilter = (
        index: number,
        updated: Partial<FilterCondition>
    ) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], ...updated };
        onFiltersChange(newFilters);
    };

    const addFilter = () => {
        onFiltersChange([
            ...filters,
            {
                field: "",
                operator: "contains",
                value: "",
                logic: "AND"
            }
        ]);
    };

    const removeFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onFiltersChange(newFilters);
    };

    const operatorOptions = [
        { value: "contains", label: "Contains" },
        { value: "equals", label: "Equals" },
        { value: "notEquals", label: "Not Equals" },
        { value: "greater", label: "Greater Than" },
        { value: "less", label: "Less Than" },
        { value: "hasValue", label: "Has Value" },
        { value: "noValue", label: "No Value" }
    ];

    const activeFiltersCount = filters.filter(f => f.field).length;

    return (
        <div className="bg-white border-b shadow-sm">

            <div className="p-4 space-y-4">

                {/* HEADER ROW */}
                <div className="flex justify-between items-center">

                    {/* LEFT: Filters + small + button */}
                    <div className="flex items-center gap-3">

                        <span className="text-sm font-semibold text-gray-800">
                            Filters
                        </span>

                        {/* SMALL + BUTTON */}
                        <button
                            onClick={addFilter}
                            className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            <Plus size={12} />
                        </button>

                        {activeFiltersCount > 0 && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}

                    </div>

                    {/* RIGHT: ACTION BUTTONS */}
                    <div className="flex items-center gap-2 shrink-0">

                        <button
                            onClick={onApply}
                            disabled={activeFiltersCount === 0}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-40 transition"
                        >
                            <Filter size={14} />
                            Filter
                        </button>

                        <button
                            onClick={onReset}
                            disabled={activeFiltersCount === 0}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300 disabled:opacity-40 transition"
                        >
                            <RotateCcw size={14} />
                            Remove
                        </button>

                        <button
                            onClick={onExport}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition"
                        >
                            <Download size={14} />
                            Export
                        </button>

                    </div>
                </div>

                {/* FILTER AREA */}
                <div className="flex flex-wrap gap-3">

                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-slate-50 border rounded px-2 py-1"
                        >

                            {index > 0 && (
                                <select
                                    value={filter.logic}
                                    onChange={(e) =>
                                        updateFilter(index, {
                                            logic: e.target.value as "AND" | "OR"
                                        })
                                    }
                                    className="border rounded px-2 py-1 text-xs bg-white"
                                >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                </select>
                            )}

                            <select
                                value={filter.field}
                                onChange={(e) =>
                                    updateFilter(index, { field: e.target.value })
                                }
                                className="border rounded px-2 py-1 text-xs bg-white"
                            >
                                <option value="">Field</option>
                                {columns.map(col => (
                                    <option key={col} value={col}>
                                        {col}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filter.operator}
                                onChange={(e) =>
                                    updateFilter(index, {
                                        operator: e.target.value
                                    })
                                }
                                className="border rounded px-2 py-1 text-xs bg-white"
                            >
                                {operatorOptions.map(op => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>

                            {filter.operator !== "hasValue" &&
                                filter.operator !== "noValue" && (
                                    <input
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) =>
                                            updateFilter(index, {
                                                value: e.target.value
                                            })
                                        }
                                        className="border rounded px-2 py-1 text-xs w-32 bg-white"
                                    />
                                )}

                            <button
                                onClick={() => removeFilter(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={14} />
                            </button>

                        </div>
                    ))}

                </div>

                {/* FOOTER INFO */}
                <div className="text-xs text-gray-600 pt-2 border-t">
                    Total records: <strong>{total}</strong>
                </div>

            </div>

        </div>
    );
}
