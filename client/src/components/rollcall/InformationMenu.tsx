import { GoVerified } from "react-icons/go";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { AiOutlineClear } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { BsFillPersonFill, BsPersonFillCheck } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import InformationMenuProps from "@/lib/props/InformationMenuProps";
export default function InformationMenu({
  onSaveAndFinish,
  allStudentsPresent,
  allStudentsAbsent,
  clearAllStudents,
  enrolledCount,
  presentCount,
  absentCount,
  markedCount,
}: InformationMenuProps) {

  const year =new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
  });

  const month = new Date().toLocaleDateString("pt-BR", {
    month: "long",
  });
  const day = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
  });

  const time = `${day} de ${month} de ${year}`;

  return (
    <section className="flex w-200 h-80 gap-2 py-8 px-3 mb-8 bg-secondary-container/10 backdrop-blur-md rounded-lg border border-white/20 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col justify-between items-start gap-2 px-4 w-full">
        <div>
          <h1 className="text-4xl font-serif font-medium mb-2 text-primary">
            Informações do Chamado
          </h1>
          <span className="px-3 py-1 text-xs font-sans font-medium bg-surface-container-highest text-on-surface-variant rounded-lg">
            {time}
          </span>
          <p className="text-sm text-on-surface-variant mt-2">
            Aqui você pode visualizar informações sobre a chamada, como o número de
            estudantes presentes, ausentes e inscritos. Além disso, você pode marcar
            todos os estudantes como presentes ou ausentes, salvar e concluir a chamada, ou desmarcar todas as presenças.
          </p>
        </div>
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={allStudentsPresent}
            className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer rounded-md transition-all duration-200 hover:font-semibold hover:text-[13px] bg-surface-container-lowest text-primary hover:text-status-present hover:outline-2 hover:outline-status-present"
          >
            <GoVerified /> <span>Marcar todos como Presentes</span>
          </button>
          <button
            type="button"
            onClick={allStudentsAbsent}
            className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer rounded-md transition-all duration-200 hover:font-semibold hover:text-[13px] bg-surface-container-lowest text-primary hover:text-status-absent hover:outline-2 hover:outline-status-absent"
          >
            <MdOutlineCancelPresentation />{" "}
            <span>Marcar todos como Ausentes</span>
          </button>
          <button
            type="button"
            onClick={onSaveAndFinish}
            className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer transition-all duration-200 hover:font-semibold hover:text-[13px] bg-primary text-on-primary rounded-md hover:bg-primary-hover"
          >
            <IoMdSave /> <span>Salvar e Concluir chamada</span>
          </button>
          <button
            type="button"
            onClick={clearAllStudents}
            className="flex items-center gap-2 px-4 py-2 text-xs cursor-pointer transition-all duration-200 hover:font-semibold hover:text-[13px] bg-secondary text-on-secondary rounded-md hover:bg-secondary-hover"
          >
            <AiOutlineClear /> <span>Desmarcar as presenças</span>
          </button>
        </section>
      </div>
      <div>
        <section className="flex flex-wrap gap-4 w-66 justify-center ">
          <div className="flex items-center justify-evenly w-31 h-16 px-1.5 gap-2 rounded-lg bg-surface-container-lowest">
            <div className="flex item-center justify-center w-9 h-9 p-2 bg-surface-container rounded-md">
              <BsFillPersonFill className="text-xl text-on-surface-variant" />
            </div>
            <div className="flex flex-col items-end-safe justify-center">
              <p className="text-xs font-medium font-inter text-on-surface-variant">
                Inscritos
              </p>
              <span className="text-lg font-inter font-medium text-on-surface-variant">{enrolledCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-evenly w-31 h-16 px-1.5 gap-2 rounded-lg bg-surface-container-lowest">
            <div className="flex item-center justify-center w-9 h-9 p-2 bg-green-300 rounded-md">
              <MdVerified className="text-xl text-green-900" />
            </div>
            <div className="flex flex-col items-end-safe justify-center">
              <p className="text-xs font-medium font-inter text-green-700">
                Presentes
              </p>
              <span className="text-lg font-inter font-medium text-green-700">{presentCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-evenly w-31 h-16 px-1.5 gap-2 rounded-lg bg-surface-container-lowest">
            <div className="flex item-center justify-center w-9 h-9 p-2 bg-orange-300 rounded-md">
              <BsPersonFillCheck className="text-xl text-orange-950" />
            </div>
            <div className="flex flex-col items-end-safe justify-center">
              <p className="text-xs font-medium font-inter text-secondary">
                Marcados
              </p>
              <span className="text-lg font-inter font-medium text-secondary">{markedCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-evenly w-31 h-16 px-1.5 gap-2 rounded-lg bg-surface-container-lowest">
            <div className="flex item-center justify-center w-9 h-9 p-2 bg-red-300 rounded-md">
              <TiDelete className="text-xl font-bold text-red-950" />
            </div>
            <div className="flex flex-col items-end-safe justify-center">
              <p className="text-xs font-medium font-inter text-red-700">
                Ausentes
              </p>
              <span className="text-lg font-inter font-medium text-red-700">{absentCount}</span>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
