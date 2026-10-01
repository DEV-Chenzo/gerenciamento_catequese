import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineChurch } from "react-icons/md";
import { BsPersonPlus } from "react-icons/bs";
import { RxDashboard, RxListBullet, RxPeople } from "react-icons/rx";
import AsyncFullYear from "@/components/AsyncFullYear";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  flex bg-surface-container-low ">
      <aside className="flex flex-col items-center w-65 p-2 bg-surface-container">
        <section className="flex items-center gap-3 my-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary">
            <MdOutlineChurch className="text-2xl text-on-primary" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-medium leading-none text-primary">
              Portal Catequético
            </h2>
            <p className="text-xs font-sans font-semibold text-secondary-hover">
              GESTÃO & PRESENÇA
            </p>
          </div>
        </section>
        <AsyncFullYear />
        <nav className="w-54 my-3 mx-4 flex justify-start items-center">
          <ul>
            <li className="w-53 flex items-center justify-baseline py-2 px-3 gap-2 mb-4 text-on-surface-variant font-sans text-md font-medium rounded-md">
              <RxDashboard className="text-lg " />
              <Link href="/dashboard">Dashboard Geral</Link>
            </li>
            <li className="w-53 flex items-center justify-baseline py-2 px-3 gap-2 mb-4 text-on-surface-variant font-sans text-md font-medium rounded-md">
              <RxListBullet className="text-lg" />
              <Link href="/rollcall">Realizar Chamada</Link>
            </li>
            <li className="w-53 flex items-center justify-baseline py-2 px-3 gap-2 mb-4 text-on-surface-variant font-sans text-md font-medium rounded-md">
              <RxPeople className="text-lg" />
              <Link href="/students">Gestão de Alunos</Link>
            </li>
            <li className="w-53 flex items-center justify-baseline py-2 px-3 gap-2 mb-4 text-on-surface-variant font-sans text-md font-medium rounded-md">
              <BsPersonPlus className="text-lg" />
              <Link href="/registration">Cadastrar Alunos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col gap-1 bg-surface-container-low">
        <header className=" h-20 py-4 px-7 mb-0 flex items-center justify-between gap-2 bg-surface-container-low border-b-8 border-surface-container">
          <section>
            <h1 className="text-xl font-sans font-medium leading-none text-on-surface">
              Paróquia Catedral Santo Antônio
            </h1>
            <p className="text-sm font-sans font-medium text-on-surface-variant">
              Diocese de Alagoinhas • BA
            </p>
          </section>
          <section className="flex items-center gap-2">
            <div className="w-0.5 h-6 bg-mauve-300 mr-2" />
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/perfil.jpg"
                alt="Foto do Catequista"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h2 className="text-sm font-sans font-medium leading-none text-on-surface">
                Nome do Catequista
              </h2>
              <p className="text-sm font-sans font-medium text-on-surface-variant">
                Catequista
              </p>
            </div>
          </section>
        </header>
        <main className="mt-2 p-2">{children}</main>
      </div>
    </div>
  );
}
