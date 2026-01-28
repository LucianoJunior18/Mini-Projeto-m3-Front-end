# 🚀 TaskFlow – Gerenciador de Tarefas (Fullstack)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-blue?style=for-the-badge&logo=express)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)

> Aplicação **Fullstack** para gerenciamento de tarefas, desenvolvida como projeto final dos módulos de **Frontend** e **Backend** do programa **Programadores do Amanhã (PdA)**.

---

## 📋 Sobre o Projeto

O **TaskFlow** é uma aplicação completa de gerenciamento de tarefas que integra um **Frontend moderno e responsivo** com um **Backend RESTful**, permitindo ao usuário criar, visualizar, atualizar e remover tarefas de forma simples e eficiente.

O projeto foi desenvolvido com foco em boas práticas, organização de código, integração entre camadas e experiência do usuário.

---

## ✨ Funcionalidades

- ✅ Criar tarefas com título e descrição  
- 📋 Listar todas as tarefas  
- ✏️ Atualizar status (pendente, em progresso ou concluída)  
- 🗑️ Excluir tarefas  
- 🔍 Filtrar tarefas por status  
- 🌓 Tema claro/escuro  
- 📱 Layout totalmente responsivo  

---

## 🛠️ Tecnologias Utilizadas

### 🎨 Frontend
- HTML5 Semântico  
- CSS3 (Flexbox, Grid e variáveis CSS)  
- JavaScript ES6+  
- Fetch API  
- Manipulação do DOM  

### ⚙️ Backend
- Node.js  
- Express.js  
- Sequelize ORM  
- SQLite  
- dotenv  
- Arquitetura MVC + Services  

---

## 🧩 Estrutura do Projeto

### Frontend
```
taskflow-frontend/
├── index.html
├── styles.css
├── app.js
└── README.md
```

### Backend
```
api-to-do-list/
└── src/
    ├── config/
    ├── controllers/
    ├── database/
    ├── migrations/
    ├── models/
    ├── routes/
    ├── services/
    └── server.js
```

---

## 🔌 Integração com API

```javascript
const CONFIG_API = {
  urlBase: 'https://api-to-do-list-a7xp.onrender.com',
  endpoints: {
    tarefas: '/tasks'
  }
};
```

---

## 📚 Endpoints da API

| Método | Endpoint | Descrição |
|------|---------|-----------|
| GET | /tasks | Lista todas as tarefas |
| GET | /tasks/:id | Retorna uma tarefa |
| POST | /tasks | Cria uma nova tarefa |
| PUT | /tasks/:id | Atualiza uma tarefa |
| PATCH | /tasks/:id/status | Atualiza o status |
| DELETE | /tasks/:id | Remove uma tarefa |
| DELETE | /tasks | Remove todas as tarefas |

---

## ⚡ Como Executar

### Backend
```bash
git clone https://github.com/LucianoJunior18/API-to-do-list.git
cd API-to-do-list
npm install
npx sequelize-cli db:migrate
npm run dev
```

Servidor disponível em:
```
http://localhost:3000
```

### Frontend
```bash
git clone https://github.com/LucianoJunior18/taskflow-frontend.git
cd taskflow-frontend
npx serve
```

---

## 🌐 Deploy

- Backend: Render  
- Frontend: Vercel ou GitHub Pages  

---

## 📚 Aprendizados

- Integração Frontend + Backend  
- Criação de API REST  
- ORM com Sequelize  
- Fetch API e Async/Await  
- Responsividade e UX  
- Organização de código e versionamento  

---

## 👤 Autor

**Luciano Junior**  

- GitHub: https://github.com/LucianoJunior18  
- LinkedIn: https://linkedin.com/in/luciano-oliveira-dev  

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!  
**Desenvolvido com 💜 por Luciano Junior**
