<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# Coin4Students 🪙

<table>
  <tr>
    <td width="650px">
      <div align="justify">
        O <b>Coin4Students</b> é um sistema desenvolvido para promover o reconhecimento do mérito estudantil por meio de uma moeda virtual. A proposta é incentivar o engajamento, a participação e o bom desempenho acadêmico, permitindo que professores distribuam moedas aos alunos como forma de recompensa. Essas moedas podem ser acumuladas e posteriormente trocadas por benefícios oferecidos por empresas parceiras, como descontos, produtos ou serviços.
        <br><br>
        O sistema contempla diferentes perfis de usuários: alunos, professores e empresas, cada um com funcionalidades específicas, incluindo cadastro, autenticação, consulta de saldo e gerenciamento de transações. Além disso, o sistema realiza notificações por e-mail para manter os usuários informados sobre recebimento e utilização das moedas.
        <br><br>
      </div>
    </td>
    <td>
      <div>
        <img 
          src="Coin4Students.png" 
          alt="Logo do Projeto"
          height="180"
        />
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)]()
[![Versão](https://img.shields.io/badge/Versão-v1.0.0-6A5ACD)]()
[![Licença](https://img.shields.io/badge/Licença-MIT-green)](#-licença)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql&logoColor=white)]()
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=black)]()
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)]()

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicativo Mobile](#-aplicativo-mobile)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (para Back-end, API, CLI)](#-exemplo-de-saída-no-terminal-para-back-end-api-cli)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web](<link-da-demo-web>)
  > 💻 **Descrição:** Link para a aplicação em ambiente de produção (Ex: hospedado na Vercel, Netlify ou AWS S3).
* 📱 **Download Mobile:** [App Store](<link-app-store>) | [Google Play](<link-google-play>) | [APK Direto](<link-para-apk-direto>)
  > 📱 **Descrição:** Links diretos para download nas lojas de aplicativos (se aplicável) e para o arquivo de instalação direta no Android (APK).
* 📖 **Documentação:** [Leia a Wiki/Docs](<link-para-docs>)
  > 📚 **Descrição:** Acesso à documentação técnica completa do projeto (Ex: Swagger/OpenAPI para API, ou Wiki interna).

---

## 📝 Sobre o Projeto
O **Coin4Students** é uma plataforma acadêmica desenvolvida com o objetivo de incentivar e reconhecer o desempenho estudantil por meio de um sistema de moedas virtuais. A proposta surgiu da necessidade de criar uma forma mais dinâmica, motivadora e interativa de estimular a participação dos alunos em atividades acadêmicas, projetos e ações educacionais.

O sistema funciona permitindo que professores distribuam moedas virtuais para alunos como forma de recompensa por mérito acadêmico, participação em sala, desempenho em atividades ou colaboração em projetos. Essas moedas podem ser acumuladas e posteriormente trocadas por benefícios oferecidos por empresas parceiras cadastradas na plataforma, como descontos, produtos ou serviços.

O projeto foi desenvolvido no contexto acadêmico da disciplina de Laboratório de Desenvolvimento de Software, do curso de Engenharia de Software da PUC Minas, envolvendo conceitos de arquitetura de software, APIs REST, microsserviços, persistência de dados, deploy em nuvem e integração entre front-end e back-end.

Atualmente, o sistema conta com serviços independentes para gerenciamento de alunos, professores, empresas parceiras, transações e vantagens, utilizando arquitetura baseada em microsserviços com Spring Boot, PostgreSQL (Supabase), RabbitMQ/CloudAMQP e deploy em nuvem via Render. Além disso, a aplicação possui integração completa entre interface web, APIs REST, mensageria assíncrona e banco de dados relacional.

O Coin4Students busca entregar valor tanto para instituições de ensino quanto para estudantes, promovendo engajamento, reconhecimento acadêmico e aproximação entre universidades e empresas parceiras. O projeto também serve como experiência prática no desenvolvimento de aplicações modernas escaláveis e distribuídas.


---

## ✨ Funcionalidades Principais

- 🔐 **Cadastro de Usuários:** Permite o cadastro de alunos e empresas parceiras na plataforma.

- 👨‍🎓 **Gerenciamento de Alunos:** CRUD completo para cadastro, edição, consulta e remoção de alunos.

- 🏢 **Gerenciamento de Empresas Parceiras:** CRUD completo para gerenciamento das empresas participantes do sistema.

- 👨‍🏫 **Gerenciamento de Professores:** Cadastro, autenticação, consulta, edição e remoção de professores.

- 💰 **Sistema de Moedas Virtuais:** Controle de saldo de moedas acadêmicas dos alunos.

- 📨 **Envio de Moedas por Professores:** Professores podem distribuir moedas para alunos com mensagem de reconhecimento.

- 🧾 **Histórico e Extrato:** Registro de transações por aluno e por professor.

- 🎁 **Troca de Benefícios:** Possibilidade de utilização das moedas em vantagens oferecidas por empresas parceiras.

- 🎟️ **Cupons e QR Code:** Resgates geram cupons com código único e QR Code para validação.

- 📧 **Notificações por E-mail:** Envio automático de e-mails para alunos e professores usando Brevo.

- 📬 **Mensageria com RabbitMQ:** Comunicação assíncrona entre serviços para registro de transações.

- 🌐 **Arquitetura em Microsserviços:** Separação dos serviços de alunos e empresas para maior escalabilidade e organização.

- 🔄 **Integração Front-end + Back-end:** Comunicação completa entre interface web e APIs REST.

- ☁️ **Deploy em Nuvem:** Serviços hospedados no Render com banco PostgreSQL no Supabase.

- 🗄️ **Persistência de Dados:** Armazenamento seguro das informações utilizando PostgreSQL.

- 🧪 **Testes de API:** Endpoints validados utilizando Postman.

- 🐳 **Containerização com Docker:** Estrutura preparada para deploy e execução isolada dos serviços.

- 📡 **APIs RESTful:** Endpoints padronizados para comunicação entre os serviços.

- 🔒 **Configuração de CORS:** Integração segura entre front-end e back-end hospedados separadamente.

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizadas na construção do projeto **Coin4Students**.

### 💻 Front-end

* **Linguagens:** HTML5, CSS3 e JavaScript
* **Estilização:** CSS3
* **Comunicação HTTP:** Fetch API
* **Build Tool:** Estrutura web simples (sem framework SPA)

---

### 🖥️ Back-end

* **Linguagem/Runtime:** Java 21 (JDK)
* **Framework:** Spring Boot 4.0.6
* **Banco de Dados:** PostgreSQL
* **ORM:** Spring Data JPA / Hibernate
* **Gerenciador de Dependências:** Maven
* **API:** RESTful API
* **Servidor Web:** Apache Tomcat Embedded
* **Mensageria:** RabbitMQ / CloudAMQP
* **E-mails Transacionais:** Brevo
* **Geração de QR Code:** ZXing

---

### 🗄️ Banco de Dados

* **Plataforma:** Supabase
* **SGBD:** PostgreSQL
* **Persistência:** Hibernate/JPA

---

### ⚙️ Infraestrutura & DevOps

* **Containerização:** Docker
* **Deploy Back-end:** Render
* **Banco em Nuvem:** Supabase
* **Mensageria em Nuvem:** CloudAMQP
* **Versionamento:** Git e GitHub
* **Testes de API:** Postman

---

### 🧰 Ferramentas de Desenvolvimento

* **IDE:** Visual Studio Code
* **Gerenciamento de Projeto:** GitHub Projects
* **Documentação:** Markdown
* **Modelagem:** PlantUML e Mermaid

---

## 🏗 Arquitetura

O **Coin4Students** utiliza uma arquitetura baseada em **microsserviços**, separando responsabilidades principais do sistema em serviços independentes. Essa abordagem foi escolhida para facilitar a organização do código, permitir evolução gradual do sistema e tornar os módulos mais independentes entre si.

Atualmente, a aplicação está dividida em:

- **Front-end:** interface web responsável pela interação com o usuário.
- **Aluno Service:** microsserviço responsável pelo CRUD de alunos.
- **Professor Service:** microsserviço responsável pelo CRUD de professores e envio de moedas.
- **Empresa Service:** microsserviço responsável pelo CRUD de empresas parceiras.
- **Transação Service:** microsserviço responsável pelo registro e consulta de transações.
- **Vantagem Service:** microsserviço responsável pelo cadastro de vantagens, resgates, cupons e QR Codes.
- **RabbitMQ/CloudAMQP:** broker de mensagens utilizado na comunicação assíncrona entre serviços, com a fila `fila.envio.moedas`.
- **Brevo:** serviço externo utilizado para envio de e-mails transacionais.
- **Banco de Dados:** PostgreSQL hospedado no Supabase.
- **Deploy:** microsserviços hospedados no Render com Docker.

Cada microsserviço segue uma arquitetura em camadas:

- **Controller:** recebe as requisições HTTP e expõe os endpoints REST.
- **Service:** concentra a lógica de negócio da aplicação.
- **Repository:** realiza a comunicação com o banco utilizando Spring Data JPA.
- **Model:** representa as entidades persistidas no banco de dados.

---

### 🔄 Fluxo da Aplicação

```txt
Usuário
   ↓
Front-end (HTML/CSS/JS)
   ↓ HTTP/REST + JSON
Microsserviços Spring Boot
   ↓ HTTP/REST + RabbitMQ
Transações, e-mails, cupons e QR Codes
   ↓ Hibernate/JPA
PostgreSQL (Supabase)
```

---

### 🧩 Componentes Principais

| Componente | Responsabilidade |
|---|---|
| Front-end | Interface visual e interação com o usuário |
| Aluno Service | Gerenciamento de alunos |
| Professor Service | Gerenciamento de professores e distribuição de moedas |
| Empresa Service | Gerenciamento de empresas |
| Transação Service | Registro de transações e extratos |
| Vantagem Service | Gerenciamento de vantagens, resgates, cupons e QR Codes |
| RabbitMQ/CloudAMQP | Fila `fila.envio.moedas` para comunicação assíncrona |
| Brevo | Envio de e-mails transacionais |
| PostgreSQL | Persistência de dados |
| Supabase | Hospedagem do banco PostgreSQL |
| Render | Deploy e execução dos microsserviços |
| Docker | Containerização da aplicação |

---

### 🏛️ Padrões Arquiteturais Utilizados

- Microsserviços
- REST API
- MVC (Model-View-Controller)
- Repository Pattern
- Service Layer
- Mensageria assíncrona com RabbitMQ
- Containerização com Docker

---

### ⚙️ Tecnologias por Camada

| Camada | Tecnologias |
|---|---|
| Front-end | HTML5, CSS3, JavaScript |
| Back-end | Java 21, Spring Boot |
| Persistência | Spring Data JPA, Hibernate |
| Banco de Dados | PostgreSQL |
| Mensageria | RabbitMQ, CloudAMQP |
| E-mail | Brevo |
| QR Code | ZXing |
| Cloud/Deploy | Render, Supabase e CloudAMQP |
| DevOps | Docker e GitHub |

---

### 📌 Decisões Arquiteturais

A escolha da arquitetura baseada em microsserviços permite:

- Separação de responsabilidades;
- Maior organização do código;
- Facilidade de manutenção;
- Escalabilidade futura;
- Deploy independente dos serviços;
- Melhor modularização do sistema.

Além disso, o uso do Supabase resolveu a limitação do banco gratuito do Render, garantindo maior estabilidade para o projeto acadêmico.

---

### ⚠️ Trade-offs e Limitações

- Maior complexidade de configuração em relação a um monólito simples;
- Necessidade de configuração de CORS entre front-end e back-end;
- Deploy separado para cada microsserviço;
- Dependência de serviços externos gratuitos (Render, Supabase, CloudAMQP e Brevo).

---

## 📊 Diagramas do Projeto

### 📌 Diagrama de Classes

![Diagrama de Classes](https://github.com/IsabellaLDias/Coin4Students/blob/main/Diagramas/DiagramaDeClasses.png?raw=true)

---

### 📌 Diagrama de Casos de Uso

![Diagrama de Casos de Uso](https://github.com/IsabellaLDias/Coin4Students/blob/main/Diagramas/DiagramaDeCasosDeUso.png?raw=true)

---

### 📌 Diagrama de Componentes

![Diagrama de Componentes](https://github.com/IsabellaLDias/Coin4Students/blob/main/Diagramas/DiagramaDeComponentes.png?raw=true)

---

### 📌 Modelo Entidade-Relacionamento (ER)

![Modelo ER](https://github.com/IsabellaLDias/Coin4Students/blob/main/Diagramas/Modelo%20ER.png?raw=true)

---

## 🔧 Instalação e Execução

### 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de possuir os seguintes requisitos instalados na máquina:

* **Java JDK:** Versão **21** ou superior  
  > Necessário para execução dos microsserviços Spring Boot.

* **Apache Maven:** Versão **3.9+**
  > Utilizado para gerenciamento de dependências e build do projeto.

* **Git**
  > Necessário para clonar o repositório.

* **Docker Desktop** (Opcional)
  > Utilizado para containerização e deploy local.

* **RabbitMQ ou conta CloudAMQP** (Opcional para execução local completa)
  > Necessário para testar a comunicação assíncrona entre os serviços de professores e transações.

* **IDE recomendada:** Visual Studio Code
  > Recomendado para facilitar o desenvolvimento do projeto.

---

### 📥 Clonando o Repositório

```bash
git clone https://github.com/IsabellaLDias/Coin4Students.git
```

---

### 📂 Acesse a pasta do projeto

```bash
cd Coin4Students
```

---

### ⚙️ Configuração do Back-end

Cada microsserviço possui seu próprio arquivo de configuração.

Crie um arquivo:

```txt
application.properties
```

com base no arquivo:

```txt
application-example.properties
```

---

### 🗄️ Configuração do Banco de Dados (Supabase)

Exemplo de configuração:

```properties
spring.datasource.url=jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
spring.datasource.username=postgres.flecjjdbxjmpytnkbfal
spring.datasource.password=SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=${PORT:8080}
```

Para os serviços que utilizam mensageria e e-mail, também configure:

```properties
spring.rabbitmq.host=jackal.rmq.cloudamqp.com
spring.rabbitmq.port=5672
spring.rabbitmq.username=USUARIO_CLOUDAMQP
spring.rabbitmq.password=SENHA_CLOUDAMQP
spring.rabbitmq.virtual-host=VHOST_CLOUDAMQP

brevo.api.key=${BREVO_API_KEY:SUA_CHAVE_BREVO}
brevo.from.email=${BREVO_FROM_EMAIL:email@exemplo.com}
brevo.from.name=${BREVO_FROM_NAME:coin4students}
brevo.logo.url=${BREVO_LOGO_URL:}
app.public.url=${APP_PUBLIC_URL:https://vantagem-service.onrender.com}
```

---

### ▶️ Executando o Aluno Service

```bash
cd back/aluno-service
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8080
```

---

### ▶️ Executando o Empresa Service

```bash
cd back/empresa-service
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8081
```

---

### ▶️ Executando o Professor Service

```bash
cd back/professor-service
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8082
```

---

### ▶️ Executando o Transação Service

```bash
cd back/transacao-service
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8083
```

---

### ▶️ Executando o Vantagem Service

```bash
cd back/vantagem-service
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8084
```

---

### 🌐 Executando o Front-end

Abra o arquivo HTML principal do projeto:

```txt
home.html
```

ou utilize uma extensão como:

- Live Server (VSCode)

---

### 🧪 Testando a Aplicação

Os endpoints podem ser testados utilizando:

- Postman
- Navegador
- Front-end integrado

---

### ☁️ Deploy

O sistema atualmente utiliza:

| Serviço | Plataforma |
|---|---|
| Microsserviços | Render |
| Banco de Dados | Supabase |
| Mensageria | CloudAMQP |
| E-mails Transacionais | Brevo |
| Containerização | Docker |

---

### 🔗 Endpoints Públicos

#### 👨‍🎓 Aluno Service

```txt
https://aluno-service-orux.onrender.com/alunos
```

#### 👨‍🏫 Professor Service

```txt
https://professor-service-0rvu.onrender.com/professores
```

#### 🏢 Empresa Service

```txt
https://empresa-service.onrender.com/empresas
```

#### 🧾 Transação Service

```txt
https://transacao-service.onrender.com/transacoes
```

#### 🎁 Vantagem Service

```txt
https://vantagem-service.onrender.com/vantagens
```


---

### 🔑 Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração dos microsserviços e conexão com o banco de dados PostgreSQL hospedado no Supabase.

---

## 🖥️ Back-end (Spring Boot)

As variáveis podem ser configuradas:

- diretamente no arquivo `application.properties`
- ou nas variáveis de ambiente do Render

---

### 📌 Variáveis Utilizadas

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta utilizada pelo Render | `8080` |
| `SPRING_DATASOURCE_URL` | URL JDBC do PostgreSQL no Supabase | `jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco PostgreSQL | `postgres.flecjjdbxjmpytnkbfal` |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco PostgreSQL | `SUA_SENHA_AQUI` |
| `SPRING_RABBITMQ_HOST` | Host do RabbitMQ/CloudAMQP | `jackal.rmq.cloudamqp.com` |
| `SPRING_RABBITMQ_PORT` | Porta do RabbitMQ | `5672` |
| `SPRING_RABBITMQ_USERNAME` | Usuário do RabbitMQ/CloudAMQP | `USUARIO_CLOUDAMQP` |
| `SPRING_RABBITMQ_PASSWORD` | Senha do RabbitMQ/CloudAMQP | `SENHA_CLOUDAMQP` |
| `SPRING_RABBITMQ_VIRTUAL_HOST` | Virtual host do CloudAMQP | `VHOST_CLOUDAMQP` |
| `BREVO_API_KEY` | Chave da API Brevo para envio de e-mails | `SUA_CHAVE_BREVO` |
| `BREVO_FROM_EMAIL` | E-mail remetente dos e-mails automáticos | `email@exemplo.com` |
| `BREVO_FROM_NAME` | Nome do remetente dos e-mails automáticos | `coin4students` |
| `BREVO_LOGO_URL` | URL pública opcional do logo usado nos e-mails | `https://.../logo.png` |
| `APP_PUBLIC_URL` | URL pública do serviço de vantagens para exibir QR Code no e-mail | `https://vantagem-service.onrender.com` |

---

### 📄 Exemplo (`application.properties`)

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=${PORT:8080}
```

---

## 🌐 Front-end

O front-end realiza comunicação direta com os microsserviços hospedados no Render.

Atualmente, as URLs das APIs estão configuradas diretamente no JavaScript utilizando `fetch`.

---

### 📌 Endpoints Utilizados

| Serviço | URL |
| :--- | :--- |
| Aluno Service | `https://aluno-service-orux.onrender.com/alunos` |
| Professor Service | `https://professor-service-0rvu.onrender.com/professores` |
| Empresa Service | `https://empresa-service.onrender.com/empresas` |
| Transação Service | `https://transacao-service.onrender.com/transacoes` |
| Vantagem Service | `https://vantagem-service.onrender.com/vantagens` |

---

### 📄 Exemplo no JavaScript

```javascript
await fetch("https://aluno-service-orux.onrender.com/alunos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(aluno)
});
```

---

## ☁️ Variáveis no Render

As seguintes variáveis devem ser configuradas em cada Web Service no Render:

| Variável | Valor |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | URL JDBC do Supabase |
| `SPRING_DATASOURCE_USERNAME` | Usuário PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | Senha PostgreSQL |
| `SPRING_RABBITMQ_HOST` | Host CloudAMQP |
| `SPRING_RABBITMQ_PORT` | `5672` |
| `SPRING_RABBITMQ_USERNAME` | Usuário CloudAMQP |
| `SPRING_RABBITMQ_PASSWORD` | Senha CloudAMQP |
| `SPRING_RABBITMQ_VIRTUAL_HOST` | Virtual host CloudAMQP |
| `BREVO_API_KEY` | Chave da API Brevo |
| `BREVO_FROM_EMAIL` | E-mail remetente |
| `BREVO_FROM_NAME` | Nome do remetente |
| `BREVO_LOGO_URL` | URL opcional do logo |
| `APP_PUBLIC_URL` | URL pública do vantagem-service |
| `PORT` | `8080` |

---

## 📦 Instalação de Dependências

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/IsabellaLDias/Coin4Students.git
cd Coin4Students
```

---

### 2️⃣ Back-end (Spring Boot)

#### ▶️ Aluno Service

```bash
cd back/aluno-service
mvn clean install
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8080
```

---

#### ▶️ Empresa Service

```bash
cd back/empresa-service
mvn clean install
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8081
```

---

#### ▶️ Professor Service

```bash
cd back/professor-service
mvn clean install
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8082
```

---

#### ▶️ Transação Service

```bash
cd back/transacao-service
mvn clean install
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8083
```

---

#### ▶️ Vantagem Service

```bash
cd back/vantagem-service
mvn clean install
mvn spring-boot:run
```

O serviço ficará disponível em:

```txt
http://localhost:8084
```

---

### 3️⃣ Front-end

O front-end é composto por HTML, CSS e JavaScript puro.

Para executar:

- abra o arquivo HTML principal diretamente no navegador
- ou utilize uma extensão como Live Server no VSCode

---

## 💾 Banco de Dados PostgreSQL (Supabase)

O projeto utiliza PostgreSQL hospedado no Supabase.

Não é necessário instalar PostgreSQL localmente para utilizar o sistema já configurado em nuvem.

---

## ⚡ Como Executar a Aplicação

A aplicação pode ser executada em três etapas:

### Terminal 1 — Aluno Service

```bash
cd back/aluno-service
mvn spring-boot:run
```

---

### Terminal 2 — Empresa Service

```bash
cd back/empresa-service
mvn spring-boot:run
```

---

### Terminal 3 — Professor Service

```bash
cd back/professor-service
mvn spring-boot:run
```

---

### Terminal 4 — Transação Service

```bash
cd back/transacao-service
mvn spring-boot:run
```

---

### Terminal 5 — Vantagem Service

```bash
cd back/vantagem-service
mvn spring-boot:run
```

---

### Front-end

Abra o HTML principal do projeto no navegador.

---

## 🐳 Execução com Docker

Cada microsserviço possui seu próprio `Dockerfile`.

### Build da imagem

```bash
docker build -t aluno-service .
```

ou

```bash
docker build -t empresa-service .
```

ou

```bash
docker build -t professor-service .
```

ou

```bash
docker build -t transacao-service .
```

ou

```bash
docker build -t vantagem-service .
```

---

### Executar container

```bash
docker run -p 8080:8080 aluno-service
```

---

## ☁️ Deploy

O sistema atualmente utiliza:

| Serviço | Plataforma |
|---|---|
| Microsserviços | Render |
| Banco de Dados | Supabase |
| Mensageria | CloudAMQP |
| E-mails Transacionais | Brevo |
| Containerização | Docker |

---

## 🔗 Endpoints Públicos

### 👨‍🎓 Aluno Service

```txt
https://aluno-service-orux.onrender.com/alunos
```

---

### 🏢 Empresa Service

```txt
https://empresa-service.onrender.com/empresas
```

---

### 👨‍🏫 Professor Service

```txt
https://professor-service-0rvu.onrender.com/professores
```

---

### 🧾 Transação Service

```txt
https://transacao-service.onrender.com/transacoes
```

---

### 🎁 Vantagem Service

```txt
https://vantagem-service.onrender.com/vantagens
```

---

## ⚠️ Segurança

> Nunca envie arquivos contendo senhas reais para o GitHub.

O recomendado é:

- utilizar `application-example.properties`
- adicionar `application.properties` no `.gitignore`
- utilizar variáveis de ambiente no Render

---

## 🚀 Deploy
O deploy dos microsserviços é realizado no **Render**, utilizando **Docker**, enquanto o banco de dados PostgreSQL está hospedado no **Supabase**.

---

### ☁️ Configuração dos Serviços

| Serviço | Root Directory |
|---|---|
| aluno-service | `back/aluno-service` |
| empresa-service | `back/empresa-service` |
| professor-service | `back/professor-service` |
| transacao-service | `back/transacao-service` |
| vantagem-service | `back/vantagem-service` |

---

### 🔑 Variáveis de Ambiente

```txt
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
SPRING_RABBITMQ_HOST
SPRING_RABBITMQ_PORT
SPRING_RABBITMQ_USERNAME
SPRING_RABBITMQ_PASSWORD
SPRING_RABBITMQ_VIRTUAL_HOST
BREVO_API_KEY
BREVO_FROM_EMAIL
BREVO_FROM_NAME
BREVO_LOGO_URL
APP_PUBLIC_URL
```

---

### 🐳 Dockerfile

```dockerfile
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]
```

---

### 🔄 Atualização do Deploy

```bash
git add .
git commit -m "Atualiza aplicação"
git push origin main
```

Depois:

```txt
Render → Manual Deploy → Deploy latest commit
```

---

### 🌐 Endpoints

```txt
https://aluno-service-orux.onrender.com/alunos

https://professor-service-0rvu.onrender.com/professores

https://empresa-service.onrender.com/empresas

https://transacao-service.onrender.com/transacoes

https://vantagem-service.onrender.com/vantagens
```

---

## 📂 Estrutura de Pastas

```
.
├── .git/                        # 📁 Controle de versão Git
├── .github/                     # 🤖 Configurações do GitHub (Actions, templates)
│
├── README.md                    # 📘 Documentação principal do projeto
├── Histórias de Usuário.md      # 📖 Histórias de usuário e requisitos
├── Coin4Students.png            # 🖼️ Logo ou imagem principal do projeto
│
├── /front                       # 📁 Aplicação Frontend (HTML/CSS/JavaScript)
│   ├── home.html                # 🏠 Página inicial/landing page
│   ├── coin4students.html       # 🔐 Página de login/cadastro
│   ├── aluno.html               # 👨‍🎓 Dashboard do aluno
│   ├── professor.html           # 👨‍🏫 Dashboard do professor
│   ├── empresa.html             # 🏢 Dashboard da empresa
│   │
│   ├── /css                     # 📂 Estilos CSS
│   │   ├── home.css             # 🎨 Estilos da página inicial
│   │   ├── coin4students.css    # 🔐 Estilos da página de login/cadastro
│   │   ├── style-aluno.css      # 👨‍🎓 Estilos do dashboard do aluno
│   │   ├── professor.css        # 👨‍🏫 Estilos do dashboard do professor
│   │   └── empresa.css          # 🏢 Estilos do dashboard da empresa
│   │
│   ├── /js                      # 📂 Scripts JavaScript
│   │   ├── coin4students.js     # 🔐 Lógica de login/cadastro
│   │   ├── aluno.js             # 👨‍🎓 Funcionalidades do aluno
│   │   ├── professor.js         # 👨‍🏫 Funcionalidades do professor
│   │   └── empresa.js           # 🏢 Funcionalidades da empresa
│   │
│   └── /img                     # 📂 Recursos de imagem
│       ├── imagem.png           # 🖼️ Imagem de fundo (hero/login)
│       ├── logo.png             # 🏷️ Logo principal
│       └── logo - Copia.png     # 🏷️ Cópia do logo
│
├── /back                        # 📁 Aplicações Backend (Spring Boot)
│   ├── /aluno-service           # 🧑‍🎓 Microserviço de Alunos
│   │   ├── Dockerfile           # 🐳 Docker build do serviço de alunos
│   │   ├── HELP.md              # 📖 Documentação de ajuda
│   │   ├── mvnw                 # 🛠️ Wrapper Maven (Unix)
│   │   ├── mvnw.cmd             # 🛠️ Wrapper Maven (Windows)
│   │   ├── pom.xml              # 📦 Dependências e configuração Maven
│   │   │
│   │   ├── /src                 # 📂 Código-fonte
│   │   │   └── /main
│   │   │       ├── /java        # ☕ Código Java
│   │   │       │   └── /com/coin4students/aluno
│   │   │       │       ├── AlunoServiceApplication.java  # 🚀 Classe principal
│   │   │       │       ├── /config      # ⚙️ Configurações (CORS, etc)
│   │   │       │       │   └── CorsConfig.java
│   │   │       │       ├── /controller  # 🎮 Endpoints REST
│   │   │       │       │   └── AlunoController.java
│   │   │       │       ├── /model       # 🧬 Entidades JPA
│   │   │       │       │   └── Aluno.java
│   │   │       │       ├── /repository  # 🗄️ Repositórios Spring Data
│   │   │       │       │   └── AlunoRepository.java
│   │   │       │       └── /service     # ⚙️ Lógica de negócio
│   │   │       │           └── AlunoService.java
│   │   │       │
│   │   │       └── /resources   # 📂 Recursos da aplicação
│   │   │           ├── application.properties           # ⚙️ Configuração principal
│   │   │           ├── application-example.properties  # 🧩 Exemplo de configuração
│   │   │           ├── /static      # 🌐 Arquivos estáticos
│   │   │           └── /templates   # 🖼️ Templates (se houver)
│   │   │
│   │   └── /test                # 🧪 Testes unitários
│   │       └── /java
│   │           └── /com/coin4students/aluno
│   │               └── AlunoServiceApplicationTests.java
│   │
│   └── /empresa-service         # 🏢 Microserviço de Empresas
│       ├── Dockerfile           # 🐳 Docker build do serviço de empresas
│       ├── HELP.md              # 📖 Documentação de ajuda
│       ├── mvnw                 # 🛠️ Wrapper Maven (Unix)
│       ├── mvnw.cmd             # 🛠️ Wrapper Maven (Windows)
│       ├── pom.xml              # 📦 Dependências e configuração Maven
│       │
│       ├── /src                 # 📂 Código-fonte
│       │   └── /main
│       │       ├── /java        # ☕ Código Java
│       │       │   └── /com/coin4students/empresa
│       │       │       ├── EmpresaServiceApplication.java  # 🚀 Classe principal
│       │       │       ├── /config      # ⚙️ Configurações (CORS, etc)
│       │       │       │   └── CorsConfig.java
│       │       │       ├── /controller  # 🎮 Endpoints REST
│       │       │       │   └── EmpresaController.java
│       │       │       ├── /model       # 🧬 Entidades JPA
│       │       │       │   └── Empresa.java
│       │       │       ├── /repository  # 🗄️ Repositórios Spring Data
│       │       │       │   └── EmpresaRepository.java
│       │       │       └── /service     # ⚙️ Lógica de negócio
│       │       │           └── EmpresaService.java
│       │       │
│       │       └── /resources   # 📂 Recursos da aplicação
│       │           ├── application.properties           # ⚙️ Configuração principal
│       │           ├── application-example.properties  # 🧩 Exemplo de configuração
│       │           ├── /static      # 🌐 Arquivos estáticos
│       │           └── /templates   # 🖼️ Templates (se houver)
│       │
│       └── /test                # 🧪 Testes unitários
│           └── /java
│               └── /com/coin4students/empresa
│                   └── EmpresaServiceApplicationTests.java
│
│   ├── /professor-service       # 👨‍🏫 Microserviço de Professores
│   │   ├── Dockerfile           # 🐳 Docker build do serviço de professores
│   │   ├── mvnw                 # 🛠️ Wrapper Maven (Unix)
│   │   ├── mvnw.cmd             # 🛠️ Wrapper Maven (Windows)
│   │   ├── pom.xml              # 📦 Dependências e configuração Maven
│   │   └── /src/main/java/com/coin4students/professor
│   │       ├── /config          # ⚙️ Configurações de RabbitMQ/Jackson
│   │       ├── /controller      # 🎮 Endpoints REST
│   │       ├── /dto             # 📦 Objetos de transferência
│   │       ├── /model           # 🧬 Entidades JPA
│   │       ├── /repository      # 🗄️ Repositórios Spring Data
│   │       └── /service         # ⚙️ Lógica de envio de moedas
│   │
│   ├── /transacao-service       # 🧾 Microserviço de Transações
│   │   ├── Dockerfile           # 🐳 Docker build do serviço de transações
│   │   ├── mvnw                 # 🛠️ Wrapper Maven (Unix)
│   │   ├── mvnw.cmd             # 🛠️ Wrapper Maven (Windows)
│   │   ├── pom.xml              # 📦 Dependências e configuração Maven
│   │   └── /src/main/java/com/coin4students/transacao
│   │       ├── /config          # ⚙️ Configurações de RabbitMQ/Jackson
│   │       ├── /consumer        # 📬 Consumo de eventos de envio de moedas
│   │       ├── /controller      # 🎮 Endpoints REST
│   │       ├── /dto             # 📦 Objetos de transferência
│   │       ├── /model           # 🧬 Entidades JPA
│   │       ├── /repository      # 🗄️ Repositórios Spring Data
│   │       └── /service         # ⚙️ Registro de transações e e-mails
│   │
│   ├── /vantagem-service        # 🎁 Microserviço de Vantagens
│   │   ├── Dockerfile           # 🐳 Docker build do serviço de vantagens
│   │   ├── mvnw                 # 🛠️ Wrapper Maven (Unix)
│   │   ├── mvnw.cmd             # 🛠️ Wrapper Maven (Windows)
│   │   ├── pom.xml              # 📦 Dependências, Brevo e ZXing
│   │   └── /src/main/java/com/coin4students/vantagem
│   │       ├── /config          # ⚙️ Configurações de banco
│   │       ├── /controller      # 🎮 Endpoints REST
│   │       ├── /dto             # 📦 Dados de resgate
│   │       ├── /model           # 🧬 Vantagens e cupons
│   │       ├── /repository      # 🗄️ Repositórios Spring Data
│   │       └── /service         # ⚙️ Resgates, QR Code e e-mails de cupom
│
└── /diagramas                   # 📊 Diagramas e documentação técnica
    ├── DiagramaDeCasosDeUso.png # 📋 Diagrama de Casos de Uso
    ├── DiagramaDeClasses.png    # 🏗️ Diagrama de Classes
    ├── DiagramaDeComponentes.png # 🔧 Diagrama de Componentes
    ├── Modelo ER.png            # 🗃️ Modelo Entidade-Relacionamento
    └── test.md                  # 📄 Arquivo de teste/observações
```

---

## 🎥 Demonstração

Use GIFs e prints para mostrar o projeto em ação.  

> [!WARNING]
> Dê preferência a hospedar suas imagens em um **CDN** (Content Delivery Network) ou no **GitHub Pages** para garantir que elas carreguem rapidamente e não quebrem. Saiba mais sobre o GitHub Pages clicando [aqui](https://github.com/joaopauloaramuni/joaopauloaramuni.github.io).

### 📱 Aplicativo Mobile

- GIF de demonstração (exemplo de fluxo de usuário):  

| Demonstração 1 | Demonstração 2 | Demonstração 3 | Demonstração 4 |
|----------------|----------------|----------------|----------------|
| <img src="https://joaopauloaramuni.github.io/image/fundo_mobile_engsoft.jpeg" alt="Demonstração 1" height="400"> | <img src="https://joaopauloaramuni.github.io/image/fundo_mobile_engsoft.jpeg" alt="Demonstração 2" height="400"> | <img src="https://joaopauloaramuni.github.io/image/fundo_mobile_engsoft.jpeg" alt="Demonstração 3" height="400"> | <img src="https://joaopauloaramuni.github.io/image/fundo_mobile_engsoft.jpeg" alt="Demonstração 4" height="400"> |
| _Sua gif aqui_ | _Sua gif aqui_ | _Sua gif aqui_ | _Sua gif aqui_ |

Para melhor visualização, as telas principais estão organizadas lado a lado.

| Tela | Captura de Tela |
| :---: | :---: |
| **Tela Inicial (Home)** | **Tela de Perfil / Settings** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela 1 do Mobile" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela 2 do Mobile" width="120px" height="120px"> |
| **Tela de Cadastro** | **Tela de Lista / Detalhes** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela 3 do Mobile" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela 4 do Mobile" width="120px" height="120px"> |

### 🌐 Aplicação Web

Para melhor visualização, as telas principais estão organizadas lado a lado.

| Tela | Captura de Tela |
| :---: | :---: |
| **Página Inicial (Home)** | **Página de Login** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela Inicial da Aplicação Web" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela de Login" width="120px" height="120px"> |
| **Cadastro de Clientes** | **Cadastro de Produtos** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela de Cadastro de Clientes" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela de Cadastro de Produtos" width="120px" height="120px"> |
| **Dashboard (Visão Geral)** | **Página Admin / Configurações** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela de Dashboard" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Tela Administrativa" width="120px" height="120px"> |

### 💻 Exemplo de Saída no Terminal (para Back-end, API, CLI)

Caso o projeto seja focado em serviços de Back-end (API, microserviço, CLI), utilize esta seção para demonstrar a interação com o sistema e a resposta esperada.

#### 1. Demonstração da API (Exemplo com cURL)

Mostra uma chamada simples para um endpoint da API (ex: GET de listagem).

```bash
# Chama o endpoint de listagem de usuários com o token de autenticação
curl -X GET 'http://localhost:3000/api/v1/users' \
     -H 'Authorization: Bearer <seu-jwt-token>'
```

**Saída Esperada:**
```json
{
  "total": 2,
  "users": [
    {
      "id": "1a2b3c",
      "name": "Prof. Aramuni",
      "email": "contato@exemplo.com",
      "status": "active"
    },
    {
      "id": "4d5e6f",
      "name": "Colaborador Teste",
      "email": "teste@exemplo.com",
      "status": "inactive"
    }
  ]
}
```

---

#### 2. Demonstração de Execução de CLI/Script

Mostra como executar uma ferramenta de linha de comando ou um script de manutenção do projeto (ex: rodar migrações ou um job agendado).

```bash
# Executa a ferramenta de validação de Schema
npm run cli validate:schema --target=production
```

**Saída Esperada:**
```text
[INFO] Iniciando validação do banco de dados...
[SUCCESS] 15/15 tabelas verificadas.
[WARNING] Coluna 'descricao' na tabela 'produtos' é nullable.
[SUCCESS] Validação concluída. Nenhum erro crítico encontrado.
Tempo de execução: 1.25s
```

---

## 🧪 Testes

### Testes Unitários e de Integração
Para rodar os testes da unidade e integração:

```
npm run test
```
*Ferramenta utilizada: Jest, Vitest, Mocha, etc.*

### Testes End-to-End (E2E)
Para rodar os testes de ponta a ponta (E2E):

```
npm run test:e2e
```
*Ferramenta utilizada: Cypress, Playwright, Selenium, etc.*

---

## 🔗 Documentações utilizadas

* 📖 **Spring Boot:** https://docs.spring.io/spring-boot/documentation.html

* 📖 **Spring Data JPA:** https://spring.io/projects/spring-data-jpa

* 📖 **Hibernate ORM:** https://hibernate.org/orm/documentation/

* 📖 **PostgreSQL:** https://www.postgresql.org/docs/

* 📖 **Supabase:** https://supabase.com/docs

* 📖 **Render:** https://render.com/docs

* 📖 **RabbitMQ:** https://www.rabbitmq.com/documentation.html

* 📖 **CloudAMQP:** https://www.cloudamqp.com/docs/

* 📖 **Brevo:** https://developers.brevo.com/

* 📖 **ZXing:** https://github.com/zxing/zxing

* 📖 **Docker:** https://docs.docker.com/

* 📖 **Maven:** https://maven.apache.org/guides/

* 📖 **GitHub Docs:** https://docs.github.com/

* 📖 **Postman:** https://learning.postman.com/docs/getting-started/introduction/

* 📖 **HTML, CSS e JavaScript (MDN):** https://developer.mozilla.org/

* 📖 **PlantUML:** https://plantuml.com/

* 📖 **Mermaid:** https://mermaid.js.org/

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Isabella Luiza Dias dos Santos  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/1733095978637.jpg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/IsabellaLDias"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/isabella-dias-s/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="isabellamg2017@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Sofia Vasconcelos Moreira e Silva  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/imagemSo.jpeg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/sofiavasconcelosms"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/sofia-vasconcelos-a360b7327/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="sofiavasconcelosmsilva@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Maria Clara Gomes Silva de Oliveira  | <div align="center"><img src="https://github.com/IsabellaLDias/Portfolio-das-Meninas/blob/main/images/EUEUEUEU.jpg?raw=true" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/mariaoliveira27"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/maria-clara-gomes-01b64b16a/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mariaclariagomes@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1.  Faça um `fork` do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4.  Faça o `push` para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

Gostaria de agradecer aos seguintes canais e pessoas que foram fundamentais para o desenvolvimento deste projeto:

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos valiosos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto**.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/blob/main/LICENSE)**.

---
