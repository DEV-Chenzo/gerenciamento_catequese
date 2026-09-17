import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface p-4">
      {/* Card centralizado que envolve o conteúdo das páginas de login/register */}
      <div className="w-full max-w-md bg-surface-bright rounded-lg shadow-md p-8 border border-surface-container-highest">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            CATEQUESE - PAROQUIA CATEDRAL SANTO ANTONIO
          </p>
          <h1 className="text-2xl font-bold text-gray-800">
            Portal Catequetico
          </h1>
          <p className="text-sm text-gray-500">
            Entre para acessar a plataforma
          </p>
        </div>

        {/* Aqui é inserido o conteúdo de login/page.tsx */}
        {children}
        <footer className="mt-6 text-center text-sm text-gray-500">
          <p> Comunhão • Formação • testemunho</p>
          <p>
            Acesso restrito a catequistas e coordenadores paroquiais
            credenciados.
          </p>
        </footer>
      </div>
    </div>
  );
}
