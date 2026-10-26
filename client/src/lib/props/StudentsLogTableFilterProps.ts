export default interface StudentsLogTableFilterProps {
    orderValue: string;
    inAlphabeticalOrder: () => void;  
    nameFilter: string;
    onFilterChange: (value: string) => void;
    selectedClassYear: "CURRENT" | "NEXT" | null;
    onClassYearChange: (classYear: "CURRENT" | "NEXT") => void;
    onClearFilters: () => void;
}
