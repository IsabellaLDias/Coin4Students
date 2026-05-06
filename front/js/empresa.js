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

        if (!response.ok) {
            logout();
            return;
        }

        const empresa = await response.json();
        dadosDaEmpresaGlobal = empresa;

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
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error('Toast container não encontrado');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==========================================
// TOGGLE PASSWORD VISIBILITY
// ==========================================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ph ph-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'ph ph-eye';
    }
}

// ==========================================
// ATUALIZAR PERFIL
// ==========================================
async function atualizarPerfil() {
    if (!dadosDaEmpresaGlobal) {
        showToast("Erro: dados da empresa não encontrados.", 'error');
        return;
    }

    const novoNome = document.getElementById("perfilNome").value.trim();
    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

    if (!novoNome) {
        showToast("O nome da empresa não pode estar vazio.", 'error');
        return;
    }

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
        nome: novoNome
    };

    if (novaSenha) {
        dadosAtualizados.senha = novaSenha;
    }

    try {
        console.log("Enviando dados atualizados:", dadosAtualizados);
        
        const response = await fetch(`${EMPRESA_API}/${dadosDaEmpresaGlobal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        });

        console.log("Status da resposta:", response.status);
        
        if (response.ok) {
            const dadosAtualizadosResponse = await response.json();
            console.log("Resposta do servidor:", dadosAtualizadosResponse);
            
            showToast("Perfil atualizado com sucesso!", 'success');

            document.getElementById("perfilNovaSenha").value = "";
            document.getElementById("perfilConfirmarSenha").value = "";

            dadosDaEmpresaGlobal = dadosAtualizadosResponse;

            document.getElementById("nomeEmpresa").innerText = dadosAtualizadosResponse.nome;
            
        } else {
            const errorText = await response.text();
            console.error("Erro do servidor:", errorText);
            showToast(`Erro ao atualizar: ${response.status} - ${errorText}`, 'error');
        }

    } catch (error) {
        console.error("Erro de conexão:", error);
        showToast("Erro ao conectar com o servidor. Verifique sua conexão.", 'error');
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
            logout();
        }

    } catch (error) {
        showToast("Erro ao excluir empresa.", 'error');
    }
}

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    localStorage.clear();
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

    secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById("secao-" + tab);
    if (target) target.style.display = "block";

    const links = document.querySelectorAll(".menu a");
    links.forEach(link => link.classList.remove("active"));

    const btnAtivo = document.getElementById("btn-" + tab);
    if (btnAtivo) btnAtivo.classList.add("active");
}