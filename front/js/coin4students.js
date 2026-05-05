const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

// --- LÓGICA DE TROCA DE TELAS ---
const secaoCadastro = document.getElementById("secaoCadastro");
const secaoLogin = document.getElementById("secaoLogin");
const btnIrParaLogin = document.getElementById("btnIrParaLogin");
const btnIrParaCadastro = document.getElementById("btnIrParaCadastro");

btnIrParaLogin.onclick = (e) => {
  e.preventDefault();
  secaoCadastro.style.display = "none";
  secaoLogin.style.display = "block";
};

btnIrParaCadastro.onclick = (e) => {
  e.preventDefault();
  secaoLogin.style.display = "none";
  secaoCadastro.style.display = "block";
};

// --- LOGIN INTELIGENTE (ALUNO OU EMPRESA) ---
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    // Busca alunos
    const respAlunos = await fetch(ALUNO_API);
    const alunos = await respAlunos.json();
    const aluno = alunos.find(a => a.email === email && a.senha === senha);

    if (aluno) {
      localStorage.setItem("alunoIdLogado", aluno.id);
      alert(`Bem-vindo, Aluno ${aluno.nome}!`);
      window.location.href = "aluno.html";
      return;
    }

    // Busca empresas
    const respEmpresas = await fetch(EMPRESA_API);
    const empresas = await respEmpresas.json();
    const empresa = empresas.find(e => e.email === email && e.senha === senha);

    if (empresa) {
      localStorage.setItem("empresaIdLogada", empresa.id);
      alert(`Bem-vindo, Empresa ${empresa.nome}!`);
      window.location.href = "empresa.html";
      return;
    }

    alert("E-mail ou senha incorretos.");
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
  }
});




document.getElementById("formAluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: document.getElementById("nomeAluno").value,
    email: document.getElementById("emailAluno").value,
    senha: document.getElementById("senhaAluno").value,
    cpf: document.getElementById("cpfAluno").value,
    rg: document.getElementById("rgAluno").value,
    endereco: document.getElementById("enderecoAluno").value,
    curso: document.getElementById("cursoAluno").value,
    saldoMoedas: 0
  };

  try {
    
    const response = await fetch(ALUNO_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno)
    });

    if (response.ok) {
      
      const alunoCriado = await response.json();

      localStorage.setItem("alunoIdLogado", alunoCriado.id);

      alert("Aluno cadastrado com sucesso!");
      window.location.href = "aluno.html";
    } else {
      alert("Erro ao cadastrar: verifique os dados ou o servidor.");
    }
  } catch (error) {
    console.error("Erro técnico:", error);
    alert("O servidor está desligado ou houve um erro de conexão.");
  }
});

document.getElementById("formEmpresa").addEventListener("submit", async (e) => {
  e.preventDefault();

  const empresa = {
    nome: document.getElementById("nomeEmpresa").value,
    email: document.getElementById("emailEmpresa").value,
    senha: document.getElementById("senhaEmpresa").value,
    cnpj: document.getElementById("cnpjEmpresa").value
  };

  await fetch(EMPRESA_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa)
  });

  alert("Empresa cadastrada com sucesso!");
});
const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
  const header = item.querySelector(".accordion-header");

  header.addEventListener("click", () => {
    item.classList.toggle("active");

    const content = item.querySelector(".accordion-content");

    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = null;
    }
  });
});

