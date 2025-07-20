# 🚀 MiraTask - Aplicativo de Gerenciamento de Projetos

Aplicação completa de gerenciamento de projetos com **React**, **Next.js** e **Firebase**. Interface intuitiva, colaboração em tempo real e funcionalidades avançadas para organização de equipes e tarefas.

---

## 🧰 Tecnologias Utilizadas

- [x] **React.js**
- [x] **Next.js**
- [x] **TypeScript**
- [x] **TailwindCSS**
- [x] **Firebase** (Auth, Firestore, Storage, Notifications)
- [ ] **React DnD** (drag & drop para Kanban)

---

## 🎯 Funcionalidades

### 🔐 Autenticação e Conta de Usuário

- [x] Formulário de registro com validação
- [x] Formulário de login com validação
- [x] Logout
- [x] Persistência da sessão de usuário
- [x] Redirecionamento após login/register
- [x] Proteção de rotas privadas

---

### 📁 Gestão de Projetos

- [x] Dashboard com projetos do usuário
- [x] Criar projeto (título, descrição, datas)
- [x] Editar projeto
- [x] Detalhes do projeto (membros, tarefas)
- [x] Atribuir membros a um projeto

---

### ✅ Tarefas

- [x] Criar tarefas com título, descrição, status, responsável, datas
- [x] Editar tarefas
- [x] Atualizar status: pendente / em andamento / concluída
- [x] Adicionar etiquetas (tags)
- [ ] Anexar arquivos (imagens ou documentos)

---

### 🧾 Visualizações

- [x] Lista detalhada de tarefas
- [x] Visualização Kanban 
- [x] Filtros por status, data, responsável
- [ ]drag & drop (React DnD)
- [ ] Busca por título da tarefa

---

### 👥 Colaboração

- [ ] Comentários com `@menção`
- [ ] Histórico de atividades por tarefa
- [x] Atribuição de tarefas a membros
- [ ] Notificações para menções e alterações

---

### 🧩 Equipes e Quadros

- [ ] Criar e editar equipes
- [ ] Criar quadros por equipe
- [ ] Gerenciar permissões (admin/editor/leitor)
- [ ] Notificação ao ser adicionado a uma equipe
- [ ] Visão geral da equipe e quadros

---

### 🔔 Notificações

- [x] Atualizações em tempo real (Firestore)
- [x] Alertas para tarefas vencidas
- [ ] Notificação ao ser mencionado ou atribuído

---

## 📦 MVP (Produto Mínimo Viável)

> ✅ Estas são as **funcionalidades mínimas** que precisam estar prontas para validação e entrega:

- [x] Autenticação (login, cadastro, logout)
- [x] Dashboard de projetos
- [x] Criar e visualizar projeto
- [x] Criar e visualizar tarefas
- [x] Atualizar status de tarefas
- [x] Atribuição de membros
- [x] Sincronização em tempo real (Firestore)
- [ ] Comentários básicos

---

## 📊 Checklist Final de Entrega

### ✅ Funcionalidades principais

- [x] Autenticação com Firebase
- [x] CRUD de projetos
- [x] CRUD de tarefas
- [x] Visualização em Kanban
- [x] Atribuição de responsáveis
- [x] Persistência em tempo real
- [ ] Drag & Drop
- [ ] Comentários em tarefas

### 🧪 Funcionalidades avançadas (opcionais)

- [x] Filtros e busca
- [x] Etiquetas em tarefas
- [ ] Estatísticas por projeto
- [ ] Histórico de atividades

---

## 🧪 Testes Manuais

- [x] Criar e logar com conta de usuário
- [x] Criar projeto e adicionar tarefas
- [x] Atualizar status das tarefas
- [x] Atribuir tarefas a outros usuários
- [x] Visualizar alterações em tempo real
- [ ] Ver comentários sendo salvos

---

## 🛠️ Como Rodar Localmente

```bash
# Instale as dependências
pnpm install

# Crie o arquivo .env.local e adicione as credenciais do Firebase

# Rode o projeto
pnpm dev
