import { jsPDF } from "jspdf";
import { Project } from "./types";
import { getStatusLabel } from "./projectUtils";

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function addPageIfNeeded(doc: jsPDF, y: number, needed: number = 20): number {
  if (y + needed > 280) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function drawSectionHeader(doc: jsPDF, y: number, title: string): number {
  y = addPageIfNeeded(doc, y, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text(title.toUpperCase(), MARGIN, y);
  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 6;
  return y;
}

function drawText(doc: jsPDF, y: number, text: string, fontSize: number = 10): number {
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    y = addPageIfNeeded(doc, y);
    doc.text(line, MARGIN, y);
    y += 5;
  }
  return y;
}

function drawTags(doc: jsPDF, y: number, tags: string[]): number {
  if (tags.length === 0) return y;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let x = MARGIN;
  for (const tag of tags) {
    const w = doc.getTextWidth(tag) + 6;
    if (x + w > MARGIN + CONTENT_WIDTH) {
      x = MARGIN;
      y += 7;
      y = addPageIfNeeded(doc, y);
    }
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(x, y - 4, w, 6, 1, 1, "F");
    doc.setTextColor(80, 80, 80);
    doc.text(tag, x + 3, y);
    x += w + 3;
  }
  y += 8;
  return y;
}

export function exportProjectPdf(project: Project) {
  const doc = new jsPDF();
  let y = MARGIN;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(project.title, MARGIN, y);
  y += 8;

  // Category + Stage + Status
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  const meta = `${project.category.toUpperCase()} · ${project.stage} · ${getStatusLabel(project)}`;
  doc.text(meta, MARGIN, y);
  y += 10;

  // Summary
  if (project.summary) {
    y = drawSectionHeader(doc, y, "Summary");
    y = drawText(doc, y, project.summary);
    y += 4;
  }

  // Description
  if (project.description) {
    y = drawSectionHeader(doc, y, "Description");
    y = drawText(doc, y, project.description);
    y += 4;
  }

  // Tech Stack
  if (project.tech_stack.length > 0) {
    y = drawSectionHeader(doc, y, "Tech Stack");
    y = drawTags(doc, y, project.tech_stack);
  }

  // Key Decisions
  if (project.key_decisions.length > 0) {
    y = drawSectionHeader(doc, y, "Key Decisions");
    for (const d of project.key_decisions) {
      y = drawText(doc, y, `• ${d}`, 9);
    }
    y += 4;
  }

  // Lessons Learned
  if (project.lessons_learned.length > 0) {
    y = drawSectionHeader(doc, y, "Lessons Learned");
    for (const l of project.lessons_learned) {
      y = drawText(doc, y, `• ${l}`, 9);
    }
    y += 4;
  }

  // Links
  if (project.url || project.github_repo_url) {
    y = drawSectionHeader(doc, y, "Links");
    if (project.url) {
      y = drawText(doc, y, `Live: ${project.url}`, 9);
    }
    if (project.github_repo_url) {
      y = drawText(doc, y, `GitHub: ${project.github_repo_url}`, 9);
    }
    y += 4;
  }

  // Dates
  y = addPageIfNeeded(doc, y, 15);
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(
    `Created: ${new Date(project.created_at).toLocaleDateString()} · Updated: ${new Date(project.updated_at).toLocaleDateString()}`,
    MARGIN,
    y
  );

  doc.save(`${project.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}

export function exportPortfolioPdf(projects: Project[]) {
  const doc = new jsPDF();
  let y = MARGIN;

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("AI Project Portfolio", MARGIN, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), MARGIN, y);
  y += 12;

  const categories = [
    { key: "website" as const, label: "Websites & Webapps" },
    { key: "agent" as const, label: "Agents" },
  ];

  for (const cat of categories) {
    const catProjects = projects.filter((p) => p.category === cat.key);
    if (catProjects.length === 0) continue;

    y = addPageIfNeeded(doc, y, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(`${cat.label} (${catProjects.length})`, MARGIN, y);
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    y += 8;

    for (const project of catProjects) {
      y = addPageIfNeeded(doc, y, 30);

      // Title + status
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text(project.title, MARGIN, y);

      const status = getStatusLabel(project);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(status, MARGIN + CONTENT_WIDTH - doc.getTextWidth(status), y);
      y += 5;

      // Summary
      if (project.summary) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const summaryLines = doc.splitTextToSize(project.summary, CONTENT_WIDTH);
        for (const line of summaryLines.slice(0, 2)) {
          doc.text(line, MARGIN, y);
          y += 4;
        }
      }

      // Tech stack inline
      if (project.tech_stack.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(project.tech_stack.slice(0, 6).join(" · "), MARGIN, y);
        y += 4;
      }

      // Links
      if (project.url || project.github_repo_url) {
        doc.setFontSize(8);
        doc.setTextColor(100, 130, 180);
        const links = [project.url, project.github_repo_url].filter(Boolean).join(" · ");
        doc.text(links, MARGIN, y);
        y += 4;
      }

      y += 6;
    }
  }

  // Footer
  y = addPageIfNeeded(doc, y, 15);
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.text(`Total: ${projects.length} projects`, MARGIN, y);

  doc.save("AI_Project_Portfolio.pdf");
}
