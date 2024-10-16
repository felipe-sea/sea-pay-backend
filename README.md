# Documentação da API SeaPay

Esta API foi construída como objeto de estudo para uma aplicação educacional de testes da empresa <a href="https://www.linkedin.com/company/seasolutions/">Sea Solutions</a>, simulando um sistema de transferências de valores entre contas.

### Links úteis

- <a href="https://www.figma.com/community/file/1373793671165452982/seapay">Protótipo</a>
- <a href="https://www.usebruno.com/downloads">API Client - Bruno</a>
- <a href="https://www.docker.com/">Docker</a>
- <a href="https://nodejs.org/en/download/package-manager">Node</a>
- <a href="https://nestjs.com/">NestJS</a>

### Pré-requisitos

- Docker - utilizamos o docker para instanciar um banco de dados PostgreSQL.
- Node 20 - por se tratar de uma API construída em Node utilizando o NestJs, é necessário ter a versão 20.x.x instalada na sua máquina.
- Bruno - Bruno é um API client opensource que utilizamos em alguns de nossos projetos, principalmente por conta da possibilidade de versionarmos as collections dentro do próprio código.
- npm - tenha o npm em sua versão mais atualizada.

### Utilizando o Bruno

Antes de fazer qualquer requisição pelo Bruno, você precisa selecionar o environment "Development".

### Iniciando a aplicação pelo Docker

A aplicação está dockerizada, então basta executar o comando abaixo e tudo estará funcionando perfeitamente.

```
docker-compose up -d
```

### Iniciando a aplicação pelo terminal

#### Instalando as dependências

Por padrão, utilizamos o comando npm para instalar todas as dependências do projeto.

```
npm install
```

#### Iniciando o container Docker

Vamos iniciar o container e dentro dele o banco de dados. Você pode alterar livremente as informações do banco dentro do arquivo docker-compose.yml, lembrando sempre de alterar também no arquivo .env, que detém a configuração da URL do banco a ser conectado.

```
docker-compose up -d db
```

ou

```
npm run database:start
```

#### Criando o seu arquivo .env

Dentro deste arquivo, vamos criar a variável que contém a url do banco de dados. Então, na raiz do projeto, crie o arquivo nomeado .env, dentro dele você irá instanciar DATABASE_URL.
Caso esteja usando as configurações padrão que definimos no arquivo docker-compose.yml, seu arquivo .env ficará assim:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/sea_pay?schema=public"
```

A composição da url é a seguinte: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`.

#### Criando as tabelas do banco de dados

Com o banco de dados rodando no container, precisamos criar as nossas tabelas, com um simples comando:

```
npx prisma migrate deploy
```

ou

```
npm run migrate
```

#### Startando a aplicação

Por fim, basta rodar o comando para iniciar a aplicação.

```
npm run start:dev
```
