# 🚀 MiraTask - Aplicativo de Gerenciamento de Projetos

Aplicação completa de gerenciamento de projetos com **React**, **Next.js** e **Firebase**. Interface intuitiva, colaboração em tempo real e funcionalidades avançadas para organização de equipes e tarefas.

---

## 🧰 Tecnologias Utilizadas

- [x] **React.js**
- [x] **Next.js**
- [x] **TypeScript**
- [x] **TailwindCSS**
- [x] **Firebase** (Auth, Firestore, Storage, Notifications)
- [ ] **Zustand** (gerenciamento de estado)
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
- [ ] Detalhes do projeto (membros, tarefas)
- [ ] Atribuir membros a um projeto

---

### ✅ Tarefas

- [ ] Criar tarefas com título, descrição, status, responsável, datas
- [ ] Editar tarefas
- [ ] Atualizar status: pendente / em andamento / concluída
- [ ] Adicionar etiquetas (tags)
- [ ] Anexar arquivos (imagens ou documentos)

---

### 🧾 Visualizações

- [ ] Lista detalhada de tarefas
- [ ] Visualização Kanban com drag & drop (React DnD)
- [ ] Filtros por status, data, responsável
- [ ] Busca por título da tarefa

---

### 👥 Colaboração

- [ ] Comentários com `@menção`
- [ ] Histórico de atividades por tarefa
- [ ] Atribuição de tarefas a membros
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

- [ ] Atualizações em tempo real (Firestore)
- [ ] Alertas para tarefas vencidas
- [ ] Notificação ao ser mencionado ou atribuído

---

## 📦 MVP (Produto Mínimo Viável)

> ✅ Estas são as **funcionalidades mínimas** que precisam estar prontas para validação e entrega:

- [x] Autenticação (login, cadastro, logout)
- [x] Dashboard de projetos
- [x] Criar e visualizar projeto
- [ ] Criar e visualizar tarefas
- [ ] Atualizar status de tarefas
- [ ] Atribuição de membros
- [ ] Comentários básicos
- [x] Sincronização em tempo real (Firestore)

---

## 📊 Checklist Final de Entrega

### ✅ Funcionalidades principais

- [x] Autenticação com Firebase
- [x] CRUD de projetos
- [ ] CRUD de tarefas
- [ ] Visualização em Kanban
- [ ] Drag & Drop
- [ ] Atribuição de responsáveis
- [ ] Comentários em tarefas
- [x] Persistência em tempo real

### 🧪 Funcionalidades avançadas (opcionais)

- [ ] Filtros e busca
- [ ] Etiquetas em tarefas
- [ ] Estatísticas por projeto
- [ ] Histórico de atividades

---

## 🧪 Testes Manuais

- [x] Criar e logar com conta de usuário
- [ ] Criar projeto e adicionar tarefas
- [ ] Atualizar status das tarefas
- [ ] Atribuir tarefas a outros usuários
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
