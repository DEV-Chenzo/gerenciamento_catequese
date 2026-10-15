'use client';
import { useState } from "react";

// Definição do tipo do aluno
export interface Student {
  id: string;
  name: string;
  classYear: "CURRENT" | "NEXT";
}

interface InsertFormComponentProps {
  onAddStudent: (student: Omit<Student, "id">) => void;
}

export default function InsertFormComponent({ onAddStudent }: InsertFormComponentProps) {
  const [formData, setFormData] = useState({
    name: "",
    classYear: "CURRENT" as "CURRENT" | "NEXT"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 🛑 Evita o recarregamento da página

    if (!formData.name.trim()) return; // Evita nomes vazios

    // Envia os dados para o componente pai
    onAddStudent(formData);

    // Reseta o campo de nome após o envio
    setFormData({
      name: "",
      classYear: "CURRENT"
    });
  };

  return (
    <section className="flex flex-col items-center justify-center h-90 w-200 rounded-lg bg-surface-container">
      <div className="flex flex-col items-start w-165 gap-1 mb-4">
        <h2 className="text-3xl font-serif font-medium text-primary font-stretch-ultra-condensed">
          Cadastro de Aluno
        </h2>
        <p className="text-md font-sans font-medium text-on-surface-variant max-w-95">
          Preencha os dados abaixo para inserir o aluno na lista de cadastro.
        </p>
      </div>

      {/* Dispara a função no onSubmit do <form> */}
      <form onSubmit={handleSubmit} className="flex flex-col justify-between w-170 gap-4 p-6 mx-8 text-on-surface-variant bg-surface-container-lowest rounded-lg font-sans">
        <section className="flex justify-between gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="name" className="font-sans ml-1">
              Nome:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Insira o nome do Aluno"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-100 py-2 px-3 rounded-md bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary-container"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="classYear" className="font-sans ml-1">
              Ano da Turma:
            </label>
            <select
              name="classYear"
              id="classYear"
              value={formData.classYear}
              onChange={handleChange}
              className="w-40 py-2 px-3 font-sans text-md rounded-md bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-secondary-container"
            >
              <option value="CURRENT" className="font-sans text-sm bg-surface-container-high">
                Ano Atual
              </option>
              <option value="NEXT" className="font-sans text-sm bg-surface-container-high">
                Próximo Ano
              </option>
            </select>
          </div>
        </section>
        <button
          type="submit"
          className="w-50 py-2 px-3 bg-primary text-on-primary rounded-md hover:bg-primary-hover cursor-pointer"
        >
          Inserir
        </button>
      </form>
    </section>
  );
}