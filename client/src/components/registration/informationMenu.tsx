import { GoVerified } from "react-icons/go";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
export default function InformationMenu() {
  return (
    <section className="flex w-200 h-80 gap-2 p-4 bg-secondary-container/10 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col justify-between items-start gap-2 px-4 w-full">
        <h1 className="text-4xl font-serif font-medium text-primary">
          Informações do Chamado
        </h1>
        <section className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all transform-border duration-200 bg-surface-container-lowest text-primary hover:text-status-present hover:outline-2 hover:outline-status-present">
              <GoVerified /> <span>Marcar todos como Presentes</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 bg-surface-container-lowest text-primary hover:text-status-absent hover:outline-2 hover:outline-status-absent">
              <MdOutlineCancelPresentation /> <span>Marcar todos como Ausentes</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 bg-primary text-on-primary rounded-md hover:bg-primary-hover">
              <IoMdSave /> <span>Salvar e Concluir chamada</span>
            </button>
        </section>
      </div>
      <div>
        <section className="flex flex-wrap gap-4 w-50 justify-center">
            <div className="w-20 h-20 bg-surface-container-lowest" ></div>
            <div className="w-20 h-20 bg-surface-container-lowest" ></div>
            <div className="w-20 h-20 bg-surface-container-lowest" ></div>
            <div className="w-20 h-20 bg-surface-container-lowest" ></div>
        </section>
      </div>
    </section>
  );
}
