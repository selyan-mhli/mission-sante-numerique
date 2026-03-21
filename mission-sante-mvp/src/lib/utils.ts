import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getTypeColor(type: string) {
  switch (type) {
    case "PDF": return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", accent: "#ef4444" };
    case "Word": return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", accent: "#3b82f6" };
    case "PPTX": return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", accent: "#f59e0b" };
    default: return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", accent: "#6b7280" };
  }
}

export function getConfidentialiteColor(conf: string) {
  switch (conf) {
    case "Public": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Interne": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Restreint": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

export function getStatutColor(statut: string) {
  switch (statut) {
    case "Valide": return "bg-emerald-50 text-emerald-700";
    case "EnCours": return "bg-blue-50 text-blue-700";
    case "Brouillon": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-500";
  }
}

export function getStatutLabel(statut: string) {
  switch (statut) {
    case "Valide": return "Validé";
    case "EnCours": return "En cours";
    case "Brouillon": return "Brouillon";
    default: return statut;
  }
}

export const THEMES = [
  "Télésurveillance",
  "Stratégie e-santé",
  "Interopérabilité",
  "Sécurité des données",
  "DMP / Mon Espace Santé",
  "Coordination des soins",
  "Intelligence artificielle",
];

export const PUBLICS = [
  "Professionnels de santé",
  "DSI hospitaliers",
  "Institutionnels",
  "DPO et RSSI",
  "Personnel soignant",
  "Partenaires",
];

export const SOURCES = [
  "ARS Île-de-France",
  "DNS",
  "ANS",
  "CNIL / ANS",
  "CHU de Bordeaux",
  "GCS e-Santé Bretagne",
  "ANSSI",
  "Inserm",
  "Ministère de la Santé",
  "Ordre des médecins",
  "ARS Occitanie",
  "France Assos Santé",
];
