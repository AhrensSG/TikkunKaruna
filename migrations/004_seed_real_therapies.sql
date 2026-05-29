-- TikkunKaruna — Datos reales de sesiones extraídos de SesionesDetalladas.pdf
-- Ejecutar después de 003_therapy_categories.sql
-- ⚠  Borra primero las terapias de ejemplo del seed anterior

DELETE FROM invoices;
DELETE FROM payments;
DELETE FROM bookings;
DELETE FROM therapy_requirements;
DELETE FROM therapies;

-- ═══════════════════════════════════════════════════════════════
-- SESIONES INDIVIDUALES — PÉNDULO HEBREO (11 sesiones)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO therapies
  (name, subtitle, description, duration_minutes, price_cents,
   category, modality, is_pack, session_count, sort_order, image_url, is_active)
VALUES
-- 1
('Reprogramación Energética',
 'Limpieza energética profunda para identificar y liberar bloqueos que afectan tu bienestar físico, emocional o vital.',
 'Sesión individual de terapia holística online realizada con Péndulo Hebreo, orientada a la limpieza, regulación y armonización del sistema energético.',
 90, 7500, 'pendulo_hebreo', 'distancia', false, 1, 10, 'IMG_6593.JPG', true),
-- 2
('Desbloqueo de Chakras Esenciales',
 'Desbloqueo de los chakras esenciales y activación de tus canales de luz para que la energía circule de forma correcta y fluida.',
 'Sesión individual de terapia holística online realizada con Péndulo Hebreo.',
 60, 6500, 'pendulo_hebreo', 'distancia', false, 1, 20, 'IMG_6578.jpg', true),
-- 3
('Desbloqueo de Chakras Secundarios',
 'Desbloqueo de los chakras secundarios y activación de tus canales de luz para que la energía circule de forma correcta y fluida.',
 'Sesión individual de terapia holística online realizada con Péndulo Hebreo.',
 60, 6500, 'pendulo_hebreo', 'distancia', false, 1, 30, 'IMG_6580.JPG', true),
-- 4
('Desbloqueo de Chakras de Luz',
 'Desbloqueo de los chakras superiores y activación de sus canales de luz, favoreciendo una mayor conexión, claridad y expansión.',
 'Sesión individual de terapia holística online realizada con Péndulo Hebreo.',
 60, 6500, 'pendulo_hebreo', 'distancia', false, 1, 40, 'IMG_6581.JPG', true),
-- 5
('Sellado del Aura',
 'Identificación de fugas energéticas en el campo energético y reparación y sellado de las mismas.',
 'Sesión individual de terapia holística online realizada con Péndulo Hebreo.',
 60, 6500, 'pendulo_hebreo', 'distancia', false, 1, 50, 'IMG_6583.JPG', true),
-- 6
('Desintoxicación Energética de Hígado',
 'Depuración emocional profunda. El hígado es el órgano clave para materializar tus proyectos y deseos del alma.',
 'Cuando el hígado está saturado de emociones densas como rabia, ira o celos, se genera un bloqueo que dificulta que tus metas se manifiesten.',
 90, 7500, 'pendulo_hebreo', 'distancia', false, 1, 60, 'IMG_6591.JPG', true),
-- 7
('Sanación de Karma',
 'Identificación y liberación del karma activo que te afecta en este momento.',
 'Basándonos en la ley de causa y efecto, trabajamos sobre el karma activo para romper patrones, liberar ataduras y recuperar tu libertad.',
 90, 7500, 'pendulo_hebreo', 'distancia', false, 1, 70, 'IMG_6589.JPG', true),
-- 8
('Limpieza y Armonización de Canales de Conexión',
 'Armonización de tus canales de conexión con el Ser, el Yo Superior y los Guías Espirituales.',
 'Como seres espirituales que somos no estamos solos. Para que la vida fluya y cumplamos nuestro propósito, las conexiones deben estar en armonía.',
 90, 8000, 'pendulo_hebreo', 'distancia', false, 1, 80, 'IMG_6609.JPG', true),
-- 9
('Activación Letras Hebreas',
 'Integración de las 22 letras hebreas y las 5 letras finales en el campo energético.',
 'Las letras hebreas poseen una vibración específica que conecta directamente con la energía del alma, aportando una armonización profunda del sistema energético.',
 90, 7000, 'pendulo_hebreo', 'distancia', false, 1, 90, 'IMG_6610.JPG', true),
