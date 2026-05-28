# 🐾 Ampara Pet

Marketplace de prestação de serviços para pets

---

## 🔗 Links

- **Link(Figma):** https://www.figma.com/proto/DfekcnfOS1cRjKhgjIzvBQ/AmparaPet_2.0?node-id=1-2&p=f&t=O4Z3wN9DJfG06QsM-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2
- **Repositório:** [github.com/Velasquez06/Amparapet](https://github.com/Velasquez06/Amparapet)

---

## 👥 Tipos de Usuário

| Tipo | Descrição |
|------|-----------|
| **Tutor** | Cliente que contrata serviços para seu pet |
| **Cuidador** | Prestador de serviços gerais (passeios, banho, hospedagem...) |
| **Médico Veterinário** | Prestador com CRMV, realiza consultas e procedimentos |

---

## 🗂️ Entidades do Banco de Dados

O projeto contempla **6 entidades principais:**

| Entidade | Descrição |
|----------|-----------|
| `users` | Todos os usuários do sistema (tutores e prestadores) |
| `professionals` | Perfil profissional de cuidadores e veterinários |
| `pets` | Pets cadastrados pelos tutores |
| `appointments` | Agendamentos de serviços |
| `reviews` | Avaliações dos atendimentos |
| `messages` | Mensagens entre usuários |

---

## 🛠️ Tecnologias Utilizadas

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes
- SQLite (via `@libsql/client`)
- bcryptjs (criptografia de senhas)
- JSON Web Token (autenticação)

---

## ⚙️ Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Git](https://git-scm.com/)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/Velasquez06/Amparapet.git
cd Amparapet
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
```
JWT_SECRET=amparapet_secret_2024
```

**4. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

**5. Acesse no navegador**
```
http://localhost:3000
```

> O banco de dados SQLite (`amparapet.db`) é criado automaticamente na primeira execução. Os dados de demonstração também são inseridos automaticamente.

---

## 👤 Dados para Teste

| Tipo de conta | E-mail | Senha |
|---------------|--------|-------|
| Tutor | tutor@demo.com | 123456 |
| Cuidador | cuidador@demo.com | 123456 |
| Médico Veterinário | vet@demo.com | 123456 |

---

## 📁 Estrutura do Projeto

```
amparapet/
├── app/
│   ├── api/                  # Rotas do backend (API REST)
│   │   ├── auth/             # Login, cadastro, sessão
│   │   ├── professionals/    # Listagem e perfil de profissionais
│   │   ├── appointments/     # Agendamentos
│   │   └── pets/             # Pets do tutor
│   ├── login/                # Tela de login
│   ├── cadastro/             # Tela de cadastro
│   ├── tutor/                # Área do tutor
│   │   ├── dashboard/        # Painel principal
│   │   ├── profissionais/    # Buscar profissionais
│   │   ├── agendar/          # Agendar serviço
│   │   ├── agenda/           # Calendário de agendamentos
│   │   ├── pets/novo/        # Cadastrar pet
│   │   └── emergencia/       # Modo emergência
│   └── prestador/            # Área do prestador
│       ├── dashboard/        # Painel com solicitações
│       └── perfil/           # Perfil profissional
├── lib/
│   ├── db.ts                 # Configuração e schema do banco
│   ├── auth.ts               # JWT e autenticação
│   └── seed.ts               # Dados iniciais para teste
└── README.md
```

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Autenticar usuário |
| POST | `/api/auth/register` | Cadastrar novo usuário |
| GET | `/api/auth/me` | Retorna usuário autenticado |
| POST | `/api/auth/logout` | Encerrar sessão |
| GET | `/api/professionals` | Listar profissionais (com filtros) |
| GET | `/api/professionals/[id]` | Perfil de um profissional |
| GET | `/api/pets` | Listar pets do tutor logado |
| POST | `/api/pets` | Cadastrar novo pet |
| GET | `/api/appointments` | Listar agendamentos |
| POST | `/api/appointments` | Criar agendamento |
| PATCH | `/api/appointments/[id]` | Atualizar status do agendamento |



