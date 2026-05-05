// ==========================================
// CONFIG
// ==========================================
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

let dadosDaEmpresaGlobal = null;

// ==========================================
// INIT (carrega dados da empresa logada)
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const empresaId = localStorage.getItem("empresaIdLogada");

    if (!empresaId) {
        window.location.href = "coin4students.html";
        return;
    }

    try {
        const response = await fetch(`${EMPRESA_API}/${empresaId}`);

        if (!response.ok) throw new Error("Erro ao buscar empresa");

        const empresa = await response.json();
        dadosDaEmpresaGlobal = empresa;

        // Preencher tela
        preencherDadosEmpresa(empresa);

    } catch (error) {
        console.error("Erro:", error);
        showToast("Sessão inválida. Faça login novamente.", 'error');
        setTimeout(() => logout(), 2000);
    }
});

// ==========================================
// PREENCHER DADOS NA TELA
// ==========================================
function preencherDadosEmpresa(empresa) {
    document.getElementById("nomeEmpresa").innerText = empresa.nome;
    document.getElementById("perfilNome").value = empresa.nome || "";
    document.getElementById("perfilEmail").value = empresa.email || "";
    document.getElementById("perfilCNPJ").value = empresa.cnpj || "";
}

// ==========================================
// ATUALIZAR PERFIL
// ==========================================
async function atualizarPerfil() {
    if (!dadosDaEmpresaGlobal) return;

    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

    // Validação de senha
    if (novaSenha || confirmarSenha) {
        if (novaSenha !== confirmarSenha) {
            showToast("As senhas não coincidem!", 'error');
            return;
        }
        if (novaSenha.length < 4) {
            showToast("A senha deve ter pelo menos 4 caracteres.", 'error');
            return;
        }
    }

    const dadosAtualizados = {
        ...dadosDaEmpresaGlobal,
        nome: document.getElementById("perfilNome").value
    };

    if (novaSenha) {
        dadosAtualizados.senha = novaSenha;
    }

    try {
        const response = await fetch(`${EMPRESA_API}/${dadosDaEmpresaGlobal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            showToast("Perfil atualizado com sucesso!", 'success');
            document.getElementById("perfilNovaSenha").value = "";
            document.getElementById("perfilConfirmarSenha").value = "";

            setTimeout(() => location.reload(), 1200);
        }

    } catch (error) {
        showToast("Erro ao conectar com o servidor.", 'error');
    }
}

// ==========================================
// EXCLUIR CONTA
// ==========================================
function excluirConta() {
    document.getElementById("confirmModal").style.display = "flex";
}

function fecharConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
}

async function confirmarExclusao() {
    fecharConfirmModal();

    try {
        const response = await fetch(`${EMPRESA_API}/${dadosDaEmpresaGlobal.id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("Empresa removida com sucesso.", 'info');
            setTimeout(() => logout(), 1500);
        }

    } catch (error) {
        showToast("Erro ao excluir empresa.", 'error');
    }
}

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    localStorage.removeItem("empresaIdLogada");
    window.location.href = "coin4students.html";
}

// ==========================================
// NAVEGAÇÃO ENTRE ABAS
// ==========================================
function trocarTab(tab) {
    const secoes = [
        "secao-home",
        "secao-perfil",
        "secao-cadastrar-vantagem"
    ];

    // esconder tudo
    secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    // mostrar selecionada
    const target = document.getElementById("secao-" + tab);
    if (target) target.style.display = "block";

    // ativar botão
    const links = document.querySelectorAll(".menu a");
    links.forEach(link => link.classList.remove("active"));

    const btnAtivo = document.getElementById("btn-" + tab);
    if (btnAtivo) btnAtivo.classList.add("active");
}