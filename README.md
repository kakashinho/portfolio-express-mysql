# 📚 Portfólio Acadêmico – Atividade Avaliativa Individual 04

Este projeto faz parte da atividade avaliativa individual da disciplina **[Nome da Disciplina]**, com o objetivo de praticar desenvolvimento web utilizando **Node.js**, **Express**, **Sequelize**, **MySQL** e o motor de templates **EJS**.

---

## 🎯 Objetivos da Atividade

O projeto consiste na criação de um **Portfólio Acadêmico**, contendo várias páginas dinâmicas renderizadas com EJS, rotas organizadas e integração com banco de dados usando Sequelize.  
Os principais objetivos são:

- Criar e organizar **rotas** no Express  
- Utilizar **EJS** para renderização dinâmica  
- Exibir variáveis, arrays e objetos em páginas HTML  
- Implementar operações **CRUD (GET, POST, PUT, DELETE)**  
- Integrar o projeto com **MySQL** utilizando Sequelize  

---

## 🛠️ Tecnologias Utilizadas

- Node.js  
- Express.js  
- EJS (Embedded JavaScript Templates)  
- Sequelize  
- MySQL  
- Dotenv  

---

## 📁 Estrutura de Rotas

O projeto possui as seguintes rotas principais:

### `/` – Página Inicial  
Exibe uma mensagem de boas-vindas e o nome do estudante.

### `/sobre` – Sobre Mim  
Informações pessoais: nome completo, curso, instituição e ano de ingresso.

### `/disciplinas` – Minhas Disciplinas  
Lista de disciplinas já cursadas ou em andamento.

### `/projetos` – Meus Projetos  
Exibe os projetos acadêmicos com título, descrição e link.

### `/contato` – Contato  
Mostra e-mail e/ou telefone.

### `/dashboard` – Dashboard  
Exibe estatísticas como:
- Total de disciplinas  
- Número de projetos concluídos  
- Tecnologias mais utilizadas  

---

## 🔄 Funcionalidades CRUD

O projeto implementa operações básicas de CRUD:

- **GET** – listar/exibir  
- **POST** – criar  
- **PUT** – atualizar  
- **DELETE** – remover  

Essas rotas podem ser testadas diretamente usando os arquivos `.http` incluídos na pasta **/testes**.

---

## 🧪 Testando as Rotas (REST Client)

Este projeto contém uma pasta chamada **/testes** com arquivos `.http` correspondentes às principais rotas:

- `dashboard.http`  
- `disciplinas.http`  
- `files.http`  
- `inicio.http`  
- `projetos.http`  
- `sobre.http`

Para utilizá-los diretamente no VS Code, **é necessário instalar a extensão:**

### 👉 **REST Client (by Huachao Mao)**  
Com ela, você pode clicar em “Send Request” dentro dos arquivos `.http` para testar qualquer rota sem precisar de Postman ou Insomnia.

---

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/kakashinho/portfolio-express
cd portfolio-express
```

### 2. Crie o arquivo `.env`
```bash
DB_NAME=portfolio
DB_USER=root
DB_PASS=sua_senha
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

### 3. Instale as dependências e execute o projeto
```bash
npm install
npm start
```

O servidor iniciará normalmente na porta 3000:
http://localhost:3000
