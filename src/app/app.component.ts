import { Component, signal } from '@angular/core';
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
}

interface PortfolioProject {
  title: string;
  period?: string;
  description: string;
  tags: string[];
  color: 'lime' | 'blue' | 'purple' | 'orange' | 'yellow' | 'pink';
  repositoryUrl: string;
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

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
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
    },
    {
      title: 'Professor de Robótica e Programação',
      organization: 'SuperGeeks',
      period: '2024 — 2025',
      description:
        'Lecionei C, Python, C++, HTML, CSS e JavaScript, simplificando tópicos complexos de hardware e software para crianças e adolescentes por meio de Arduinos e componentes eletrônicos.',
      tags: ['Ensino de Programação', 'Robótica', 'Arduino', 'C/C++', 'Python', 'Web'],
    },
    {
      title: 'Estagiário Técnico · Setor de Operações',
      organization: 'Biomtech Brasil',
      period: 'Jan 2026 — Jul 2026',
      description:
        'Atuei na manutenção, diagnóstico e testes de qualidade da interface web do FaceSchool e de equipamentos de reconhecimento facial, incluindo resolução de problemas em placas-mãe e displays.',
      tags: ['Manutenção de Hardware', 'Diagnóstico', 'Qualidade', 'Biometria'],
    },
  ];

  protected readonly projects: PortfolioProject[] = [
    {
      title: 'Legends Pokedex',
      description:
        'Pokédex web interativa criada para a disciplina de Desenvolvimento de Interfaces Web da PUC Minas. Permite pesquisar Pokémon, filtrar por geração, gerar gráficos de análise e montar coleções pessoais em boxes. Os dados são servidos por um banco simulado com json-server.',
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
      tags: ['Python', 'Pygame'],
      color: 'orange',
      repositoryUrl: 'https://github.com/LukasGom3s/FlappyBird-PyGame',
    },
    {
      title: 'GeoSolar',
      period: 'Ago 2026 — Out 2026',
      description:
        'Liderei um projeto interdisciplinar focado na análise de viabilidade de instalações solares para concessionárias de energia, com atuação em levantamento de requisitos, personas, wireframes e documentação.',
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
    },
  ];

  protected readonly education: PortfolioEntry[] = [
    {
      title: 'Bacharelado em Engenharia de Software',
      organization: 'PUC Minas',
      period: '2026 — 2030 · Em andamento',
      description:
        'Foco em arquitetura de sistemas, engenharia de requisitos e desenvolvimento web moderno.',
    },
    {
      title: 'Bacharelado em Ciência da Computação',
      organization: 'UFMG',
      period: '2024 — 2025 · Transferido',
      description:
        'Programa original de dez semestres. Construção de forte embasamento em algoritmos e programação estruturada e orientada a objetos.',
    },
    {
      title: 'Técnico em Eletrônica',
      organization: 'CEFET-MG',
      period: '2020 — 2023 · Concluído',
      description:
        'Formação com foco em projetos eletrônicos, manutenção de hardware, sistemas embarcados e cultura maker.',
    },
  ];

  protected readonly extracurriculars: PortfolioEntry[] = [
    {
      title: 'Projeto de Extensão Rolê Maker',
      organization: 'CEFET-MG',
      period: '2023',
      description:
        'Criei oficinas tecnológicas para a comunidade escolar, fiz manutenção de impressoras 3D e desenvolvi projetos de robôs autorais com microcontroladores.',
    },
    {
      title: 'Manutenção de Computadores',
      period: 'Atividade autônoma',
      description:
        'Montagem de PCs, configuração de sistemas operacionais e substituição de componentes.',
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

  protected async sendContactMessage(form: NgForm): Promise<void> {
    if (this.contactStatus() === 'sending') {
      return;
    }

    if (!emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey) {
      this.contactStatus.set('error');
      this.contactStatusMessage.set(
        'O formulário ainda não foi configurado. Consulte as instruções do EmailJS no README.',
      );
      return;
    }

    this.contactStatus.set('sending');
    this.contactStatusMessage.set('Enviando sua mensagem...');

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
      this.contactStatusMessage.set('Mensagem enviada com sucesso. Obrigado pelo contato!');
    } catch (error: unknown) {
      console.error('Falha ao enviar mensagem pelo EmailJS.', error);
      this.contactStatus.set('error');
      this.contactStatusMessage.set(
        'Não foi possível enviar sua mensagem. Confira a configuração do EmailJS e tente novamente.',
      );
    }
  }
}
