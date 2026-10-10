// Banco de preguntas de la sesión.
// Editable sin tocar el resto de la aplicación: cambia el texto, añade o quita
// opciones y la interfaz se reajusta sola.

export const SESION = {
  titulo: "Tumores desmoides intraabdominales",
  subtitulo: "Casos clínicos · 36 Congreso Nacional de Cirugía · CNC 2026",
};

export const PREGUNTAS = [
  {
    id: "p1",
    etiqueta: "Caso 1 · Pared abdominal",
    enunciado:
      "Mujer de 44 años. Tumor desmoide de 4,8 cm en el músculo recto anterior derecho, " +
      "descubierto dos años después de una histerectomía. Molestias locales leves, sin " +
      "compromiso visceral. Biopsia: fibromatosis tipo desmoide.",
    pregunta: "¿Cuál es su primera recomendación?",
    opciones: [
      { id: "A", texto: "Resección quirúrgica amplia con margen R0 y reconstrucción con malla" },
      { id: "B", texto: "Nirogacestat de entrada" },
      { id: "C", texto: "Vigilancia activa con RM a los 3-6 meses" },
      { id: "D", texto: "Radioterapia externa" },
      { id: "E", texto: "Doxorrubicina liposomal" },
    ],
    correcta: "C",
    clave:
      "La vigilancia activa es el estándar inicial en toda fibromatosis desmoide no complicada, " +
      "también en la pared abdominal.",
    explicacion:
      "En el ensayo GRAFITI (n=105, 35% de pared abdominal) el 70% de los pacientes no precisó " +
      "tratamiento activo a 3 años, y la mutación S45F fue el único predictor independiente de " +
      "pasar a tratamiento (HR 4,64). En la serie de Salas, el 32% se estabiliza y el 28% regresa " +
      "espontáneamente. La cirugía se reserva al fracaso de la vigilancia: en pared abdominal es " +
      "entonces la opción preferente, con recidiva local históricamente baja (5-8%). Un margen R1 " +
      "microscópico no obliga a reintervenir ni a radioterapia adyuvante: se vuelve a vigilancia.",
    referencias:
      "Schut AR. Ann Surg 2023 (GRAFITI) · Salas S. J Clin Oncol 2011 · Kasper B. JAMA Oncol 2024",
  },
  {
    id: "p2",
    etiqueta: "Caso 2 · Intraabdominal esporádico",
    enunciado:
      "Mujer de 51 años, sin poliposis adenomatosa familiar. Masa mesentérica de 20 × 17 × 14 cm " +
      "centrada en la raíz del mesenterio, que engloba las ramas de la arteria mesentérica superior " +
      "y desplaza la 2.ª-3.ª porción duodenal. Considerada irresecable. Progresión radiológica tras " +
      "dos meses de nirogacestat.",
    pregunta: "¿Cuál es el siguiente paso?",
    opciones: [
      { id: "A", texto: "Cirugía citorreductora con resección intestinal extensa" },
      { id: "B", texto: "Doxorrubicina liposomal" },
      { id: "C", texto: "Cambio a sorafenib" },
      { id: "D", texto: "Radioterapia externa sobre la masa mesentérica" },
      { id: "E", texto: "Vigilancia activa y repetir TC en 6 meses" },
    ],
    correcta: "B",
    clave:
      "En el desmoide intraabdominal esporádico irresecable la estrategia central es el tratamiento " +
      "sistémico; la cirugía solo si es de baja morbilidad.",
    explicacion:
      "Tras el fallo de un inhibidor de la gamma-secretasa, la doxorrubicina liposomal es el agente " +
      "con mayor tasa y durabilidad de respuesta en enfermedad voluminosa y sintomática: en la serie " +
      "del MSKCC (155 pacientes, 1993-2023) el 70% de los tratados en primera línea redujo tamaño y " +
      "la supervivencia libre de progresión a 5 años fue del 67,6%. La sublocalización mesentérica " +
      "desfavorable —raíz de la arteria mesentérica superior, retroperitoneo o enfermedad multifocal— " +
      "es predictor independiente de evento (HR 2,85; IC95% 1,27-6,41): en ese grupo solo se operó el " +
      "35,7% de los pacientes, frente al 88,3% de las localizaciones favorables (íleon, yeyuno).",
    referencias:
      "Lozano Lominchar P, Crago AM et al. Serie MSKCC 1993-2023 · Kasper B. JAMA Oncol 2024",
  },
  {
    id: "p3",
    etiqueta: "Caso 3 · Intraabdominal asociado a PAF",
    enunciado:
      "Varón con síndrome de Gardner y panproctocolectomía con anastomosis ileorrectal. Fibromatosis " +
      "desmoide mesentérica multifocal tratada sucesivamente con sulindac-tamoxifeno, doxorrubicina " +
      "liposomal y sorafenib, con progresión. Ingresa por episodios suboclusivos de repetición: masa " +
      "que infiltra la anastomosis ileorrectal con dilatación ileal retrógrada.",
    pregunta: "¿Qué plantea?",
    opciones: [
      { id: "A", texto: "Resección mesentérica radical con intención R0" },
      { id: "B", texto: "Resección multivisceral y anastomosis primaria" },
      { id: "C", texto: "Radioterapia pélvica" },
      { id: "D", texto: "Cirugía mínima dirigida a resolver la obstrucción y mantener el tratamiento sistémico" },
      { id: "E", texto: "Evaluación para trasplante intestinal" },
    ],
    correcta: "D",
    clave:
      "En la fibromatosis desmoide asociada a PAF la cirugía debe evitarse siempre que sea posible; " +
      "cuando hay complicación, el objetivo es el procedimiento de menor morbilidad que la resuelva.",
    explicacion:
      "El trauma quirúrgico estimula la enfermedad y la resección mesentérica radical conlleva síndrome " +
      "de intestino corto y recidiva casi segura; la cirugía profiláctica está contraindicada y el consenso " +
      "recomienda evitar incluso la biopsia cuando el diagnóstico radiológico es claro. Ante obstrucción, " +
      "isquemia, perforación o fístula se interviene con el gesto mínimo eficaz —derivación, bypass o estoma— " +
      "manteniendo el control sistémico. El trasplante intestinal es una opción real, pero de rescate y en " +
      "fallo intestinal establecido: en la serie de Cambridge, 15 de 144 trasplantes se indicaron por " +
      "desmoide-PAF, con supervivencia global a 5 años del 82%.",
    referencias: "Kasper B. JAMA Oncol 2024 · Canovai E. Transplant Direct 2024",
  },
];
