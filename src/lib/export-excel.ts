import * as XLSX from "xlsx";
import { stageLabel } from "./stages";
import type { Stakeholder, StageHistoryEntry } from "./stakeholders";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function exportWorkbook(
  stakeholders: Stakeholder[],
  history: StageHistoryEntry[],
) {
  const nameById = new Map(stakeholders.map((s) => [s.id, s.name]));

  const sheet1 = XLSX.utils.json_to_sheet(
    stakeholders.map((s) => ({
      Name: s.name,
      "Current Stage": stageLabel(s.current_stage),
      About: s.about,
      "LinkedIn Profile": s.linkedin_url,
      Industries: s.industries.join("; "),
      Companies: s.companies.join("; "),
      "Partner Archetype": s.archetype,
      "Any Comments on the Stakeholder": s.comments,
      "Added On": formatDate(s.created_at),
    })),
  );

  const sheet2 = XLSX.utils.json_to_sheet(
    history.map((h) => ({
      Name: nameById.get(h.stakeholder_id) ?? "",
      "From Stage": stageLabel(h.from_stage),
      "To Stage": stageLabel(h.to_stage),
      Note: h.note,
      Date: formatDate(h.created_at),
    })),
  );

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet1, "Stakeholders");
  XLSX.utils.book_append_sheet(book, sheet2, "Stage History");
  XLSX.writeFile(book, `stakeholders-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
