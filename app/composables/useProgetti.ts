export interface MetaVoce { label: string; valore: string }
export interface Immagine { src: string; label: string; aspetto?: 'h' | 'v' }
export interface Sezione { titolo: string; sottotitolo: string; testi: string[] }
export interface Metodo { testi: string[]; citazione: string }
export interface Progetto {
  id: string; slug: string; titolo: string; committente: string; tipo: 'horizontal' | 'vertical'
  meta: MetaVoce[]; immagini: Immagine[]; immaginiContenuto: string[]
  intro: string[]; sezioni: Sezione[]; metodo: Metodo
}

const INTRO = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.",
  "Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed. Pellentesque ac elit eu ex dictum tempor. Mauris euismod orci in mauris vehicula vehicula. Ut elementum mi eu dui tincidunt laoreet.",
]
const SEZIONI: Sezione[] = [{ titolo: "Titolo Lorem ipsum", sottotitolo: "Titolo Lorem Ipsum", testi: [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.",
] }]
const METODO: Metodo = { testi: [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet.",
], citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat." }

export const PROGETTI: Progetto[] = [
  {
    id: "01", slug: "archivio-regio", tipo: "horizontal",
    titolo: "Restauro conservativo dell'Antico Archivio Regio", committente: "Archivio di Stato di Cagliari",
    meta: [{ label: "Committente", valore: "Archivio di Stato di Cagliari" }, { label: "Anno", valore: "2022–2023" }],
    immagini: [
      { src: "/images/bc-059.jpg", label: "01-01", aspetto: "h" }, { src: "/images/bc-027.jpg", label: "01-02", aspetto: "v" },
      { src: "/images/bc-001.jpg", label: "01-03", aspetto: "h" }, { src: "/images/bc-004.jpg", label: "01-04", aspetto: "v" },
      { src: "/images/bc-007.jpg", label: "01-05", aspetto: "h" }, { src: "/images/bc-010.jpg", label: "01-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-059.jpg", "/images/bc-026.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "02", slug: "restauro-testamenti", tipo: "vertical",
    titolo: "Restauro testamenti", committente: "Munda – Museo Nazionale d'Abruzzo",
    meta: [{ label: "Committente", valore: "Munda – Museo Nazionale d'Abruzzo" }, { label: "Anno", valore: "2021–2022" }],
    immagini: [
      { src: "/images/bc-060.jpg", label: "02-01", aspetto: "h" }, { src: "/images/bc-026.jpg", label: "02-02", aspetto: "v" },
      { src: "/images/bc-013.jpg", label: "02-03", aspetto: "h" }, { src: "/images/bc-016.jpg", label: "02-04", aspetto: "v" },
      { src: "/images/bc-019.jpg", label: "02-05", aspetto: "h" }, { src: "/images/bc-022.jpg", label: "02-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-040.jpg", "/images/bc-070.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "03", slug: "restauro-eur", tipo: "horizontal",
    titolo: "Intervento di restauro conservativo", committente: "EUR Spa",
    meta: [{ label: "Committente", valore: "EUR Spa" }, { label: "Anno", valore: "2020–2021" }],
    immagini: [
      { src: "/images/bc-025.jpg", label: "03-01", aspetto: "h" }, { src: "/images/bc-038.jpg", label: "03-02", aspetto: "v" },
      { src: "/images/bc-031.jpg", label: "03-03", aspetto: "h" }, { src: "/images/bc-034.jpg", label: "03-04", aspetto: "v" },
      { src: "/images/bc-037.jpg", label: "03-05", aspetto: "h" }, { src: "/images/bc-040.jpg", label: "03-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-003.jpg", "/images/bc-026.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "04", slug: "restauro-pergamena", tipo: "vertical",
    titolo: "Restauro su pergamena medievale", committente: "Comune di Roma",
    meta: [{ label: "Committente", valore: "Comune di Roma" }, { label: "Anno", valore: "2019–2020" }],
    immagini: [
      { src: "/images/bc-027.jpg", label: "04-01", aspetto: "v" }, { src: "/images/bc-001.jpg", label: "04-02", aspetto: "h" },
      { src: "/images/bc-004.jpg", label: "04-03", aspetto: "v" }, { src: "/images/bc-007.jpg", label: "04-04", aspetto: "h" },
      { src: "/images/bc-010.jpg", label: "04-05", aspetto: "v" }, { src: "/images/bc-013.jpg", label: "04-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-027.jpg", "/images/bc-001.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "05", slug: "restauro-codice", tipo: "horizontal",
    titolo: "Restauro codice miniato", committente: "Biblioteca Nazionale",
    meta: [{ label: "Committente", valore: "Biblioteca Nazionale" }, { label: "Anno", valore: "2019–2020" }],
    immagini: [
      { src: "/images/bc-026.jpg", label: "05-01", aspetto: "h" }, { src: "/images/bc-059.jpg", label: "05-02", aspetto: "h" },
      { src: "/images/bc-016.jpg", label: "05-03", aspetto: "v" }, { src: "/images/bc-019.jpg", label: "05-04", aspetto: "h" },
      { src: "/images/bc-022.jpg", label: "05-05", aspetto: "v" }, { src: "/images/bc-025.jpg", label: "05-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-026.jpg", "/images/bc-059.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "06", slug: "restauro-mappe", tipo: "vertical",
    titolo: "Conservazione mappe storiche", committente: "Museo Nazionale",
    meta: [{ label: "Committente", valore: "Museo Nazionale" }, { label: "Anno", valore: "2018–2019" }],
    immagini: [
      { src: "/images/bc-038.jpg", label: "06-01", aspetto: "v" }, { src: "/images/bc-031.jpg", label: "06-02", aspetto: "h" },
      { src: "/images/bc-034.jpg", label: "06-03", aspetto: "v" }, { src: "/images/bc-037.jpg", label: "06-04", aspetto: "h" },
      { src: "/images/bc-040.jpg", label: "06-05", aspetto: "v" }, { src: "/images/bc-060.jpg", label: "06-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-038.jpg", "/images/bc-031.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "07", slug: "restauro-carteggio", tipo: "horizontal",
    titolo: "Restauro carteggio diplomatico", committente: "Soprintendenza Roma",
    meta: [{ label: "Committente", valore: "Soprintendenza Roma" }, { label: "Anno", valore: "2018–2019" }],
    immagini: [
      { src: "/images/bc-003.jpg", label: "07-01", aspetto: "h" }, { src: "/images/bc-007.jpg", label: "07-02", aspetto: "h" },
      { src: "/images/bc-010.jpg", label: "07-03", aspetto: "v" }, { src: "/images/bc-013.jpg", label: "07-04", aspetto: "h" },
      { src: "/images/bc-016.jpg", label: "07-05", aspetto: "v" }, { src: "/images/bc-019.jpg", label: "07-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-003.jpg", "/images/bc-007.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "08", slug: "restauro-atti", tipo: "vertical",
    titolo: "Restauro atti notarili", committente: "Archivio Vaticano",
    meta: [{ label: "Committente", valore: "Archivio Vaticano" }, { label: "Anno", valore: "2017–2018" }],
    immagini: [
      { src: "/images/bc-040.jpg", label: "08-01", aspetto: "v" }, { src: "/images/bc-022.jpg", label: "08-02", aspetto: "h" },
      { src: "/images/bc-025.jpg", label: "08-03", aspetto: "v" }, { src: "/images/bc-027.jpg", label: "08-04", aspetto: "h" },
      { src: "/images/bc-031.jpg", label: "08-05", aspetto: "v" }, { src: "/images/bc-034.jpg", label: "08-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-040.jpg", "/images/bc-022.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "09", slug: "restauro-fondazione", tipo: "horizontal",
    titolo: "Conservazione documenti novecenteschi", committente: "Fondazione Prada",
    meta: [{ label: "Committente", valore: "Fondazione Prada" }, { label: "Anno", valore: "2017–2018" }],
    immagini: [
      { src: "/images/bc-070.jpg", label: "09-01", aspetto: "h" }, { src: "/images/bc-037.jpg", label: "09-02", aspetto: "h" },
      { src: "/images/bc-059.jpg", label: "09-03", aspetto: "v" }, { src: "/images/bc-060.jpg", label: "09-04", aspetto: "h" },
      { src: "/images/bc-001.jpg", label: "09-05", aspetto: "v" }, { src: "/images/bc-004.jpg", label: "09-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-070.jpg", "/images/bc-037.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "10", slug: "restauro-incunaboli", tipo: "vertical",
    titolo: "Restauro incunaboli", committente: "Università di Bologna",
    meta: [{ label: "Committente", valore: "Università di Bologna" }, { label: "Anno", valore: "2016–2017" }],
    immagini: [
      { src: "/images/bc-025.jpg", label: "10-01", aspetto: "v" }, { src: "/images/bc-026.jpg", label: "10-02", aspetto: "h" },
      { src: "/images/bc-038.jpg", label: "10-03", aspetto: "v" }, { src: "/images/bc-040.jpg", label: "10-04", aspetto: "h" },
      { src: "/images/bc-003.jpg", label: "10-05", aspetto: "v" }, { src: "/images/bc-010.jpg", label: "10-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-025.jpg", "/images/bc-026.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "11", slug: "restauro-planimetrie", tipo: "horizontal",
    titolo: "Conservazione planimetrie storiche", committente: "Ministero della Cultura",
    meta: [{ label: "Committente", valore: "Ministero della Cultura" }, { label: "Anno", valore: "2016–2017" }],
    immagini: [
      { src: "/images/bc-059.jpg", label: "11-01", aspetto: "h" }, { src: "/images/bc-013.jpg", label: "11-02", aspetto: "v" },
      { src: "/images/bc-016.jpg", label: "11-03", aspetto: "h" }, { src: "/images/bc-019.jpg", label: "11-04", aspetto: "v" },
      { src: "/images/bc-022.jpg", label: "11-05", aspetto: "h" }, { src: "/images/bc-031.jpg", label: "11-06", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-059.jpg", "/images/bc-013.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
  {
    id: "12", slug: "restauro-manoscritti", tipo: "vertical",
    titolo: "Restauro manoscritti pontifici", committente: "Città del Vaticano",
    meta: [{ label: "Committente", valore: "Città del Vaticano" }, { label: "Anno", valore: "2015–2016" }],
    immagini: [
      { src: "/images/bc-060.jpg", label: "12-01", aspetto: "v" }, { src: "/images/bc-034.jpg", label: "12-02", aspetto: "h" },
      { src: "/images/bc-037.jpg", label: "12-03", aspetto: "v" }, { src: "/images/bc-070.jpg", label: "12-04", aspetto: "h" },
      { src: "/images/bc-007.jpg", label: "12-05", aspetto: "v" }, { src: "/images/bc-027.jpg", label: "12-06", aspetto: "h" },
    ],
    immaginiContenuto: ["/images/bc-060.jpg", "/images/bc-034.jpg"],
    intro: INTRO, sezioni: SEZIONI, metodo: METODO,
  },
]

export function useProgetti() {
  return PROGETTI
}
