const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";
const PROFESSOR_API = "https://professor-service-0rvu.onrender.com/professores";

// ==========================================
// FUNÇÕES DE MÁSCARA
// ==========================================
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarRG(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length > 8) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    } else if (value.length > 5) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarCNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    if (value.length > 12) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    input.value = value;
}

async function buscarEndereco(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        return;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error('Erro na busca do CEP');
        }
        
        const data = await response.json();
        
        if (data.erro) {
            if (typeof showToast === "function") showToast('CEP não encontrado. Verifique o código digitado.', 'error');
            return;
        }

        document.getElementById('enderecoAluno').value = data.logradouro || '';
        document.getElementById('bairroAluno').value = data.bairro || '';
        document.getElementById('cidadeAluno').value = data.localidade || '';
        document.getElementById('estadoAluno').value = data.uf || '';

        document.getElementById('numeroAluno').focus();
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        if (typeof showToast === "function") showToast('Erro ao buscar endereço. Tente novamente.', 'error');
    }
}

function combinarEndereco() {
    const endereco = document.getElementById('enderecoAluno').value;
    const numero = document.getElementById('numeroAluno').value;
    const bairro = document.getElementById('bairroAluno').value;
    const cidade = document.getElementById('cidadeAluno').value;
    const estado = document.getElementById('estadoAluno').value;
    const cep = document.getElementById('cepAluno').value;
    
    let enderecoCompleto = '';
    if (endereco) enderecoCompleto += endereco;
    if (numero) enderecoCompleto += `, ${numero}`;
    if (bairro) enderecoCompleto += ` - ${bairro}`;
    if (cidade) enderecoCompleto += `, ${cidade}`;
    if (estado) enderecoCompleto += `/${estado}`;
    if (cep) enderecoCompleto += ` - CEP: ${cep}`;
    
    return enderecoCompleto.trim();
}

// ==========================================
// NAVEGAÇÃO E AUTENTICAÇÃO
// ==========================================

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
    // 1. Busca Alunos
    const respAlunos = await fetch(ALUNO_API);
    const alunos = await respAlunos.json();
    const aluno = alunos.find(a => a.email === email && a.senha === senha);

    if (aluno) {
      localStorage.setItem("alunoIdLogado", aluno.id);
      if (typeof showToast === "function") showToast(`Bem-vindo, Aluno ${aluno.nome}!`, 'success');
      setTimeout(() => window.location.href = "aluno.html", 1000);
      return;
    }

    // 2. Busca Professores
    const respProfessores = await fetch(PROFESSOR_API);
    const professores = await respProfessores.json();
    const professor = professores.find(p => p.email === email && p.senha === senha);
    
    if (professor) {
      localStorage.setItem("professorIdLogado", professor.id);
      if (typeof showToast === "function") showToast(`Bem-vindo, Professor ${professor.nome}!`, 'success');
      setTimeout(() => window.location.href = "professor.html", 1000);
      return;
    }

    // 3. Busca Empresas
    const respEmpresas = await fetch(EMPRESA_API);
    const empresas = await respEmpresas.json();
    const empresa = empresas.find(emp => emp.email === email && emp.senha === senha);

    if (empresa) {
      localStorage.setItem("empresaIdLogada", empresa.id);
      if (typeof showToast === "function") showToast(`Bem-vindo, Empresa ${empresa.nome}!`, 'success');
      setTimeout(() => window.location.href = "empresa.html", 1000);
      return;
    }

    // Se passou por todos e não encontrou, exibe o erro APENAS AQUI.
    if (typeof showToast === "function") showToast("E-mail ou senha incorretos.", 'error');

  } catch (error) {
    if (typeof showToast === "function") showToast("Erro ao conectar com o servidor.", 'error');
  }
});

// ==========================================
// CADASTROS
// ==========================================

document.getElementById("formAluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: document.getElementById("nomeAluno").value,
    email: document.getElementById("emailAluno").value,
    senha: document.getElementById("senhaAluno").value,
    cpf: document.getElementById("cpfAluno").value,
    rg: document.getElementById("rgAluno").value,
    endereco: combinarEndereco(),
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
      if (typeof showToast === "function") showToast("Aluno cadastrado com sucesso!", 'success');
      setTimeout(() => window.location.href = "aluno.html", 1000);
    } else {
      if (typeof showToast === "function") showToast("Erro ao cadastrar: verifique os dados ou o servidor.", 'error');
    }
  } catch (error) {
    console.error("Erro técnico:", error);
    if (typeof showToast === "function") showToast("O servidor está desligado ou houve um erro de conexão.", 'error');
  }
});

// CORREÇÃO APLICADA: Inclusão de try/catch, verificação de erro e redirecionamento.
document.getElementById("formEmpresa").addEventListener("submit", async (e) => {
  e.preventDefault();

  const empresa = {
    nome: document.getElementById("nomeEmpresa").value,
    email: document.getElementById("emailEmpresa").value,
    senha: document.getElementById("senhaEmpresa").value,
    cnpj: document.getElementById("cnpjEmpresa").value
  };

  try {
    const response = await fetch(EMPRESA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empresa)
    });

    if (response.ok) {
      const empresaCriada = await response.json();
      localStorage.setItem("empresaIdLogada", empresaCriada.id);
      if (typeof showToast === "function") showToast("Empresa cadastrada com sucesso!", 'success');
      setTimeout(() => window.location.href = "empresa.html", 1000);
    } else {
      if (typeof showToast === "function") showToast("Erro ao cadastrar empresa.", 'error');
    }
  } catch (error) {
    console.error("Erro técnico:", error);
    if (typeof showToast === "function") showToast("Erro de conexão com o servidor.", 'error');
  }
});

document.getElementById("formProfessor").addEventListener("submit", async (e) => {
  e.preventDefault();

  const professor = {
    nome: document.getElementById("nomeProfessor").value,
    email: document.getElementById("emailProfessor").value,
    senha: document.getElementById("senhaProfessor").value,
    cpf: document.getElementById("cpfProfessor").value,
    departamento: document.getElementById("departamentoProfessor").value,
    saldoMoedas: 0
  };
  console.log("Dados que estão indo para a API:", professor);

  try {
    const response = await fetch(PROFESSOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(professor)
    });

    if (response.ok) {
      const professorCriado = await response.json();
      localStorage.setItem("professorIdLogado", professorCriado.id);
      if (typeof showToast === "function") showToast("Professor cadastrado com sucesso!", "success");
      setTimeout(() => {
        window.location.href = "professor.html";
      }, 1000);
    } else {
      if (typeof showToast === "function") showToast("Erro ao cadastrar professor.", "error");
    }
  } catch (error) {
    console.error("Erro ao cadastrar professor:", error);
    if (typeof showToast === "function") showToast("Erro de conexão com o servidor.", "error");
  }
});

// ==========================================
// ACCORDION E UI
// ==========================================

const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
  const header = item.querySelector(".accordion-header");

  header.addEventListener("click", () => {
    const isCurrentlyActive = item.classList.contains("active");

    items.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        const otherContent = otherItem.querySelector(".accordion-content");
        if(otherContent) otherContent.style.maxHeight = null;
      }
    });

    const content = item.querySelector(".accordion-content");
    if (!isCurrentlyActive) {
      item.classList.add("active");
      if(content) content.style.maxHeight = "400px";
    } else {
      item.classList.remove("active");
      if(content) content.style.maxHeight = null;
    }
  });
});

function criarBotaoOlhinho(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

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
criarBotaoOlhinho("senhaProfessor");
criarBotaoOlhinho("loginSenha");