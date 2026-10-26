import StudentsLogTableFilterProps from "@/lib/props/StudentsLogTableFilterProps";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdCompareArrows } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

export default function StudentsLogTableFilter({
  orderValue,
  inAlphabeticalOrder,
  nameFilter,
  onFilterChange,
  selectedClassYear,
  onClassYearChange,
  onClearFilters,
}: StudentsLogTableFilterProps) {
  const handleOrderToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inAlphabeticalOrder();
  };

  return (
    <section className="flex flex-col justify-center items-center w-200 gap-2 p-4 bg-surface-container-lowest rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-center  w-full">
        <div className="flex items-center justify-center w-10 h-8 rounded-l-md bg-surface-container">
          <IoSearchSharp className="text-2xl p-0.5 font-sans font-bold text-outline bg-surface-container" />
        </div>
        <input
          type="text"
          placeholder="Filtrar alunos..."
          value={nameFilter ?? ""}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full h-8 bg-surface-container rounded-r-md border-none focus:outline-none focus:ring-0"
        />
      </div>
      <div className="flex items-center justify-between gap-4 w-full mt-1">
        <button
          onClick={handleOrderToggle}
          className=" flex justify-center items-center cursor-pointer gap-2 px-2 py-1 bg-surface-container rounded-lg border-none focus:outline-none"
        >
          <span className="text-xs font-sans font-bold text-on-surface-variant">
            Ordem
          </span>

          {orderValue === "asc" ? (
            <span className="flex justify-center items-center text-sm font-sans font-medium text-on-surface-variant">
              {" "}
              A<IoIosArrowRoundForward className="text-md" />Z{" "}
            </span>
          ) : orderValue === "desc" ? (
            <span className="flex justify-center items-center text-sm font-sans font-medium text-on-surface-variant">
              {" "}
              Z<IoIosArrowRoundForward className="text-md" />A{" "}
            </span>
          ) : (
            <span className="flex justify-center items-center text-xl font-sans font-medium text-on-surface-variant">
              {" "}
              <MdCompareArrows />{" "}
            </span>
          )}
        </button>
        <section className="flex justify-between items-end-safe gap-2">
          <button
            type="button"
            aria-pressed={selectedClassYear === "CURRENT"}
            onClick={() => onClassYearChange("CURRENT")}
            className={`flex justify-center items-center gap-2 px-2 py-1 w-18 font-sans text-xs font-medium cursor-pointer rounded-lg border-none focus:outline-none ${selectedClassYear === "CURRENT" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
          >
            Atual
          </button>
          <button
            type="button"
            aria-pressed={selectedClassYear === "NEXT"}
            onClick={() => onClassYearChange("NEXT")}
            className={`flex justify-center items-center gap-2 px-2 py-1 w-18 font-sans text-xs font-medium cursor-pointer rounded-lg border-none focus:outline-none ${selectedClassYear === "NEXT" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
          >
            Próxima
          </button>
        </section>
        <button
          type="button"
          onClick={onClearFilters}
          aria-label="Limpar filtros"
          title="Limpar filtros"
          className="flex justify-center items-center self-end gap-2 px-2 py-1 font-sans text-md font-semibold text-on-surface-variant rounded-lg border-none focus:outline-none"
        >
          <FaTrashAlt />
        </button>
      </div>
    </section>
  );
}
