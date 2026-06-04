-- Seed de desenvolvimento — 6 projetos (2 por categoria)
-- Executar após as migrations. Usar somente em ambiente de dev.

INSERT INTO projects (title, slug, category, description, year, status)
VALUES
  (
    'Residência Jardins',
    'residencia-jardins',
    'residential',
    'Projeto residencial unifamiliar com 280m² em Campo Grande, MS. Programa contemporâneo com integração sala-jardim, fachada em concreto aparente e madeira tratada.',
    2024,
    'published'
  ),
  (
    'Casa Ipê',
    'casa-ipe',
    'residential',
    'Residência térrea de 320m² com piscina e área gourmet integrada. Projeto executivo completo com aprovação municipal.',
    2023,
    'published'
  ),
  (
    'Clínica Saúde Plena',
    'clinica-saude-plena',
    'commercial',
    'Projeto arquitetônico de clínica médica multiespecialidade com 450m². Aprovação junto ao CRM-MS e Vigilância Sanitária.',
    2024,
    'published'
  ),
  (
    'Edifício Comercial Centro',
    'edificio-comercial-centro',
    'commercial',
    'Edifício de 8 pavimentos com lajes corporativas flexíveis. Registro de incorporação aprovado conforme NBR 12721.',
    2023,
    'published'
  ),
  (
    'Render Torre Morumbi',
    'render-torre-morumbi',
    'render',
    'Visualização 3D fotorrealista de torre residencial de alto padrão. Material de lançamento produzido para campanha de vendas.',
    2024,
    'published'
  ),
  (
    'Render Residencial Carioca',
    'render-residencial-carioca',
    'render',
    'Perspectivas externas e internas para lançamento imobiliário. Pacote completo com fachada, hall de entrada e apartamento decorado.',
    2024,
    'published'
  );
