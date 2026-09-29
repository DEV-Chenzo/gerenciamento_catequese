import Link from "next/link";
import getLiturgyColor from "@/utils/liturgyColors";
import liturgyService from "@/services/external/LiturgyService";

export default async function WelcomeSection() {
  const liturgyData = await liturgyService();
  const liturgy = getLiturgyColor(liturgyData.color);
  // ----------- TESTE DE COR ------------// 
  // const liturgy = {bg: "bg-liturgy-rose",
  //       border: "border-liturgy-rose",
  //       text: "text-on-surface"};
  // -------------------------------------//
  const liturgyBg = liturgy.bg;
  const liturgyBorder = liturgy.border;
  const liturgyText = liturgy.text;
  return (
    <>
      <section className="flex items-center justify-between mx-3 gap-10 py-4 px-10 bg-surface-container rounded-lg">
        <div className="flex flex-col items-start justify-center gap-2 p-4">
          <div className={` ${liturgyBg} ${liturgyText} flex items-center justify-center  gap-2 py-1 px-3 mb-1 rounded-2xl text-sm font-medium font-sans`}>
            <div className={`w-3 h-3 rounded-full ${liturgyBg} brightness-80`}></div>
            {liturgyData.date} - {liturgyData.liturgy}
          </div>
          <h1 className="text-4xl font-serif font-semibold leading-none font-stretch-condensed tracking-light text-primary">
            Paz e bem, Catequista!
          </h1>
          <p className="w-105 text-lg font-sans font-[370] text-on-surface">
            O cuidado com cada catequizando fortalece os laços da nossa
            comunidade paroquial. Confira abaixo o acompanhamento da semana e a
            caminhada formativa das turmas.
          </p>
        </div>
        <section className="flex flex-col self-end-safe items-start justify-center gap-4 p-4">
          <div className={` ${liturgyBorder} w-80 bg-surface-container-low rounded-lg p-4 flex flex-col items-start justify-center gap-2 border-l-8`}>
            <p className="text-md font-sans font-medium">Antífona</p>
            <p className="text-sm font-sans font-medium text-on-surface-variant">
              &quot;{liturgyData.entranceAntiphon}.&quot;
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link 
            href="/students"
            className={`px-4 py-2 text-sm font-sans font-medium ${liturgyBg} ${liturgyText} rounded-md hover:brightness-90 hover:cursor-pointer transition-all`}>
              Cadastrar Aluno
            </Link>
            <Link 
            href="/rollcall"
            className={`px-4 py-2 text-sm font-sans font-medium bg-surface-container-highest ${liturgyText} rounded-md hover:bg-surface-dim hover:cursor-pointer transition-colors`}>
              Realizar Chamada
            </Link>
          </div>
        </section>
      </section>
    </>
  );
}
