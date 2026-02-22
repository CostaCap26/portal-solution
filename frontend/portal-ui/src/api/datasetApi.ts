import axios from "axios";

export interface ViewFilter {
    field: string;
    operator: string;
    value: string;
    logic: string;
}

export interface ViewQueryRequest {
    page: number;
    pageSize: number;
    sortColumn?: string;
    sortDirection?: string;
    filters?: ViewFilter[];
}

export interface DatasetResult {
    data: Record<string, unknown>[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export const runDataset = async (
    datasetId: number,
    request: ViewQueryRequest
): Promise<DatasetResult> => {
    const response = await axios.post(
        `/api/datasets/${datasetId}/run`,
        request
    );

    return response.data;
};
