const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

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

  await fetch(ALUNO_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno)
  });

  alert("Aluno cadastrado com sucesso!");
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