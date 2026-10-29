// GENERADO POR build/construir.py — no editar a mano.
// El banco de preguntas vive en build/preguntas.py, junto a la presentación.

export const SESION = {
  titulo: "Tumores desmoides intraabdominales",
  subtitulo: "Sesión interactiva · 36 Congreso Nacional de Cirugía · CNC 2026",
};

export const PREGUNTAS = [
  {
    "id": "p1",
    "etiqueta": "Diagnóstico · 1 de 4",
    "enunciado": "Mujer de 51 años, sin antecedentes. TC: masa sólida mesentérica de 15 cm centrada en la raíz del mesenterio, que desplaza los vasos mesentéricos sin trombosarlos.",
    "pregunta": "¿Cuál es el siguiente paso?",
    "opciones": [
      {
        "id": "A",
        "texto": "Laparotomía y resección diagnóstica"
      },
      {
        "id": "B",
        "texto": "PAAF guiada por TC"
      },
      {
        "id": "C",
        "texto": "Biopsia con aguja gruesa guiada por imagen"
      },
      {
        "id": "D",
        "texto": "PET-TC y decidir según la captación"
      },
      {
        "id": "E",
        "texto": "Repetir la TC en tres meses"
      }
    ],
    "correcta": "C",
    "clave": "Biopsia con aguja gruesa. El diagnóstico es histológico y operar para diagnosticar está proscrito.",
    "explicacion": "Una masa mesentérica obliga a separar el desmoide del GIST, el liposarcoma desdiferenciado, el tumor fibroso solitario y el linfoma, y eso exige arquitectura tisular e inmunohistoquímica: la PAAF no basta. La biopsia percutánea con aguja gruesa guiada por imagen es segura y la siembra del trayecto no es clínicamente relevante. Operar para diagnosticar compromete la estrategia posterior y, en el desmoide, el trauma quirúrgico es en sí mismo un estímulo.",
    "referencias": "Kasper B. JAMA Oncol 2024"
  },
  {
    "id": "p2",
    "etiqueta": "Diagnóstico · 2 de 4",
    "enunciado": "La biopsia muestra una proliferación fusocelular de densidad celular baja, sin atipia ni necrosis, en un estroma colagenizado.",
    "pregunta": "¿Qué hallazgo inmunohistoquímico confirma el diagnóstico?",
    "opciones": [
      {
        "id": "A",
        "texto": "CD117 y DOG1 positivos"
      },
      {
        "id": "B",
        "texto": "STAT6 nuclear"
      },
      {
        "id": "C",
        "texto": "Amplificación de MDM2"
      },
      {
        "id": "D",
        "texto": "Tinción nuclear de β-catenina"
      },
      {
        "id": "E",
        "texto": "Desmina y miogenina positivas"
      }
    ],
    "correcta": "D",
    "clave": "β-catenina nuclear, y tan importante como eso: la exclusión de los grandes imitadores.",
    "explicacion": "La proliferación fibroblástica y miofibroblástica del desmoide expresa β-catenina nuclear en la mayoría de los casos, con actina de músculo liso positiva y un índice Ki-67 muy bajo. El valor del panel está tanto en lo que marca como en lo que descarta: CD117 y DOG1 señalan GIST, STAT6 tumor fibroso solitario, MDM2 liposarcoma desdiferenciado, y desmina con miogenina, estirpe muscular. Sin ese ejercicio de exclusión el diagnóstico no está cerrado.",
    "referencias": "Kasper B. JAMA Oncol 2024"
  },
  {
    "id": "p3",
    "etiqueta": "Diagnóstico · 3 de 4",
    "enunciado": "Desmoide mesentérico confirmado en una paciente de 51 años.",
    "pregunta": "¿Qué hay que descartar siempre?",
    "opciones": [
      {
        "id": "A",
        "texto": "Síndrome de Lynch"
      },
      {
        "id": "B",
        "texto": "Neurofibromatosis tipo 1"
      },
      {
        "id": "C",
        "texto": "Síndrome de Li-Fraumeni"
      },
      {
        "id": "D",
        "texto": "Neoplasia endocrina múltiple tipo 1"
      },
      {
        "id": "E",
        "texto": "Poliposis adenomatosa familiar"
      }
    ],
    "correcta": "E",
    "clave": "Poliposis adenomatosa familiar. Cambia la estrategia entera, y el desmoide es la primera causa de mortalidad no colorrectal en estos pacientes.",
    "explicacion": "Entre el 5% y el 10% de los desmoides se asocian a PAF por mutación de APC, y la proporción sube en los intraabdominales. En la serie del MSKCC (n = 155) el 9% tenía PAF, pero con el doble de localizaciones desfavorables o multifocales (50% frente a 24%) y una edad mediana muy inferior. Ante un desmoide mesentérico: anamnesis familiar dirigida, colonoscopia y estudio de APC.",
    "referencias": "Nieuwenhuis MH. Int J Cancer 2011 · Serie MSKCC 1993-2023"
  },
  {
    "id": "p4",
    "etiqueta": "Diagnóstico · 4 de 4",
    "enunciado": "Confirmada la fibromatosis tipo desmoide.",
    "pregunta": "¿Qué estudio molecular aporta información pronóstica?",
    "opciones": [
      {
        "id": "A",
        "texto": "Mutación de CTNNB1 en el exón 3"
      },
      {
        "id": "B",
        "texto": "Mutación de KIT en el exón 11"
      },
      {
        "id": "C",
        "texto": "Amplificación de MDM2 y CDK4"
      },
      {
        "id": "D",
        "texto": "Translocación SS18-SSX"
      },
      {
        "id": "E",
        "texto": "Inestabilidad de microsatélites"
      }
    ],
    "correcta": "A",
    "clave": "CTNNB1 exón 3. La mutación S45F identifica a quien más probablemente acabará necesitando tratamiento.",
    "explicacion": "Los desmoides esporádicos mutan el exón 3 de CTNNB1 —T41A, S45F, S45P— en la gran mayoría; del 5% al 10% se asocian a mutación de APC en el contexto de poliposis adenomatosa familiar, y menos del 5% son wild-type. En el ensayo GRAFITI la mutación S45F fue el único predictor independiente de acabar necesitando tratamiento (HR 4,64; IC95% 1,38-15,8). No cambia la decisión inicial, pero sí la intensidad del seguimiento y lo que se le cuenta al paciente.",
    "referencias": "Crago AM. Genes Chromosomes Cancer 2015 · Schut AR. Ann Surg 2023 (GRAFITI)"
  },
  {
    "id": "p5",
    "etiqueta": "Tratamiento · 1 de 4",
    "enunciado": "Fibromatosis desmoide mesentérica de 15 cm, sin PAF. La paciente está asintomática y la masa no comprime nada.",
    "pregunta": "¿Cuál es la primera actitud?",
    "opciones": [
      {
        "id": "A",
        "texto": "Resección con intención R0"
      },
      {
        "id": "B",
        "texto": "Vigilancia activa"
      },
      {
        "id": "C",
        "texto": "Radioterapia"
      },
      {
        "id": "D",
        "texto": "Doxorrubicina liposomal"
      },
      {
        "id": "E",
        "texto": "Nirogacestat"
      }
    ],
    "correcta": "B",
    "clave": "Vigilancia activa, también en el desmoide intraabdominal no complicado.",
    "explicacion": "El 70% de los pacientes no necesita tratamiento activo a tres años (GRAFITI) y, en la serie de Salas, a 36 meses un 32% está estable y un 28% regresa espontáneamente. El tamaño por sí solo no indica tratar: lo indican los síntomas, la velocidad de crecimiento y la amenaza sobre una estructura crítica. En el MSKCC la cirugía de entrada cayó del 94,3% (1993-2010) al 55,9% (2011-2023) sin empeorar la supervivencia libre de evento a 5 años (77,8% frente a 77,6%).",
    "referencias": "Schut AR. Ann Surg 2023 · Salas S. J Clin Oncol 2011 · Serie MSKCC 1993-2023"
  },
  {
    "id": "p6",
    "etiqueta": "Tratamiento · 2 de 4",
    "enunciado": "Se decide vigilancia activa.",
    "pregunta": "¿Cómo se vigila?",
    "opciones": [
      {
        "id": "A",
        "texto": "Exploración clínica cada 6 meses, sin imagen"
      },
      {
        "id": "B",
        "texto": "TC mensual durante el primer año"
      },
      {
        "id": "C",
        "texto": "TC o RM a los 3-6 meses, espaciando si hay estabilidad"
      },
      {
        "id": "D",
        "texto": "PET-TC semestral"
      },
      {
        "id": "E",
        "texto": "Ecografía abdominal anual"
      }
    ],
    "correcta": "C",
    "clave": "Imagen seriada a los 3-6 meses; si se mantiene estable, se espacia.",
    "explicacion": "El objetivo de la vigilancia no es detectar crecimiento, que es esperable, sino detectar el crecimiento que amenaza algo. El intervalo corto inicial captura la fase de mayor actividad biológica; tras dos o tres años de estabilidad los controles se espacian. En el abdomen la prueba de referencia es la TC con contraste; la RM es útil en pelvis y pared. El PET no tiene papel. Lo que se vigila son tres cosas: tamaño, síntomas y velocidad de crecimiento.",
    "referencias": "Kasper B. JAMA Oncol 2024 · Salas S. J Clin Oncol 2011"
  },
  {
    "id": "p7",
    "etiqueta": "Tratamiento · 3 de 4",
    "enunciado": "Otro paciente: desmoide de mesenterio ileal resecado. La anatomía patológica informa de margen microscópico afecto, R1.",
    "pregunta": "¿Qué hace?",
    "opciones": [
      {
        "id": "A",
        "texto": "Reintervención para ampliar márgenes"
      },
      {
        "id": "B",
        "texto": "Radioterapia adyuvante"
      },
      {
        "id": "C",
        "texto": "Tratamiento sistémico adyuvante"
      },
      {
        "id": "D",
        "texto": "Vigilancia, sin añadir nada"
      },
      {
        "id": "E",
        "texto": "Nirogacestat durante un año"
      }
    ],
    "correcta": "D",
    "clave": "Nada añadido: vigilancia. El margen R1 no predice la recidiva.",
    "explicacion": "De 107 pacientes operados en la serie del MSKCC, 78 (72,9%) tuvieron R0 y 29 (27,1%) R1, y el margen microscópico afecto no se asoció a peor evolución (HR 0,53; IC95% 0,15-1,86; P = 0,33). El corolario quirúrgico importa más que el dato: si para conseguir un R0 hay que sacrificar intestino o estructuras vasculares, no compensa. La cirugía del desmoide es preservadora de función y de órgano.",
    "referencias": "Janssen ML. Br J Surg 2017 · Serie MSKCC 1993-2023"
  },
  {
    "id": "p8",
    "etiqueta": "Tratamiento · 4 de 4",
    "enunciado": "Vuelve el caso. Nirogacestat 150 mg cada 12 horas desde enero de 2026. En marzo la masa pasa de 15 × 14 × 10,8 a 20 × 17 × 14 cm y comprime la 2.ª y 3.ª porción duodenal. Irresecable.",
    "pregunta": "¿Cuál es el siguiente paso?",
    "opciones": [
      {
        "id": "A",
        "texto": "Cirugía citorreductora con resección intestinal extensa"
      },
      {
        "id": "B",
        "texto": "Doxorrubicina liposomal"
      },
      {
        "id": "C",
        "texto": "Cambio a sorafenib"
      },
      {
        "id": "D",
        "texto": "Radioterapia externa sobre la masa"
      },
      {
        "id": "E",
        "texto": "Vigilancia y repetir TC en 6 meses"
      }
    ],
    "correcta": "B",
    "clave": "Doxorrubicina liposomal: la mejor relación entre profundidad y durabilidad de respuesta en enfermedad voluminosa.",
    "explicacion": "En la serie del MSKCC, de los tratados con doxorrubicina liposomal en primera línea el 70% redujo tamaño, con una supervivencia libre de progresión a 5 años del 67,6% frente al 50,5% del resto de agentes. Las respuestas son duraderas: de 14 pacientes con regresión, solo 2 recrecieron, a los 11 y 36 meses de suspender, y ambos se manejaron con observación. En la raíz del mesenterio el bisturí es el tratamiento de más riesgo, no el de más control.",
    "referencias": "Serie MSKCC 1993-2023 · Kasper B. JAMA Oncol 2024"
  },
  {
    "id": "p9",
    "etiqueta": "Complicado · 1 de 4",
    "enunciado": "Mujer de 48 años. Laparotomía urgente por peritonitis. Se encuentra una masa de 30 cm en la raíz del mesenterio que engloba asas, y líquido fecaloideo libre por perforación de un asa englobada.",
    "pregunta": "¿Qué hace en ese quirófano?",
    "opciones": [
      {
        "id": "A",
        "texto": "Resección en bloque de la masa con el intestino englobado"
      },
      {
        "id": "B",
        "texto": "Exéresis parcial para citorreducir, y anastomosis"
      },
      {
        "id": "C",
        "texto": "Biopsia, derivación del asa perforada y drenaje, sin resecar la masa"
      },
      {
        "id": "D",
        "texto": "Cerrar y trasladar sin ningún gesto"
      },
      {
        "id": "E",
        "texto": "Resección con intención R0 y ostomía terminal"
      }
    ],
    "correcta": "C",
    "clave": "Biopsia, derivar y drenar. Resecar 30 cm en la raíz del mesenterio es isquemia intestinal segura.",
    "explicacion": "En el desmoide mesentérico la cirugía urgente se reserva a la complicación y se hace con el gesto mínimo que la resuelva: derivación, bypass, estoma o drenaje. Intentar la resección de una masa que engloba la raíz mesentérica condena al paciente a un síndrome de intestino corto y, en el desmoide, el trauma quirúrgico es además un estímulo para la enfermedad. Lo que sí hay que hacer en ese quirófano es tomar biopsia: el diagnóstico histológico abre todas las puertas terapéuticas posteriores.",
    "referencias": "Kasper B. JAMA Oncol 2024 · Serie MSKCC 1993-2023"
  },
  {
    "id": "p10",
    "etiqueta": "Complicado · 2 de 4",
    "enunciado": "Al tercer día, dehiscencia de la yeyunostomía, resuelta con resección del segmento abierto y anastomosis. Seis semanas después vuelve a urgencias hipotensa: absceso que drena por la herida y asa yeyunal englobada perforada.",
    "pregunta": "¿Cuál es el siguiente paso?",
    "opciones": [
      {
        "id": "A",
        "texto": "Relaparotomía y resección del foco"
      },
      {
        "id": "B",
        "texto": "Antibiótico dirigido y drenaje percutáneo guiado por imagen"
      },
      {
        "id": "C",
        "texto": "Laparostomía con sistema de vacío"
      },
      {
        "id": "D",
        "texto": "Empezar quimioterapia de inmediato"
      },
      {
        "id": "E",
        "texto": "Antibiótico aislado, sin drenar"
      }
    ],
    "correcta": "B",
    "clave": "Antibiótico y drenaje percutáneo. Cada relaparotomía sobre un desmoide mesentérico añade morbilidad y estímulo tumoral.",
    "explicacion": "La paciente recibió meropenem y un drenaje percutáneo del absceso, con tolerancia completa a la dieta, apirexia y estabilidad hemodinámica en pocos días. La alternativa quirúrgica habría significado abrir por tercera vez un abdomen con un tumor que infiltra el mesenterio, con alto riesgo de nuevas fístulas. El drenaje percutáneo es aquí lo que permite llegar en condiciones al tratamiento oncológico.",
    "referencias": "Caso HGUGM · Kasper B. JAMA Oncol 2024"
  },
  {
    "id": "p11",
    "etiqueta": "Complicado · 3 de 4",
    "enunciado": "Resuelta la sepsis, tolera dieta y está afebril. La TC muestra una masa de 10,9 × 17,3 × 22,5 cm que engloba la raíz mesentérica.",
    "pregunta": "¿Cuál es la estrategia?",
    "opciones": [
      {
        "id": "A",
        "texto": "Cirugía radical programada ahora que está estable"
      },
      {
        "id": "B",
        "texto": "Tratamiento sistémico primero y reevaluar la cirugía según la respuesta"
      },
      {
        "id": "C",
        "texto": "Vigilancia activa indefinida"
      },
      {
        "id": "D",
        "texto": "Radioterapia abdominal y después cirugía"
      },
      {
        "id": "E",
        "texto": "Derivación definitiva y cuidados de soporte"
      }
    ],
    "correcta": "B",
    "clave": "Sistémico primero. La cirugía se decide después, con la masa reducida y separada de la raíz.",
    "explicacion": "Esta paciente recibió ocho ciclos de doxorrubicina liposomal, con reacción alérgica en el cuarto ciclo que obligó a una pauta de desensibilización, y toxicidad por lo demás manejable: eritrodisestesia palmoplantar grado 1, astenia grado 2 y mucositis grado 1. La secuencia importa más que el agente: la decisión quirúrgica se toma sobre el tumor que queda, no sobre el que había. Menos del 5-10% de los pacientes acaba necesitando un rescate quirúrgico, y conviene que sea el que de verdad se puede hacer bien.",
    "referencias": "Caso HGUGM · Salas S. J Clin Oncol 2011 · Serie MSKCC 1993-2023"
  },
  {
    "id": "p12",
    "etiqueta": "Complicado · 4 de 4",
    "enunciado": "Misma presentación, mismo tumor, pero en un paciente con poliposis adenomatosa familiar y colectomía previa.",
    "pregunta": "¿Qué cambiaría?",
    "opciones": [
      {
        "id": "A",
        "texto": "Nada: el manejo es exactamente el mismo"
      },
      {
        "id": "B",
        "texto": "Se operaría antes, de forma profiláctica, para adelantarse al crecimiento"
      },
      {
        "id": "C",
        "texto": "Se evitaría la cirugía aún más, con el tratamiento sistémico como estrategia central"
      },
      {
        "id": "D",
        "texto": "Se trataría solo con radioterapia"
      },
      {
        "id": "E",
        "texto": "Se indicaría trasplante intestinal de entrada"
      }
    ],
    "correcta": "C",
    "clave": "En PAF se evita la cirugía todavía más. Solo ante complicación vital, y con el gesto de menor morbilidad.",
    "explicacion": "El trauma quirúrgico estimula la enfermedad y la resección mesentérica radical conlleva intestino corto y recidiva casi segura; la cirugía profiláctica está contraindicada y el consenso de 2024 recomienda evitar incluso la biopsia cuando la imagen es típica en un paciente con PAF conocida. En la serie del MSKCC el 50% de los pacientes con PAF recibió tratamiento sistémico de entrada, frente al 18,4% de los esporádicos. Cuando el intestino ya se ha perdido queda el trasplante: en Cambridge, 15 de 144 trasplantes intestinales se indicaron por desmoide asociado a PAF, con supervivencia global a 5 años del 82%.",
    "referencias": "Kasper B. JAMA Oncol 2024 · Canovai E. Transplant Direct 2024 · Serie MSKCC"
  }
];