-- 10
('Limpieza Energética de Espacios',
 'Identificación, liberación y limpieza de las cargas energéticas de tu hogar o negocio.',
 'Los lugares que habitamos acumulan cargas energéticas a lo largo del tiempo. Cuando esa energía se estanca, puede afectarnos directamente en nuestro día a día.',
 120, 12000, 'pendulo_hebreo', 'distancia', false, 1, 100, 'IMG_6605.JPG', true),
-- 11
('Sesión para Mascotas',
 'Equilibrio energético para tus animales de compañía, tratados igual que las personas.',
 'Nuestros animales forman parte de la familia y su equilibrio energético influye directamente en su bienestar. Se trabaja liberando aquello que no les permite estar en armonía.',
 60, 7500, 'pendulo_hebreo', 'distancia', false, 1, 110, 'IMG_6607.JPG', true);

-- ═══════════════════════════════════════════════════════════════
-- SESIONES INDIVIDUALES — REIKI (4 sesiones)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO therapies
  (name, subtitle, description, duration_minutes, price_cents,
   category, modality, is_pack, session_count, sort_order, image_url, is_active)
VALUES
-- 12
('Reiki Armonización de Chakras',
 'Sesión enfocada en equilibrar y armonizar los centros energéticos del cuerpo.',
 'Ayuda a recuperar sensación de estabilidad, bienestar y fluidez energética. Modalidad: a distancia.',
 45, 3500, 'reiki', 'distancia', false, 1, 200, 'reiki-armonizacion-chakras.jpeg', true),
-- 13
('Reiki Emocional',
 'Sesión enfocada en acompañar emociones y aportar calma mental y emocional.',
 'Ayuda a liberar tensión emocional y favorecer estados de tranquilidad y bienestar.',
 45, 3500, 'reiki', 'distancia', false, 1, 210, 'IMG_6620.jpg', true),
-- 14
('Reiki Angelical',
 'Sesión energética profunda que combina la energía reiki con conexión angelical.',
 'Crea un espacio de paz, luz y acompañamiento espiritual. Trabaja el equilibrio energético y emocional junto con la conexión con energías de alta vibración.',
 60, 5000, 'reiki', 'distancia', false, 1, 220, 'IMG_6621.jpg', true),
-- 15
('Reiki en la Línea del Tiempo',
 'Sesión energética para armonizar emociones relacionadas con el pasado o preparar eventos importantes del futuro.',
 'Opción pasado: sanación de emociones atrapadas. Opción futuro: armonización energética de eventos próximos (exámenes, entrevistas, citas médicas...).',
 60, 4500, 'reiki', 'distancia', false, 1, 230, 'IMG_6622.jpg', true);

-- ═══════════════════════════════════════════════════════════════
-- PREREQUISITO: sesiones 6,7,8,9 requieren RESET ENERGÉTICO
-- Se asigna después de insertar los packs (al final del archivo)
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- PACKS — PÉNDULO HEBREO (4 packs)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO therapies
  (name, subtitle, description, duration_minutes, price_cents,
   category, modality, is_pack, session_count, sort_order, image_url, is_active)
VALUES
-- Pack 1
('Reset Energético Básico',
 'Reinicio energético global en 3 sesiones. Recomendado si nunca has realizado sesiones de Péndulo Hebreo.',
 'Actúa como un reinicio energético global, ayudando a recuperar claridad, fuerza y dirección para avanzar desde una nueva base más equilibrada. Las sesiones se realizan en días diferentes para integrar bien la energía.',
 210, 16000, 'pendulo_hebreo', 'distancia', true, 3, 300, 'IMG_6584.JPG', true),
-- Pack 2
('Reset Energético Premium',
 'Reinicio energético global en 5 sesiones incluyendo desbloqueo completo de todos los puntos energéticos.',
 'Versión ampliada del Reset Básico. Además del reinicio energético global, desbloquea y armoniza todos los puntos energéticos. Las sesiones se realizan en días diferentes.',
 330, 27500, 'pendulo_hebreo', 'distancia', true, 5, 310, 'IMG_6586.JPG', true),
-- Pack 3
('Pack Chakras',
 'Desbloqueo y armonización completa de todos los chakras: esenciales, secundarios y de luz.',
 'Programa pensado para tener todos los puntos de energía equilibrados. Las 3 sesiones se realizan en días diferentes para ir integrando bien la energía.',
 180, 16000, 'pendulo_hebreo', 'distancia', true, 3, 320, 'IMG_6585.JPG', true),
