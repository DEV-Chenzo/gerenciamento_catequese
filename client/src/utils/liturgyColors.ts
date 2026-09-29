export interface LiturgyColorStyle {
  bg: string;
  border: string;
  text: string;
}

export default function getLiturgyColor(color: string): LiturgyColorStyle {
    const normalizedColor = color?.trim().toLowerCase();
  switch (normalizedColor) {
    case "branco": return {bg: "bg-liturgy-white",
        border: "border-liturgy-white",
        text: "text-on-surface"
    }
    case "vermelho": return {bg: "bg-liturgy-red",
        border: "border-liturgy-red",
        text: "text-on-surface"};
    case "verde": return {bg: "bg-liturgy-green",
        border: "border-liturgy-green",
        text: "text-on-surface"};
    case "rosa": return {bg: "bg-liturgy-rose",
        border: "border-liturgy-rose",
        text: "text-on-surface"};
    case "dourado": return {bg: "bg-liturgy-gold",
        border: "border-liturgy-gold",
        text: "text-on-surface"};
    case "roxo": return {bg: "bg-liturgy-purple",
        border: "border-liturgy-purple",
        text: "text-on-surface"};
    case "preto": return {bg: "bg-liturgy-black",
        border: "border-liturgy-black",
        text: "text-amber-50"};
    default: return {bg: "bg-liturgy-white",
        border: "border-liturgy-white",
        text: "text-on-surface"
    };
  }}