# **App Name**: Maranhão Insights

## Core Features:

- Painel Interativo da Pesquisa: Exibe estatísticas e visualizações chave da pesquisa, atualizadas dinamicamente com base nas seleções do usuário e filtragem multidimensional.
- Exploração de Dados Geoespaciais: Um mapa interativo alimentado por React-Leaflet para explorar dados da pesquisa geograficamente, permitindo aos usuários filtrar resultados por mesorregião e cidade com pop-ups glassmórficos.
- Motor de Filtro Multidimensional: Permite aos usuários filtrar e cruzar os dados brutos da pesquisa por vários atributos demográficos e de resposta (por exemplo, gênero, idade, índices de aprovação) através de uma interface de usuário intuitiva.
- Interface de Usuário Neomórfica e Glassmórfica Premium: Implementa um sistema de design coeso com Neomorfismo 3D para cartões, botões e controles segmentados, e Glassmorfismo para elementos flutuantes como bottom sheets, sidebars e tooltips, refletindo uma estética Apple HIG.
- Layout Responsivo Adaptativo: Alterna dinamicamente entre uma barra de navegação inferior glassmórfica fixa no celular e uma barra lateral glassmórfica retrátil no desktop para otimizar a experiência do usuário em todos os dispositivos.
- Processamento de Dados Brutos Embarcados: Utiliza os 1.817 registros individuais da pesquisa, embutidos diretamente como arrays JavaScript para filtragem e agregação eficiente no lado do cliente, sem chamadas a bancos de dados externos.

## Style Guidelines:

- Cor primária: Azul profundo e profissional (#1B3A5C) para cabeçalhos e texto principal, transmitindo confiança e clareza em um contexto de BI profissional.
- Cor de fundo: Azul acinzentado claro e dessaturado (#E0E5EC) servindo como uma base suave e neutra para os elementos neomórficos e mantendo a consistência com o tom primário.
- Cor de destaque: Ciano vibrante (#0095A8) para chamadas de ação e destaques importantes, proporcionando uma ênfase visual moderna e clara, mantendo uma relação análoga com a cor primária.
- Cores semânticas: Verde (#16A34A) para aprovação, vermelho (#DC2626) para desaprovação e cinza neutro (#9CA3AF) para não especificado/não respondido, oferecendo interpretação imediata dos dados.
- Visualização de dados: Uma paleta de 10 cores pastel harmoniosas, aplicadas com gradientes sutis, para representação eficaz e visualmente atraente dos dados dos candidatos em gráficos.
- Fonte para corpo e títulos: 'Inter' (sans-serif), com 'SF Pro' como fallback do sistema, garantindo renderização suavizada e números tabulares para apresentação de dados. Nota: atualmente apenas Google Fonts são suportadas.
- Ícones vetoriais minimalistas do Lucide React são usados em toda a aplicação, apresentando efeitos sutis de brilho e sombra interna para itens de navegação inferior ativos.
- Um design altamente responsivo com uma navegação inferior glassmórfica fixa no celular e uma barra lateral glassmórfica retrátil no desktop. Cartões principais usam cantos rounded-3xl, enquanto elementos secundários utilizam rounded-2xl, alinhando-se a uma estética premium inspirada na Apple.
- Transições fluidas da interface do usuário impulsionadas pelo Framer Motion, incluindo uma 'bottom sheet' arrastável estilo iOS, animações de entrada suaves para gráficos, efeitos de contagem numérica baseados em molas e estados de 'hover' sutis com mudanças de escala e sombra em elementos de desktop.