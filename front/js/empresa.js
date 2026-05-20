const EMPRESA_API = "https://empresa-service.onrender.com/empresas";
const VANTAGEM_API = "https://vantagem-service.onrender.com/vantagens";

let dadosDaEmpresaGlobal = null;
let vantagensEmpresa = [];
let resgatesEmpresa = [];

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
        await carregarPainelEmpresa();
    } catch (error) {
        console.error("Erro:", error);
        showToast("Sessão inválida. Faça login novamente.", "error");
        setTimeout(() => logout(), 2000);
    }
});

function escaparHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizarTexto(valor) {
    return String(valor ?? "").trim().toLocaleLowerCase("pt-BR");
}

function obterNomeEmpresa() {
    return dadosDaEmpresaGlobal?.nome || "";
}

function formatarMoedas(valor) {
    return Number(valor || 0).toLocaleString("pt-BR");
}

function preencherDadosEmpresa(empresa) {
    document.getElementById("nomeEmpresa").innerText = empresa.nome || "Empresa";
    document.getElementById("nomeEmpresaCadastro").innerText = empresa.nome || "Empresa";
    document.getElementById("perfilNome").value = empresa.nome || "";
    document.getElementById("perfilEmail").value = empresa.email || "";
    document.getElementById("perfilCNPJ").value = empresa.cnpj || "";
}

async function carregarPainelEmpresa() {
    await carregarVantagensEmpresa();
    await carregarResgatesEmpresa();
    atualizarResumo();
    renderizarResgatesRecentes();
    renderizarDestaques();
    renderizarMinhasVantagens();
}

async function carregarVantagensEmpresa() {
    try {
        const response = await fetch(VANTAGEM_API);
        if (!response.ok) throw new Error("Erro ao buscar vantagens");

        const vantagens = await response.json();
        const nomeEmpresa = normalizarTexto(obterNomeEmpresa());

        vantagensEmpresa = Array.isArray(vantagens)
            ? vantagens.filter(v => normalizarTexto(v.nomeEmpresa) === nomeEmpresa)
            : [];
    } catch (error) {
        console.error(error);
        vantagensEmpresa = [];
        showToast("Não foi possível carregar as vantagens.", "error");
    }
}

async function carregarResgatesEmpresa() {
    try {
        const response = await fetch(`${VANTAGEM_API}/resgates`);
        if (!response.ok) throw new Error("Erro ao buscar resgates");

        const resgates = await response.json();
        const idsVantagensEmpresa = new Set(vantagensEmpresa.map(v => Number(v.id)));

        resgatesEmpresa = Array.isArray(resgates)
            ? resgates.filter(r => idsVantagensEmpresa.has(Number(r.idVantagem)))
            : [];
    } catch (error) {
        console.error(error);
        resgatesEmpresa = [];
    }
}

async function cadastrarVantagem() {
    if (!dadosDaEmpresaGlobal) {
        showToast("Dados da empresa não encontrados.", "error");
        return;
    }

    const titulo = document.getElementById("vantagemTitulo").value.trim();
    const descricao = document.getElementById("vantagemDescricao").value.trim();
    const custoMoedas = Number(document.getElementById("vantagemCusto").value);

    if (!titulo || !descricao || !Number.isFinite(custoMoedas) || custoMoedas <= 0) {
        showToast("Preencha todos os dados da vantagem.", "error");
        return;
    }

    const vantagem = {
        titulo,
        descricao,
        custoMoedas,
        nomeEmpresa: obterNomeEmpresa()
    };

    try {
        const response = await fetch(VANTAGEM_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vantagem)
        });

        if (!response.ok) throw new Error(await response.text());

        document.getElementById("formVantagem").reset();
        showToast("Vantagem cadastrada com sucesso!", "success");
        await carregarPainelEmpresa();
        trocarTab("minhas-vantagens");
    } catch (error) {
        console.error(error);
        showToast("Erro ao cadastrar vantagem.", "error");
    }
}

function atualizarResumo() {
    const totalVantagens = vantagensEmpresa.length;
    const totalResgates = resgatesEmpresa.length;
    const totalMoedas = vantagensEmpresa.reduce((soma, v) => soma + Number(v.custoMoedas || 0), 0);
    const custoMedio = totalVantagens ? Math.round(totalMoedas / totalVantagens) : 0;

    document.getElementById("totalVantagens").innerText = totalVantagens;
    document.getElementById("totalResgates").innerText = totalResgates;
    document.getElementById("totalMoedasOfertas").innerText = formatarMoedas(totalMoedas);
    document.getElementById("custoMedio").innerText = formatarMoedas(custoMedio);
    document.getElementById("minhasVantagensResumo").innerText =
        `${totalVantagens} ${totalVantagens === 1 ? "oferta" : "ofertas"}`;
}

function buscarVantagem(idVantagem) {
    return vantagensEmpresa.find(v => Number(v.id) === Number(idVantagem));
}