-- Pack 4
('Pack Frecuencia Divina',
 'Recupera la conexión con tu propia esencia, conciencia y equipo espiritual en 4 sesiones.',
 'Liberaremos energías densas y bloqueos que interfieren con el bienestar, aportando mayor claridad y facilitando la conexión interior.',
 300, 22000, 'pendulo_hebreo', 'distancia', true, 4, 330, 'IMG_6587.JPG', true);

-- ═══════════════════════════════════════════════════════════════
-- PACKS — REIKI (1 pack)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO therapies
  (name, subtitle, description, duration_minutes, price_cents,
   category, modality, is_pack, session_count, sort_order, image_url, is_active)
VALUES
('Pack Bienestar',
 'Acompañamiento energético mediante 4 sesiones para trabajar el bienestar de forma progresiva y profunda.',
 'Ideal para personas que desean mantener el equilibrio emocional, trabajar procesos personales, reducir el estrés continuado o crear una rutina de bienestar energético.',
 180, 12000, 'reiki', 'distancia', true, 4, 400, 'IMG_6571.jpg', true);

-- ═══════════════════════════════════════════════════════════════
-- PACK COMBINADO — Péndulo + Reiki
-- ═══════════════════════════════════════════════════════════════

INSERT INTO therapies
  (name, subtitle, description, duration_minutes, price_cents,
   category, modality, is_pack, session_count, sort_order, image_url, is_active)
VALUES
('Pack Proceso Renacer 6D',
 'El pack más elegido. 6 sesiones combinando Péndulo Hebreo + Reiki para una transformación progresiva y estable.',
 'Pack de acompañamiento energético profundo en el que se trabaja un único foco específico durante 6 sesiones, combinando Péndulo Hebreo (limpieza y armonización) con Reiki (integración, calma y equilibrio emocional).',
 540, 33300, 'combinado', 'distancia', true, 6, 500, 'IMG_6624.jpg', true);

-- ═══════════════════════════════════════════════════════════════
-- INDICACIONES POR SESIÓN
-- ═══════════════════════════════════════════════════════════════

-- Reprogramación Energética
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Estrés y ansiedad: sensación de estancamiento o bloqueo',
  'Agotamiento: malestar físico o falta de energía',
  'Confusión mental: pérdida de rumbo o repetición de patrones negativos',
  'Inseguridad: miedos y dificultades para avanzar en tu vida',
  'Interferencias externas: necesidad de liberar ataques energéticos'
]), generate_series(1,5)
FROM therapies WHERE name = 'Reprogramación Energética';

-- Desbloqueo Chakras Esenciales
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Bloqueo o estancamiento energético',
  'Falta de vitalidad o desequilibrio interno',
  'Dificultad para integrar emociones y experiencias',
  'Sensación de desconexión contigo misma'
]), generate_series(1,4)
FROM therapies WHERE name = 'Desbloqueo de Chakras Esenciales';

-- Desbloqueo Chakras Secundarios
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Sensación de bloqueo energético localizado en zonas puntuales del cuerpo',
  'Cansancio o sobrecarga en áreas determinadas',
  'Dificultad para sostener el equilibrio energético general',
  'Necesidad de reforzar la fluidez del sistema energético'
]), generate_series(1,4)
FROM therapies WHERE name = 'Desbloqueo de Chakras Secundarios';

-- Desbloqueo Chakras de Luz
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Falta de claridad o comprensión interna',
  'Sensación de desconexión o bloqueo a nivel energético sutil',
  'Dificultad para integrar procesos de conciencia',
  'Necesidad de profundizar en su conexión energética'
]), generate_series(1,4)
FROM therapies WHERE name = 'Desbloqueo de Chakras de Luz';

-- Sellado del Aura
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Eliminar las fugas energéticas',
  'Restaurar el equilibrio del sistema energético',
  'Reforzar la protección del campo energético'
]), generate_series(1,3)
FROM therapies WHERE name = 'Sellado del Aura';

-- Desintoxicación Energética de Hígado
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Eliminar emociones estancadas (rabia, enfado, frustración)',
  'Desbloquear la manifestación de tus proyectos y metas',
  'Conectar con tu corazón y tu verdadera esencia de forma más limpia',
  'Vivir en coherencia, alineando lo que sientes con lo que quieres crear'
]), generate_series(1,4)
FROM therapies WHERE name = 'Desintoxicación Energética de Hígado';

