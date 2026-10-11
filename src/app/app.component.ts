import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { emailJsConfig } from './config/emailjs.config';

interface PortfolioEntry {
  title: string;
  organization?: string;
  period: string;
  description: string;
  tags?: string[];
  note?: string;
  english?: Partial<Pick<PortfolioEntry, 'title' | 'organization' | 'period' | 'description' | 'tags'>>;
}

interface PortfolioProject {
  title: string;
  period?: string;
  description: string;
  tags: string[];
  color: 'lime' | 'blue' | 'purple' | 'orange' | 'yellow' | 'pink';
  repositoryUrl: string;
  english?: Partial<Pick<PortfolioProject, 'period' | 'description' | 'tags'>>;
  logo?: {
    src: string;
    alt: string;
  };
}

interface SocialLink {
  label: string;
  detail: string;
  url: string;
  external?: boolean;
}

const translations = {
  pt: {
    languageLabel: 'Mudar idioma para inglês',
    languageButton: 'EN',
    ticker: '△ ENGENHARIA DE SOFTWARE <i>·</i> TECHOPS <i>·</i> ELETRÔNICA <i>·</i> CULTURA MAKER <i>·</i> BELO HORIZONTE, BRASIL <i>·</i>',
    skip: 'Pular para o conteúdo',
    areas: 'Áreas de atuação',
    home: 'Lucas Gomes, início',
    themeLight: 'Ativar tema claro',
    themeDark: 'Ativar tema escuro',
    navigation: 'Navegação principal',
    homeNav: 'início',
    experienceNav: 'experiência',
    projectsNav: 'projetos',
    certificatesNav: 'certificados',
    educationNav: 'formação',
    activitiesNav: 'atividades extras',
    contactNav: 'contato',
    introEyebrow: 'APRESENTAÇÃO · BH, BRASIL',
    role: 'Estudante de Engenharia de Software e Estagiário de TechOps',
    brandRole: 'ESTUDANTE DE ENGENHARIA DE SOFTWARE E ESTAGIÁRIO DE TECHOPS · BELO HORIZONTE, BRASIL',
    hardwareSoftware: 'HARDWARE<br />+ SOFTWARE',
    makerCulture: 'CULTURA<br />MAKER_',
    introDescription: 'Estudante de Engenharia de Software na PUC Minas, com formação técnica em Eletrônica pelo CEFET-MG.',
    seeExperience: 'VER EXPERIÊNCIA',
    interestAreas: 'Áreas de interesse',
    summaryEyebrow: 'FORM OV-00 · ÍNDICE DE REGISTROS',
    summaryTitle: 'TECNOLOGIA<br />EM VÁRIAS <span class="highlight-word">CAMADAS.</span>',
    aboutLead: 'Da infraestrutura física ao software — construindo, entendendo e conectando sistemas.',
    aboutFirst: 'Estudante de Engenharia de Software na PUC Minas, com formação técnica em Eletrônica pelo CEFET-MG. Apaixonado pela cultura maker e por construir soluções que unem infraestrutura física, hardware embarcado e desenvolvimento web.',
    aboutSecond: 'Minha experiência vai da educação tecnológica — simplificando tópicos complexos de hardware e software para jovens — ao diagnóstico de hardware em baixo nível, criação de automações e suporte operacional de infraestruturas.',
    skills: ['ENGENHARIA DE SOFTWARE', 'TECHOPS', 'ELETRÔNICA', 'HARDWARE EMBARCADO', 'CULTURA MAKER'],
    workEyebrow: 'FORM WK-01 · EXPERIÊNCIA PROFISSIONAL',
    experienceTitle: 'EXPERIÊNCIA',
    projectsEyebrow: 'FORM PJ-02 · PROJETOS SELECIONADOS',
    projectsTitle: 'PROJETOS',
    certificatesEyebrow: 'FORM CE-03 · CERTIFICADOS E LICENÇAS',
    certificatesTitle: 'CERTIFICADOS',
    educationEyebrow: 'FORM ED-04 · FORMAÇÃO ACADÊMICA',
    educationTitle: 'FORMAÇÃO',
    activitiesEyebrow: 'FORM VO-05 · ATIVIDADES EXTRACURRICULARES',
    activitiesTitle: 'VOLUNTARIADO<br />E <span class="highlight-word">ATIVIDADES EXTRAS.</span>',
    contactEyebrow: 'FORM CT-06 · CONTATO E CRÉDITOS',
    contactTitle: 'VAMOS<br /><span class="highlight-word">CONVERSAR?</span>',
    contactIntro: 'Entre em contato para conversar sobre tecnologia, projetos e novas oportunidades. Envie sua mensagem diretamente por aqui.',
    socialLinks: 'Redes sociais',
    name: 'NOME',
    email: 'E-MAIL',
    message: 'MENSAGEM',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'voce@exemplo.com',
    messagePlaceholder: 'Escreva sua mensagem...',
    sending: 'ENVIANDO...',
    sendMessage: 'ENVIAR MENSAGEM',
    projectRepository: 'Abrir o repositório de',
    githubSuffix: 'no GitHub',
    photoAlt: 'Foto de Lucas Gomes',
    projectType: 'PROJETO',
    openRepository: 'ABRIR REPOSITÓRIO',
    records: 'REGISTROS',
    record: 'REGISTRO',
    footerCredit: 'DESENVOLVIDO COM ANGULAR, TYPESCRIPT E CSS.',
    backToTop: 'VOLTAR AO TOPO',
    copyright: '© 2026 · BELO HORIZONTE, BRASIL',
    emailNotConfigured: 'O formulário ainda não foi configurado. Consulte as instruções do EmailJS no README.',
    sendingMessage: 'Enviando sua mensagem...',
    messageSent: 'Mensagem enviada com sucesso. Obrigado pelo contato!',
    messageFailed: 'Não foi possível enviar sua mensagem. Confira a configuração do EmailJS e tente novamente.',
  },
  en: {
    languageLabel: 'Switch language to Portuguese',
    languageButton: 'PT',
    ticker: '△ SOFTWARE ENGINEERING <i>·</i> TECHOPS <i>·</i> ELECTRONICS <i>·</i> MAKER CULTURE <i>·</i> BELO HORIZONTE, BRAZIL <i>·</i>',
    skip: 'Skip to content',
    areas: 'Areas of expertise',
    home: 'Lucas Gomes, home',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    navigation: 'Main navigation',
    homeNav: 'home',
    experienceNav: 'experience',
    projectsNav: 'projects',
    certificatesNav: 'certifications',
    educationNav: 'education',
    activitiesNav: 'extra activities',
    contactNav: 'contact',
    introEyebrow: 'ABOUT · BH, BRAZIL',
    role: 'Software Engineering Student and TechOps Intern',
    brandRole: 'SOFTWARE ENGINEERING STUDENT AND TECHOPS INTERN · BELO HORIZONTE, BRAZIL',
    hardwareSoftware: 'HARDWARE<br />+ SOFTWARE',
    makerCulture: 'MAKER<br />CULTURE_',
    introDescription: 'Software Engineering student at PUC Minas with a technical degree in Electronics from CEFET-MG.',
    seeExperience: 'VIEW EXPERIENCE',
    interestAreas: 'Areas of interest',
    summaryEyebrow: 'FORM OV-00 · RECORD INDEX',
    summaryTitle: 'TECHNOLOGY<br />ACROSS <span class="highlight-word">LAYERS.</span>',
    aboutLead: 'From physical infrastructure to software — building, understanding, and connecting systems.',
    aboutFirst: 'Software Engineering student at PUC Minas with a technical degree in Electronics from CEFET-MG. Passionate about maker culture and building solutions that bring together physical infrastructure, embedded hardware, and web development.',
    aboutSecond: 'My experience ranges from technology education — making complex hardware and software topics accessible to young people — to low-level hardware diagnostics, automation, and infrastructure operations support.',
    skills: ['SOFTWARE ENGINEERING', 'TECHOPS', 'ELECTRONICS', 'EMBEDDED HARDWARE', 'MAKER CULTURE'],
    workEyebrow: 'FORM WK-01 · PROFESSIONAL EXPERIENCE',
    experienceTitle: 'EXPERIENCE',
    projectsEyebrow: 'FORM PJ-02 · SELECTED PROJECTS',
    projectsTitle: 'PROJECTS',
    certificatesEyebrow: 'FORM CE-03 · CERTIFICATIONS AND LICENSES',
    certificatesTitle: 'CERTIFICATIONS',
    educationEyebrow: 'FORM ED-04 · EDUCATION',
    educationTitle: 'EDUCATION',
    activitiesEyebrow: 'FORM VO-05 · EXTRACURRICULAR ACTIVITIES',
    activitiesTitle: 'VOLUNTEERING<br />AND <span class="highlight-word">EXTRA ACTIVITIES.</span>',
    contactEyebrow: 'FORM CT-06 · CONTACT AND CREDITS',
    contactTitle: 'LET’S<br /><span class="highlight-word">TALK?</span>',
    contactIntro: 'Get in touch to talk about technology, projects, and new opportunities. Send me a message directly here.',
    socialLinks: 'Social links',
    name: 'NAME',
    email: 'EMAIL',
    message: 'MESSAGE',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'you@example.com',
    messagePlaceholder: 'Write your message...',
    sending: 'SENDING...',
    sendMessage: 'SEND MESSAGE',
    projectRepository: 'Open the repository for',
    githubSuffix: 'on GitHub',
    photoAlt: 'Photo of Lucas Gomes',
    projectType: 'PROJECT',
    openRepository: 'OPEN REPOSITORY',
    records: 'RECORDS',
    record: 'RECORD',
    footerCredit: 'BUILT WITH ANGULAR, TYPESCRIPT, AND CSS.',
    backToTop: 'BACK TO TOP',
    copyright: '© 2026 · BELO HORIZONTE, BRAZIL',
    emailNotConfigured: 'The form has not been configured yet. See the EmailJS instructions in the README.',
    sendingMessage: 'Sending your message...',
    messageSent: 'Message sent successfully. Thank you for reaching out!',
    messageFailed: 'Your message could not be sent. Check the EmailJS configuration and try again.',
  },
} as const;

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly language = signal<'pt' | 'en'>('pt');
  protected readonly copy = computed(() => translations[this.language()]);
  protected readonly isDark = signal(false);
  protected readonly contactStatus = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  protected readonly contactStatusMessage = signal('');
  protected contactName = '';
  protected contactEmail = '';
  protected contactMessage = '';

  protected readonly workEntries: PortfolioEntry[] = [
    {
      title: 'Estagiário TechOps',
      organization: 'Zurich Insurance Company Ltd',
      period: 'Ago 2026 — Presente',
      description:
        'Foco na expansão de habilidades para o desenvolvimento web e soluções práticas de tecnologia no suporte e operação da infraestrutura da empresa.',
      tags: ['TechOps', 'Suporte de TI', 'Desenvolvimento Web'],
      english: {
        title: 'TechOps Intern',
        period: 'Aug 2026 — Present',
        description:
          'Focused on expanding my web development skills and building practical technology solutions while supporting and operating company infrastructure.',
        tags: ['TechOps', 'IT Support', 'Web Development'],
      },
    },
    {
      title: 'Professor de Robótica e Programação',
      organization: 'SuperGeeks',
      period: '2024 — 2025',
      description:
        'Lecionei C, Python, C++, HTML, CSS e JavaScript, simplificando tópicos complexos de hardware e software para crianças e adolescentes por meio de Arduinos e componentes eletrônicos.',
      tags: ['Ensino de Programação', 'Robótica', 'Arduino', 'C/C++', 'Python', 'Web'],
      english: {
        title: 'Robotics and Programming Instructor',
        period: '2024 — 2025',
        description:
          'Taught C, Python, C++, HTML, CSS, and JavaScript, making complex hardware and software concepts accessible to children and teenagers through Arduino and electronic components.',
        tags: ['Programming Education', 'Robotics', 'Arduino', 'C/C++', 'Python', 'Web'],
      },
    },
    {
      title: 'Estagiário Técnico · Setor de Operações',
      organization: 'Biomtech Brasil',
      period: 'Jan 2026 — Jul 2026',
      description:
        'Atuei na manutenção, diagnóstico e testes de qualidade da interface web do FaceSchool e de equipamentos de reconhecimento facial, incluindo resolução de problemas em placas-mãe e displays.',
      tags: ['Manutenção de Hardware', 'Diagnóstico', 'Qualidade', 'Biometria'],
      english: {
        title: 'Technical Intern · Operations',
        period: 'Jan 2026 — Jul 2026',
        description:
          'Worked on maintenance, diagnostics, and quality testing for the FaceSchool web interface and facial recognition equipment, including troubleshooting motherboards and displays.',
        tags: ['Hardware Maintenance', 'Diagnostics', 'Quality', 'Biometrics'],
      },
    },
  ];

  protected readonly projects: PortfolioProject[] = [
    {
      title: 'Legends Pokedex',
      description:
        'Pokédex web interativa criada para a disciplina de Desenvolvimento de Interfaces Web da PUC Minas. Permite pesquisar Pokémon, filtrar por geração, gerar gráficos de análise e montar coleções pessoais em boxes. Os dados são servidos por um banco simulado com json-server.',
      english: {
        description:
          'Interactive web Pokédex built for PUC Minas’ Web Interface Development course. Search Pokémon, filter by generation, view analytics charts, and organize personal collections into boxes. Data is served by a simulated database using json-server.',
        tags: ['JavaScript (ES6+)', 'Bootstrap', 'Node.js', 'json-server', 'Chart.js'],
      },
      tags: ['JavaScript (ES6+)', 'Bootstrap', 'Node.js', 'json-server', 'Chart.js'],
      color: 'lime',
      repositoryUrl: 'https://github.com/LukasGom3s/Legends-Pokedex',
      logo: {
        src: '/images/projects/legends-pokedex.png',
        alt: 'Logo do Legends Pokedex',
      },
    },
    {
      title: 'FlyUFMG',
      period: 'Maio 2025',
      description:
        'Remake do clássico Flappy Bird, desenvolvido como trabalho final de Programação de Desenvolvimento de Software 2 na UFMG. Feito em C++17 com Allegro 5, possui leaderboard, três níveis de dificuldade e cenários dinâmicos que simulam diferentes climas.',
      english: {
        period: 'May 2025',
        description:
          'A remake of the classic Flappy Bird, developed as the final project for Software Development Programming 2 at UFMG. Built with C++17 and Allegro 5, it features a leaderboard, three difficulty levels, and dynamic weather-inspired environments.',
        tags: ['C++17', 'Allegro 5', 'Make', 'Doxygen', 'Game Development'],
      },
      tags: ['C++17', 'Allegro 5', 'Make', 'Doxygen', 'Game Dev'],
      color: 'blue',
      repositoryUrl: 'https://github.com/LukasGom3s/FlyUFMG',
      logo: {
        src: '/images/projects/fly-ufmg.png',
        alt: 'Logo do FlyUFMG',
      },
    },
    {
      title: 'Stanley Spider',
      period: 'Set 2026',
      description:
        'Web scraper que coleta nome, tamanho e preço de garrafas térmicas na loja online da Stanley. Interage pelo terminal para receber filtros e exporta os resultados consolidados para um arquivo JSON local.',
      english: {
        period: 'Sep 2026',
        description:
          'A web scraper that collects the names, sizes, and prices of thermal bottles from Stanley’s online store. It accepts filters through the terminal and exports the results to a local JSON file.',
      },
      tags: ['Python', 'Scrapy'],
      color: 'purple',
      repositoryUrl: 'https://github.com/LukasGom3s/StanleyWebScraping',
      logo: {
        src: '/images/projects/stanley-spider.png',
        alt: 'Logo da Stanley',
      },
    },
    {
      title: 'Flappy Py',
      period: 'Maio 2026',
      description:
        'Jogo 2D de desvio de obstáculos com progressão lateral contínua, desenvolvido como projeto final de Introdução a Algoritmos. Criado em Python e Pygame, inclui gravidade, pulo com física e sistema de três vidas.',
      english: {
        period: 'May 2026',
        description:
          'A 2D side-scrolling obstacle-avoidance game developed as the final project for Introduction to Algorithms. Built with Python and Pygame, it features gravity, physics-based jumping, and a three-life system.',
      },
      tags: ['Python', 'Pygame'],
      color: 'orange',
      repositoryUrl: 'https://github.com/LukasGom3s/FlappyBird-PyGame',
    },
    {
      title: 'GeoSolar',
      period: 'Ago 2026 — Out 2026',
      description:
        'Liderei um projeto interdisciplinar focado na análise de viabilidade de instalações solares para concessionárias de energia, com atuação em levantamento de requisitos, personas, wireframes e documentação.',
      english: {
        period: 'Aug 2026 — Oct 2026',
        description:
          'Led an interdisciplinary project analyzing the feasibility of solar installations for utility companies, contributing to requirements gathering, personas, wireframes, and documentation.',
        tags: ['Software Engineering', 'Requirements', 'LaTeX', 'UI/UX', 'Solar Energy'],
      },
      tags: ['Engenharia de Software', 'Requisitos', 'LaTeX', 'UI/UX', 'Energia Solar'],
      color: 'yellow',
      repositoryUrl:
        'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti2-8243100-mentalist',
      logo: {
        src: '/images/projects/geosolar.png',
        alt: 'Logo do GeoSolar',
      },
    },
    {
      title: 'Weather REST API',
      period: 'Ago 2026',
      description:
        'API RESTful integrada à Open-Meteo para consumir e disponibilizar dados meteorológicos em tempo real.',
      english: {
        period: 'Aug 2026',
        description:
          'A REST API integrated with Open-Meteo to retrieve and provide real-time weather data.',
      },
      tags: ['Java', 'Spring Boot', 'REST API'],
      color: 'pink',
      repositoryUrl: 'https://github.com/LukasGom3s/RestAPI-Clima',
    },
  ];

  protected readonly certifications: PortfolioEntry[] = [
    {
      title: 'Eletricista de Redes de Distribuição Aérea',
      organization: 'SENAI / CEMIG',
      period: 'Jul 2026',
      description:
        'Treinamento especializado em infraestrutura e implementação de redes de distribuição de energia elétrica.',
      english: {
        title: 'Overhead Power Distribution Networks Electrician',
        period: 'Jul 2026',
        description:
          'Specialized training in the infrastructure and implementation of electrical power distribution networks.',
      },
    },
  ];

  protected readonly education: PortfolioEntry[] = [
    {
      title: 'Bacharelado em Engenharia de Software',
      organization: 'PUC Minas',
      period: '2026 — 2030 · Em andamento',
      description:
        'Foco em arquitetura de sistemas, engenharia de requisitos e desenvolvimento web moderno.',
      english: {
        title: 'Bachelor’s Degree in Software Engineering',
        period: '2026 — 2030 · In progress',
        description:
          'Focus on systems architecture, requirements engineering, and modern web development.',
      },
    },
    {
      title: 'Bacharelado em Ciência da Computação',
      organization: 'UFMG',
      period: '2024 — 2025 · Transferido',
      description:
        'Programa original de dez semestres. Construção de forte embasamento em algoritmos e programação estruturada e orientada a objetos.',
      english: {
        title: 'Bachelor’s Degree in Computer Science',
        period: '2024 — 2025 · Transferred',
        description:
          'Originally a ten-semester program. Built a strong foundation in algorithms and structured and object-oriented programming.',
      },
    },
    {
      title: 'Técnico em Eletrônica',
      organization: 'CEFET-MG',
      period: '2020 — 2023 · Concluído',
      description:
        'Formação com foco em projetos eletrônicos, manutenção de hardware, sistemas embarcados e cultura maker.',
      english: {
        title: 'Technical Degree in Electronics',
        period: '2020 — 2023 · Completed',
        description:
          'Training focused on electronics projects, hardware maintenance, embedded systems, and maker culture.',
      },
    },
  ];

  protected readonly extracurriculars: PortfolioEntry[] = [
    {
      title: 'Projeto de Extensão Rolê Maker',
      organization: 'CEFET-MG',
      period: '2023',
      description:
        'Criei oficinas tecnológicas para a comunidade escolar, fiz manutenção de impressoras 3D e desenvolvi projetos de robôs autorais com microcontroladores.',
      english: {
        title: 'Rolê Maker Outreach Project',
        period: '2023',
        description:
          'Created technology workshops for the school community, maintained 3D printers, and developed original microcontroller-based robot projects.',
      },
    },
    {
      title: 'Manutenção de Computadores',
      period: 'Atividade autônoma',
      description:
        'Montagem de PCs, configuração de sistemas operacionais e substituição de componentes.',
      english: {
        title: 'Computer Maintenance',
        period: 'Independent work',
        description:
          'PC assembly, operating system setup, and component replacement.',
      },
    },
  ];

  protected readonly socialLinks: SocialLink[] = [
    {
      label: 'E-mail',
      detail: 'LUCASGOMESCEFETMG@GMAIL.COM',
      url: 'mailto:lucasgomescefetmg@gmail.com',
    },
    {
      label: 'LinkedIn',
      detail: 'LUCASGOMESESTEVES',
      url: 'https://www.linkedin.com/in/lucasgomesesteves/',
      external: true,
    },
    {
      label: 'GitHub',
      detail: 'LUKASGOM3S',
      url: 'https://github.com/LukasGom3s',
      external: true,
    },
    {
      label: 'Discord',
      detail: '959151773728251914',
      url: 'https://discordapp.com/users/959151773728251914',
      external: true,
    },
  ];

  protected toggleTheme(): void {
    this.isDark.update((isDark) => !isDark);
  }

  protected toggleLanguage(): void {
    const language = this.language() === 'pt' ? 'en' : 'pt';
    this.language.set(language);
    this.document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    this.document.title = language === 'pt' ? 'Lucas Gomes — Portfólio' : 'Lucas Gomes — Portfolio';
  }

  protected localized<T>(portuguese: T, english?: T): T {
    return this.language() === 'en' && english !== undefined ? english : portuguese;
  }

  protected async sendContactMessage(form: NgForm): Promise<void> {
    if (this.contactStatus() === 'sending') {
      return;
    }

    if (!emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey) {
      this.contactStatus.set('error');
      this.contactStatusMessage.set(this.copy().emailNotConfigured);
      return;
    }

    this.contactStatus.set('sending');
    this.contactStatusMessage.set(this.copy().sendingMessage);

    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        {
          from_name: this.contactName.trim(),
          reply_to: this.contactEmail.trim(),
          message: this.contactMessage.trim(),
        },
        { publicKey: emailJsConfig.publicKey },
      );

      form.resetForm();
      this.contactStatus.set('success');
      this.contactStatusMessage.set(this.copy().messageSent);
    } catch (error: unknown) {
      console.error('Falha ao enviar mensagem pelo EmailJS.', error);
      this.contactStatus.set('error');
      this.contactStatusMessage.set(this.copy().messageFailed);
    }
  }
}
