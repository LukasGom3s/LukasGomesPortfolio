# Lucas Gomes — Portfólio

> Portfólio pessoal de Lucas Gomes, estudante de Engenharia de Software e estagiário de TechOps. Reúne experiências, projetos, formação e formas de contato em uma página responsiva.

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-green.svg)](./LICENSE)

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Executar localmente](#executar-localmente)
- [Configurar o formulário de contato](#configurar-o-formulário-de-contato)
- [Build e publicação](#build-e-publicação)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Documentação](#documentação)
- [Autor](#autor)
- [Licença](#licença)

## Sobre o projeto

Este site apresenta a trajetória profissional e acadêmica de Lucas Gomes, seus projetos e atividades extracurriculares. A interface foi construída como uma experiência de página única, com navegação por seções, layout responsivo e alternância entre temas claro e escuro.

## Funcionalidades

- Apresentação, experiência profissional, projetos, certificação, formação e atividades extracurriculares.
- Cartões de projetos com links para os respectivos repositórios no GitHub.
- Alternância de tema claro/escuro.
- Formulário de contato integrado ao EmailJS, com validação e estados de envio, sucesso e erro.
- Layout responsivo e navegação acessível entre seções.

## Tecnologias

- **Angular 22** e **TypeScript 6** — aplicação e componentes standalone.
- **HTML e CSS** — estrutura, temas, animações e layout responsivo.
- **Tailwind CSS 3.4** e **PostCSS** — configuração de estilos do projeto.
- **EmailJS Browser SDK** — envio de mensagens pelo formulário de contato.
- **Node.js e npm** — dependências, servidor local e build.

## Executar localmente

### Pré-requisitos

- Node.js compatível com Angular CLI 22.
- npm.

### Instalação

Na pasta raiz do repositório, instale as dependências e inicie o servidor:

```bash
npm ci
npm start
```

Abra <http://localhost:4200>.

Para gerar a versão de produção:

```bash
npm run build
```

O Angular CLI grava a saída compilada em `dist/`.

## Configurar o formulário de contato

O envio de mensagens utiliza [EmailJS](https://www.emailjs.com/), diretamente pelo navegador:

1. Crie uma conta no EmailJS e conecte o serviço de e-mail.
2. Crie um template de e-mail endereçado a `lucasgomescefetmg@gmail.com`.
3. No template, use os parâmetros `{{from_name}}`, `{{reply_to}}` e `{{message}}`.
4. Configure os identificadores públicos do serviço e do template e a Public Key em [`src/app/config/emailjs.config.ts`](./src/app/config/emailjs.config.ts).
5. Restrinja no painel do EmailJS os domínios autorizados a enviar mensagens.

O formulário depende dessas configurações para enviar. A Public Key, o Service ID e o Template ID são usados no cliente; **nunca inclua a Private Key no código do front-end**.

## Build e publicação

Execute `npm run build` e publique os arquivos estáticos gerados em `dist/` em um serviço de hospedagem compatível com aplicações Angular, como GitHub Pages, Netlify ou Vercel. A publicação ainda precisa ser configurada no provedor escolhido.

## Estrutura de pastas

```text
.
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── images/
│       ├── profile/             # Foto usada no cabeçalho, destaque e rodapé
│       └── projects/            # Logos dos projetos exibidos nos cartões
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── emailjs.config.ts # Configuração pública do EmailJS
│   │   ├── app.component.css     # Estilos do componente principal
│   │   ├── app.component.html    # Página e seções do portfólio
│   │   ├── app.component.ts      # Dados, estado e lógica da interface
│   │   ├── app.config.ts         # Configuração da aplicação Angular
│   │   └── app.routes.ts         # Rotas da aplicação
│   ├── index.html                # Documento HTML e metadados
│   ├── main.ts                  # Inicialização Angular
│   └── styles.css               # Estilos globais e Tailwind CSS
├── angular.json                 # Configuração do Angular CLI
├── package.json                 # Dependências e comandos npm
├── tailwind.config.js           # Configuração do Tailwind CSS
└── tsconfig*.json               # Configuração do TypeScript
```

Os arquivos dentro de `public/` são servidos a partir da raiz do site. Para adicionar uma foto, coloque-a em `public/images/profile/`; para adicionar uma logo de projeto, use `public/images/projects/` e atualize o caminho correspondente nos dados do projeto em `src/app/app.component.ts`.

## Documentação

- [Angular](https://angular.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [EmailJS](https://www.emailjs.com/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## Autor

**Lucas Gomes**

- [GitHub](https://github.com/LukasGom3s)
- [LinkedIn](https://www.linkedin.com/in/lucasgomesesteves/)
- [E-mail](mailto:lucasgomescefetmg@gmail.com)

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [`LICENSE`](./LICENSE).