-- Sanación de Karma
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Atascada en situaciones que se repiten',
  'Afectada por miedos irracionales',
  'Bloqueada en relaciones o vivencias dolorosas',
  'Incapaz de avanzar a pesar del esfuerzo'
]), generate_series(1,4)
FROM therapies WHERE name = 'Sanación de Karma';

-- Canales de Conexión
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Falta de dirección en la vida',
  'Desconexión con su propósito',
  'Parálisis y bloqueo en la acción',
  'Vivir sin rumbo',
  'Sensación de que avanzas pero falta algo'
]), generate_series(1,5)
FROM therapies WHERE name = 'Limpieza y Armonización de Canales de Conexión';

-- Limpieza de Espacios
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Agotamiento constante o tristeza sin motivo aparente',
  'Apatía y falta de motivación',
  'Dificultad para dormir o descansar correctamente',
  'Conflictos y discusiones frecuentes en el hogar'
]), generate_series(1,4)
FROM therapies WHERE name = 'Limpieza Energética de Espacios';

-- Reiki Armonización de Chakras
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Cansancio',
  'Bloqueo energético',
  'Estrés',
  'Desmotivación',
  'Desequilibrio interior'
]), generate_series(1,5)
FROM therapies WHERE name = 'Reiki Armonización de Chakras';

-- Reiki Emocional
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Ansiedad',
  'Tristeza',
  'Estrés',
  'Agotamiento emocional',
  'Cambios personales'
]), generate_series(1,5)
FROM therapies WHERE name = 'Reiki Emocional';

-- Reiki Angelical
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Necesidad de paz emocional',
  'Conexión espiritual',
  'Liberar cargas energéticas',
  'Recuperar equilibrio interior',
  'Sentirse acompañada y sostenida energéticamente'
]), generate_series(1,5)
FROM therapies WHERE name = 'Reiki Angelical';

-- Reiki Línea del Tiempo
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Bloqueos emocionales del pasado',
  'Heridas del pasado que cuestan soltar',
  'Emociones repetitivas o cargas antiguas',
  'Preparación para exámenes, entrevistas o proyectos importantes',
  'Armonizar citas médicas o conversaciones difíciles'
]), generate_series(1,5)
FROM therapies WHERE name = 'Reiki en la Línea del Tiempo';

-- Pack Bienestar
INSERT INTO therapy_indications (therapy_id, indication, sort_order)
SELECT id, unnest(ARRAY[
  'Mantener el equilibrio emocional de forma continua',
  'Trabajar procesos personales progresivamente',
  'Reducir el estrés de forma sostenida',
  'Crear una rutina de bienestar energético'
]), generate_series(1,4)
FROM therapies WHERE name = 'Pack Bienestar';

-- ═══════════════════════════════════════════════════════════════
-- PREREQUISITOS
-- Las sesiones avanzadas recomiendan haber hecho el Reset Básico
-- ═══════════════════════════════════════════════════════════════

UPDATE therapies
SET prerequisite_id = (SELECT id FROM therapies WHERE name = 'Reset Energético Básico')
WHERE name IN (
  'Desintoxicación Energética de Hígado',
  'Sanación de Karma',
  'Limpieza y Armonización de Canales de Conexión',
  'Activación Letras Hebreas',
  'Reset Energético Premium',
  'Pack Frecuencia Divina'
);

-- ═══════════════════════════════════════════════════════════════
-- COMPOSICIÓN DE PACKS (pack_items)
-- ═══════════════════════════════════════════════════════════════

-- Pack Reset Energético Básico (3 sesiones)
INSERT INTO pack_items (pack_id, therapy_id, session_number, duration_minutes)
SELECT p.id, t.id, s.num, s.dur
FROM therapies p
CROSS JOIN (VALUES
  (1, 'Reprogramación Energética',        90),
  (2, 'Desbloqueo de Chakras Esenciales', 60),
  (3, 'Sellado del Aura',                 60)
) AS s(num, therapy_name, dur)
JOIN therapies t ON t.name = s.therapy_name
WHERE p.name = 'Reset Energético Básico';

