## dashboard-web (Desafio Técnico)
Este é um projeto em **ReactJS** + **NextJS** + **TypeScript**
As requisições à API são feitas via **fetch**, com organização por serviços.
O layout e os estilos foram feitos com **Tailwind CSS** e **Shadcn** como design system.
Para gráficos usei a biblioteca **Recharts**.
As cores são dinâmicas podendo ser facilmente trocadas em todo o projeto e o tema (claro, escuro) é baseado na preferência do usuário.

### Instalação

```sh
git clone https://github.com/gbrunosan/dashboard-web.git
cd dashboard-web
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:
```
NEXT_PUBLIC_API_URL=https://entrevista-front-end-xm3k.onrender.com
```

### Build de produção

```sh
npm run build
npm start
```

### Execução em desenvolvimento

```sh
npm run dev
```