function renderizarResgatesRecentes() {
    const container = document.getElementById("resgatesRecentes");
    const recentes = resgatesEmpresa.slice(0, 4);

    if (!recentes.length) {
        container.innerHTML = `<p class="empty-state">Nenhum resgate recente.</p>`;
        return;
    }

    container.innerHTML = recentes.map(resgate => {
        const vantagem = buscarVantagem(resgate.idVantagem);
        const titulo = vantagem?.titulo || `Vantagem #${resgate.idVantagem}`;
        const custo = vantagem?.custoMoedas || 0;
        const status = resgate.utilizado ? "Utilizado" : "Disponível";

        return `
            <div class="lista-item">
                <div>
                    <strong>${escaparHtml(titulo)}</strong>
                    <small>Aluno #${escaparHtml(resgate.idAluno)} • Cupom ${escaparHtml(resgate.codigo).slice(0, 8)}</small>
                </div>
                <div class="item-meta">
                    <strong>${formatarMoedas(custo)}</strong>
                    <span>${status}</span>
                </div>
            </div>
        `;
    }).join("");
}

function obterDestaques() {
    const usados = [];
    const idsAdicionados = new Set();

    resgatesEmpresa.forEach(resgate => {
        const id = Number(resgate.idVantagem);
        if (idsAdicionados.has(id)) return;

        const vantagem = buscarVantagem(id);
        if (vantagem) {
            usados.push(vantagem);
            idsAdicionados.add(id);
        }
    });

    const restantes = vantagensEmpresa.filter(v => !idsAdicionados.has(Number(v.id)));
    return [...usados, ...restantes].slice(0, 4);
}

function renderizarDestaques() {
    const container = document.getElementById("destaqueEmpresa");
    const destaques = obterDestaques();

    if (!destaques.length) {
        container.innerHTML = `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;
        return;
    }

    container.innerHTML = destaques.map(montarCardVantagem).join("");
}

function renderizarMinhasVantagens() {
    const container = document.getElementById("minhasVantagensLista");

    if (!vantagensEmpresa.length) {
        container.innerHTML = `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;
        return;
    }

    container.innerHTML = vantagensEmpresa.map(montarCardVantagem).join("");
}

function montarCardVantagem(vantagem) {
    return `
        <article class="vantagem-card">
            <div class="vantagem-icon">
                <i class="ph ph-ticket"></i>
            </div>
            <div>
                <h4>${escaparHtml(vantagem.titulo || "Vantagem")}</h4>
                <p>${escaparHtml(vantagem.descricao || "Sem descrição.")}</p>
            </div>
            <strong>${formatarMoedas(vantagem.custoMoedas)} moedas</strong>
        </article>
    `;
}

function showToast(message, type = "info", duration = 4000) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${escaparHtml(message)}</span>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Fechar">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastFadeOut 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`${inputId}-icon`);
    if (!input || !icon) return;

    if (input.type === "password") {
        input.type = "text";
        icon.className = "ph ph-eye-slash";
    } else {
        input.type = "password";
        icon.className = "ph ph-eye";
    }
}

async function atualizarPerfil() {
    if (!dadosDaEmpresaGlobal) {
        showToast("Erro: dados da empresa não encontrados.", "error");
        return;
    }

    const novoNome = document.getElementById("perfilNome").value.trim();
    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

    if (!novoNome) {
        showToast("O nome da empresa não pode estar vazio.", "error");
        return;
    }

    if (novaSenha || confirmarSenha) {
        if (novaSenha !== confirmarSenha) {
            showToast("As senhas não coincidem.", "error");
            return;
        }
        if (novaSenha.length < 4) {
            showToast("A senha deve ter pelo menos 4 caracteres.", "error");
            return;
        }
    }

    const dadosAtualizados = {
        ...dadosDaEmpresaGlobal,
        nome: novoNome
    };

    if (novaSenha) dadosAtualizados.senha = novaSenha;

    try {
        const response = await fetch(`${EMPRESA_API}/${dadosDaEmpresaGlobal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error(await response.text());

        dadosDaEmpresaGlobal = await response.json();
        preencherDadosEmpresa(dadosDaEmpresaGlobal);
        document.getElementById("perfilNovaSenha").value = "";
        document.getElementById("perfilConfirmarSenha").value = "";
        showToast("Perfil atualizado com sucesso!", "success");
        await carregarPainelEmpresa();
    } catch (error) {
        console.error(error);
        showToast("Erro ao atualizar perfil.", "error");
    }
}

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

        if (!response.ok) throw new Error(await response.text());

        showToast("Empresa removida com sucesso.", "info");
        setTimeout(logout, 700);
    } catch (error) {
        console.error(error);
        showToast("Erro ao excluir empresa.", "error");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "coin4students.html";
}

function trocarTab(tab) {
    const secoes = [
        "secao-home",
        "secao-perfil",
        "secao-cadastrar-vantagem",
        "secao-minhas-vantagens"
    ];

    secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const target = document.getElementById(`secao-${tab}`);
    if (target) target.style.display = "block";

    document.querySelectorAll(".menu a").forEach(link => link.classList.remove("active"));

    const btnAtivo = document.getElementById(`btn-${tab}`);
    if (btnAtivo) btnAtivo.classList.add("active");
}
