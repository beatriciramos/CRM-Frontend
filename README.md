📌 CRM Simplificado
🗂 Geral do Projeto

💡 Nome: CRM Simplificado

🎯 Objetivo: Sistema para gerenciar clientes, atendimentos e usuários

🛠 Funcionalidades:

👥 Gestão de clientes (CRUD)

📝 Gestão de atendimentos (CRUD)

🔑 Gestão de usuários com roles: ADMIN, SELLER, ATTENDANT

🛡 Sistema de permissões baseado em roles

📊 Dashboard e filtros dinâmicos

🔐 Autenticação JWT

🌗 Modo claro/escuro

⚡ Tecnologias:

Frontend: React, Material UI, styled-components, react-router-dom

Backend: Node.js, Express, Prisma, PostgreSQL

Autenticação: JWT + Roles

Outras libs: bcrypt, react-toastify

⚙️ Backend
💻 Instalação

Clone o repositório:

git clone <REPO_URL>
cd backend
npm install

🛠 Configuração Inicial

Crie .env:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin123!
BCRYPT_SALT=10
JWT_SECRET="sua_chave_secreta"


Rodar migrações:

npx prisma migrate dev


Criar seed inicial do admin:

npx prisma db seed


Isso criará automaticamente um usuário ADMIN.

🚀 Rodar servidor
npm run dev


Servidor disponível em: http://localhost:4000


🔐 Sistema de Permissões

ADMIN → acesso total, pode criar, editar, visualizar e deletar usuários

SELLER → apenas visualiza usuários e atendimentos

ATTENDANT → acesso restrito a atendimentos e clientes

🖥 Frontend
💻 Instalação

npm install

🛠 Configuração Inicial

Criar .env:

REACT_APP_API_URL=http://localhost:4000

🚀 Rodar aplicação
npm start


Disponível em: http://localhost:3000

🧩 Estrutura de Pastas

/src

/components → componentes reutilizáveis (Navbar, Modals)

/pages → páginas (Customers, Attendance, Admin Panel)

/context → AuthContext, ThemeContext

/api → Axios setup

/utils → helpers e tipagens

⚡ Funcionalidades

Navbar baseada no role do usuário

Modals para criação, edição e visualização

Filtros e busca em listas

Notificações via Snackbar

📦 Rodando o Projeto Completo

Inicie o PostgreSQL

Rodar Backend:

npm install
npx prisma migrate dev
npx prisma db seed
npm run dev


Rodar Frontend:

npm install
npm start


Acesse o sistema:

Frontend: http://localhost:3000

Backend: http://localhost:4000

✅ Usuários de Teste

Admin: SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD

Roles disponíveis:

🛡 ADMIN → acesso total

🏷 SELLER → apenas visualiza

👨‍💻 ATTENDANT → atendimentos e clientes
