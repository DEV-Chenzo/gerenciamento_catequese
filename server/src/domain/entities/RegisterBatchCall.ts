import { ClassYear } from "../../infrastructure/database/prisma/generated/prisma/client"; // Ajuste o caminho da importação
import RegistroChamadaItem from "../interfaces/ICallRecordItem";

export default interface RegistrarChamadaEmLoteInput {
  date: Date | string | number;
  classYear: ClassYear; // 'CURRENT' | 'NEXT'
  records: RegistroChamadaItem[];
}