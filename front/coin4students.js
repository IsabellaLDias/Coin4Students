const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

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

document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    const respAlunos = await fetch(ALUNO_API);
    const alunos = await respAlunos.json();
    const aluno = alunos.find(a => a.email === email && a.senha === senha);

    if (aluno) {
      localStorage.setItem("alunoIdLogado", aluno.id);
      showToast(`Bem-vindo, Aluno ${aluno.nome}!`, 'success');
      setTimeout(() => window.location.href = "aluno.html", 1000);
      return;
    }

    // Busca empresas
    const respEmpresas = await fetch(EMPRESA_API);
    const empresas = await respEmpresas.json();
    const empresa = empresas.find(e => e.email === email && e.senha === senha);

    if (empresa) {
      localStorage.setItem("empresaIdLogada", empresa.id);
      showToast(`Bem-vindo, Empresa ${empresa.nome}!`, 'success');
      setTimeout(() => window.location.href = "empresa.html", 1000);
      return;
    }

    showToast("E-mail ou senha incorretos.", 'error');
  } catch (error) {
    showToast("Erro ao conectar com o servidor.", 'error');
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
      showToast("Aluno cadastrado com sucesso!", 'success');
      setTimeout(() => window.location.href = "aluno.html", 1000);
    } else {
      showToast("Erro ao cadastrar: verifique os dados ou o servidor.", 'error');
    }
  } catch (error) {
    console.error("Erro técnico:", error);
    showToast("O servidor está desligado ou houve um erro de conexão.", 'error');
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

  showToast("Empresa cadastrada com sucesso!", 'success');
});

const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
  const header = item.querySelector(".accordion-header");

  header.addEventListener("click", () => {
    const isCurrentlyActive = item.classList.contains("active");

    items.forEach(otherItem => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".accordion-content").style.maxHeight = null;
    });

    // Se o clicado não estava aberto, abre ele
    if (!isCurrentlyActive) {
      item.classList.add("active");
      const content = item.querySelector(".accordion-content");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

function criarBotaoOlhinho(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Cria wrapper
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:relative; display:flex; align-items:center;";
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  input.style.paddingRight = "42px";
  input.style.marginBottom = "10px";
  input.style.width = "100%";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Mostrar/ocultar senha");
  btn.style.cssText = `
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    color: #888;
    opacity: 0.8;
    transition: opacity 0.2s;
    margin-bottom: 10px;
  `;
  btn.innerHTML = olhinhoAberto();

  btn.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.innerHTML = isPassword ? olhinhoFechado() : olhinhoAberto();
  });

  btn.addEventListener("mouseenter", () => btn.style.opacity = "1");
  btn.addEventListener("mouseleave", () => btn.style.opacity = "0.8");

  wrapper.appendChild(btn);
}

function olhinhoAberto() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;
}

function olhinhoFechado() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`;
}

criarBotaoOlhinho("senhaAluno");
criarBotaoOlhinho("senhaEmpresa");
criarBotaoOlhinho("loginSenha");