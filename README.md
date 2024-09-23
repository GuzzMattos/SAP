# Configuração do Projeto

Este guia irá orientá-lo pelos passos necessários para configurar e executar o projeto.

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em seu sistema:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

## 1. Clonar o Repositório

Primeiro, clone o repositório para a sua máquina local:

```bash
git clone <url-do-repositorio>
cd <diretorio-do-repositorio>

## 2. Instalar Dependências

npm install


## 3. Configuar o Prisma

npm install prisma --save-dev

## 4. Criar o Banco de Dados

psql -U <seu-usuario> -c "CREATE DATABASE <nome-do-banco>;"

## 5. Configurar Váriáveis de Ambiente

Crie um arquivo .env na raiz do seu projeto (se ainda não existir) e configure a seguinte variável de ambiente para vincular seu banco de dados PostgreSQL:

DATABASE_URL="postgresql://<usuario>:<senha>@localhost:5432/<nome-do-banco>?schema=public"

Substitua <usuario> pelo seu nome de usuário do PostgreSQL.
Substitua <senha> pela sua senha do PostgreSQL.
Substitua <nome-do-banco> pelo nome do banco de dados que você criou anteriormente.

 ## 6. Executar o Servidor de Desenvolvimento

 npm run dev

## 7. Fazer Login na Aplicação

Com o servidor em execução, abra o seu navegador e navegue até o endereço local do servidor (geralmente http://localhost:3000).

Use as seguintes credenciais para fazer login:

Email: teste@gmail.com
Senha: testeteste1



## 8. Notas

Certifique-se de que o serviço do PostgreSQL está em execução antes de iniciar o servidor.
Se você fizer alterações no esquema do Prisma, lembre-se de rodar:

npx prisma migrate dev
