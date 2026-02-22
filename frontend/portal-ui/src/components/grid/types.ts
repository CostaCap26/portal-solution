export type FilterCondition = {
    field: string;
    operator: string;
    value: string;
    logic: "AND" | "OR";
};
