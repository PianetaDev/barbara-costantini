const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, BorderStyle, WidthType, ShadingType, AlignmentType,
        LevelFormat, ExternalHyperlink, Header, Footer, PageNumber } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = (v) => ({ top: 80, bottom: 80, left: 120, right: 120 });

function row(cells, widths, shade) {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })]
    }))
  });
}

function headRow(cells, widths) {
  return new TableRow({
    children: cells.map((text, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: "1A1A1A", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 20, bold: true, color: "FFFFFF" })] })]
    }))
  });
}

function table(headers, rows, widths) {
  const total = widths.reduce((a,b) => a+b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headRow(headers, widths), ...rows.map((r,i) => row(r, widths, i%2===0 ? "F9F9F9" : null))]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial" })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial" })]
  });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, size: 20, font: "Arial", ...opts })] });
}
function code(text) {
  return new Paragraph({
    spacing: { after: 60 },
    shading: { fill: "F4F4F4", type: ShadingType.CLEAR },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 18, font: "Courier New", color: "333333" })]
  });
}
function space() {
  return new Paragraph({ children: [new TextRun("")] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "111111" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "222222" },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] },
      { reference: "checks", levels: [{ level: 0, format: LevelFormat.BULLET, text: "□",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: "26P16 Barbara Costantini — Onboarding", size: 16, color: "888888", font: "Arial" })
        ]})
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Pianeta.Studio · info@pianeta.studio · ", size: 16, color: "888888", font: "Arial" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888", font: "Arial" })
        ]})
      ]})
    },
    children: [
      // TITLE
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: "26P16", size: 52, bold: true, font: "Arial", color: "888888" })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Barbara Costantini Restauro", size: 52, bold: true, font: "Arial", color: "111111" })
      ]}),
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: "Onboarding — design@pianeta.studio", size: 22, font: "Arial", color: "555555" })
      ]}),
      p("16 giugno 2026 · Pianeta.Studio", { color: "888888", size: 18 }),
      space(),

      // PANORAMICA
      h1("Panoramica"),
      table(
        ["Campo", "Info"],
        [
          ["Cliente", "Barbara Costantini Restauro Srl"],
          ["Sito", "barbaracostantinirestauro.it"],
          ["Codice progetto", "26P16"],
          ["Owner", "Max (info@pianeta.studio)"],
          ["Team", "Francesca + Ludovica"],
          ["Contatto team", "design@pianeta.studio"],
        ],
        [3600, 5838]
      ),
      space(),

      // ACCESSI
      h1("Accessi"),
      h2("GitHub"),
      p("Repo: github.com/PianetaDev/barbara-costantini"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Max deve invitare design@pianeta.studio nell’org PianetaDev", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Vai su: github.com/orgs/PianetaDev/people → Invite member", size: 20, font: "Arial" })] }),
      space(),

      h2("Figma"),
      p("File: figma.com/design/4ELDYGUtuujrcrVDnJ31b5/Website"),
      p("Pagina di lavoro: “Def Test AI”"),
      p("Token Figma: in PRIVATE.md (chiedere a Max)"),
      space(),

      h2("Vercel"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Progetto da creare su vercel.com/new", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Importare PianetaDev/barbara-costantini", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Build: pnpm build · Output: .output/public", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: "Dopo: invitare design@pianeta.studio al team Vercel", size: 20, font: "Arial" })] }),
      space(),

      h2("Supabase"),
      p("Da configurare se serve (form contatti o CMS futuro). Progetto: barbara-costantini su supabase.com/pianeta."),
      space(),

      h2("CMS — Sanity (fase 2)"),
      p("Nessun CMS per ora. Sanity viene aggiunto dopo — Foss gestisce il setup."),
      p("Schema previsto: Progetti + Pagine (Studio, Servizi)."),
      space(),

      // FILE PRIVATE
      h1("File PRIVATE.md"),
      p("Contiene tutti i token e le credenziali. Non è nel repo (gitignored)."),
      p("Chiederlo a Max. Va messo nella root del progetto locale."),
      space(),

      // SETUP LOCALE
      h1("Setup locale"),
      code("git clone https://github.com/PianetaDev/barbara-costantini"),
      code("cd barbara-costantini"),
      code("pnpm install"),
      code("pnpm dev   # apre http://localhost:3000"),
      space(),
      p("Ogni git push su main fa deploy automatico su Vercel."),
      space(),

      // STACK
      h1("Stack tecnico"),
      table(
        ["Tecnologia", "Uso"],
        [
          ["Nuxt 4", "Framework Vue SSR/SSG"],
          ["Tailwind CSS", "Stili — token bc-*"],
          ["pnpm", "Package manager"],
          ["Vercel", "Hosting + deploy automatico"],
          ["Supabase", "DB (futuro)"],
          ["Sanity", "CMS (fase 2)"],
          ["EB Garamond", "Font display (titoli)"],
          ["Public Sans", "Font UI (nav, label)"],
        ],
        [4320, 5118]
      ),
      space(),

      // PAGINE
      h1("Pagine da realizzare"),
      table(
        ["Pagina", "Frame Figma", "File Vue", "Stato"],
        [
          ["Homepage", "590:1395", "pages/index.vue", "scaffold"],
          ["Studio", "590:1429", "pages/studio.vue", "da fare"],
          ["Lavori", "590:1457", "pages/lavori/index.vue", "da fare"],
          ["Dettaglio progetto", "590:1494", "pages/lavori/[slug].vue", "da fare"],
          ["Gallery", "590:1571", "pages/galleria.vue", "da fare"],
          ["Contatti", "590:1479", "pages/contatti.vue", "da fare"],
        ],
        [2200, 1800, 3000, 1600]
      ),
      space(),

      // COMPONENTI
      h1("Componenti esistenti"),
      p("Tutti in app/components/bc/ — prefisso Bc, auto-importati (no import manuale)."),
      table(
        ["Componente", "Frame", "Stato"],
        [
          ["BcNav", "590:1428", "✅"],
          ["BcHero", "590:1413", "✅"],
          ["BcSectionStudio", "590:1405", "✅"],
          ["BcSectionLavori", "590:1396", "✅"],
          ["BcSectionServizi", "590:1417", "✅"],
          ["BcFooter", "590:1427", "✅"],
        ],
        [3600, 2200, 1638]
      ),
      space(),

      // TOKEN
      h1("Design tokens"),
      h2("Colori"),
      table(
        ["Classe Tailwind", "Valore", "Uso"],
        [
          ["bg-bc-canvas", "#F7F6EF", "Sfondo pagine"],
          ["text-bc-black / border-bc-black", "#000000", "Testo, bordi, divider"],
        ],
        [3200, 1800, 2438]
      ),
      space(),
      h2("Tipografia"),
      table(
        ["Classe", "Font", "Dim", "Uso"],
        [
          ["font-garamond text-bc-h1", "EB Garamond SemiBold", "56px", "Titolo hero"],
          ["font-garamond text-bc-h2", "EB Garamond SemiBold", "38px", "Titoli sezione"],
          ["font-garamond text-bc-h4", "EB Garamond SemiBold", "24px", "Titolo card"],
          ["font-garamond text-bc-body1", "EB Garamond Regular", "22px", "Corpo testo"],
          ["font-garamond text-bc-btn", "EB Garamond Regular", "18px", "Bottone"],
          ["font-sans text-bc-nav", "Public Sans Regular", "16px", "Nav"],
          ["font-sans text-bc-label2", "Public Sans Light", "14px", "Label, meta"],
        ],
        [3000, 2200, 700, 1538]
      ),
      space(),
      h2("Bottone"),
      code('<NuxtLink to="/pagina" class="bc-btn">Testo</NuxtLink>'),
      space(),

      // WORKFLOW
      h1("Workflow Figma → Claude → codice"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
        children: [new TextRun({ text: "Apri Figma Desktop — seleziona il frame — attiva ", size: 20, font: "Arial" }),
                   new TextRun({ text: "</>", size: 20, font: "Courier New" }),
                   new TextRun({ text: " Dev Mode", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
        children: [new TextRun({ text: "Apri Claude Code nella cartella barbara-costantini", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
        children: [new TextRun({ text: "Scrivi: “Implementa il componente X dal frame Figma. Usa Vue 3 + classi bc-*”", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
        children: [new TextRun({ text: "Testa con pnpm dev", size: 20, font: "Arial" })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 },
        children: [new TextRun({ text: "git push → Vercel deploya in automatico", size: 20, font: "Arial" })] }),
      space(),
      p("Guida completa: CLAUDE.md nella root del repo.", { color: "555555", italics: true }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/Users/massimilianomauro/dev/barbara-costantini/26P16_Barbara_Costantini_Onboarding.docx', buf);
  console.log('OK');
});