-- Pack Reset Energético Premium (5 sesiones)
INSERT INTO pack_items (pack_id, therapy_id, session_number, duration_minutes)
SELECT p.id, t.id, s.num, s.dur
FROM therapies p
CROSS JOIN (VALUES
  (1, 'Reprogramación Energética',          90),
  (2, 'Desbloqueo de Chakras Esenciales',   60),
  (3, 'Desbloqueo de Chakras Secundarios',  60),
  (4, 'Desbloqueo de Chakras de Luz',       60),
  (5, 'Sellado del Aura',                   60)
) AS s(num, therapy_name, dur)
JOIN therapies t ON t.name = s.therapy_name
WHERE p.name = 'Reset Energético Premium';

-- Pack Chakras (3 sesiones)
INSERT INTO pack_items (pack_id, therapy_id, session_number, duration_minutes)
SELECT p.id, t.id, s.num, s.dur
FROM therapies p
CROSS JOIN (VALUES
  (1, 'Desbloqueo de Chakras Esenciales',  60),
  (2, 'Desbloqueo de Chakras Secundarios', 60),
  (3, 'Desbloqueo de Chakras de Luz',      60)
) AS s(num, therapy_name, dur)
JOIN therapies t ON t.name = s.therapy_name
WHERE p.name = 'Pack Chakras';

-- Pack Frecuencia Divina (4 sesiones; sesión 4 es personalizada, sin equivalente individual)
INSERT INTO pack_items (pack_id, therapy_id, session_number, duration_minutes)
SELECT p.id, t.id, s.num, s.dur
FROM therapies p
CROSS JOIN (VALUES
  (1, 'Reprogramación Energética',                        90),
  (2, 'Desbloqueo de Chakras de Luz',                     60),
  (3, 'Limpieza y Armonización de Canales de Conexión',   90)
) AS s(num, therapy_name, dur)
JOIN therapies t ON t.name = s.therapy_name
WHERE p.name = 'Pack Frecuencia Divina';

-- Sesión 4 personalizada (sin sesión individual equivalente)
INSERT INTO pack_items (pack_id, therapy_id, session_number, custom_label, duration_minutes)
SELECT id, NULL,
  4,
  'Protocolo personalizado para abrir la comunicación con el Ser Superior y los Guías Espirituales',
  60
FROM therapies WHERE name = 'Pack Frecuencia Divina';

-- Pack Bienestar — 4 sesiones de Reiki Emocional / Armonización
INSERT INTO pack_items (pack_id, therapy_id, session_number, duration_minutes)
SELECT p.id, t.id, s.num, 45
FROM therapies p
CROSS JOIN (VALUES (1), (2), (3), (4)) AS s(num)
JOIN therapies t ON t.name = 'Reiki Armonización de Chakras'
WHERE p.name = 'Pack Bienestar';

-- Pack Renacer 6D — estructura por fases (combinado)
INSERT INTO pack_items (pack_id, therapy_id, session_number, custom_label, duration_minutes)
SELECT p.id, NULL, s.num, s.label, s.dur
FROM therapies p
CROSS JOIN (VALUES
  (1, 'Evaluación energética + inicio del trabajo',                     120),
  (2, 'Limpieza, desbloqueo y trabajo profundo (Péndulo + Reiki)',       90),
  (3, 'Limpieza, desbloqueo y trabajo profundo (Péndulo + Reiki)',       90),
  (4, 'Limpieza, desbloqueo y trabajo profundo (Péndulo + Reiki)',       90),
  (5, 'Integración y estabilización energética (Péndulo + Reiki)',       90),
  (6, 'Cierre, equilibrio y consolidación del proceso (Péndulo + Reiki)',90)
) AS s(num, label, dur)
WHERE p.name = 'Pack Proceso Renacer 6D';

-- ═══════════════════════════════════════════════════════════════
-- VERIFICACIÓN FINAL
-- ═══════════════════════════════════════════════════════════════
SELECT
  t.name,
  t.category,
  t.is_pack,
  t.price_cents / 100 || ' €' AS precio,
  t.duration_minutes || ' min'  AS duracion,
  COUNT(ti.id) AS indicaciones,
  COUNT(pi.id) AS items_pack
FROM therapies t
LEFT JOIN therapy_indications ti ON ti.therapy_id = t.id
LEFT JOIN pack_items pi ON pi.pack_id = t.id
GROUP BY t.id, t.name, t.category, t.is_pack, t.price_cents, t.duration_minutes
ORDER BY t.sort_order;
