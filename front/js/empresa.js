const EMPRESA_API = "https://empresa-service-h2xg.onrender.com/empresas";
const VANTAGEM_API = "https://vantagem-service-1lv1.onrender.com/vantagens";
const ALUNO_API = "https://aluno-service-aqwz.onrender.com/alunos";
const LIMITE_HOME_EMPRESA = 4;
const ITENS_POR_PAGINA_OFERTAS = 8;

let dadosDaEmpresaGlobal = null;
let vantagensEmpresa = [];
let resgatesEmpresa = [];
let alunosPorId = new Map();
let paginaOfertasAtual = 1;
let vantagemEmEdicaoId = null;
let imagemAtualEdicao = "";

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

document.getElementById("vantagemImagemArquivo")?.addEventListener("change", atualizarPreviewImagemVantagem);
document.getElementById("vantagemImagemUrl")?.addEventListener("input", atualizarPreviewImagemVantagem);

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

function lerArquivoComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(arquivo);
    });
}

async function obterImagemVantagem() {
    const inputArquivo = document.getElementById("vantagemImagemArquivo");
    const inputUrl = document.getElementById("vantagemImagemUrl");
    const arquivo = inputArquivo?.files?.[0];

    if (arquivo) {
        const limiteMb = 1.5;
        if (!arquivo.type.startsWith("image/")) {
            throw new Error("Selecione um arquivo de imagem.");
        }
        if (arquivo.size > limiteMb * 1024 * 1024) {
            throw new Error(`A imagem deve ter no máximo ${limiteMb} MB.`);
        }

        return lerArquivoComoDataUrl(arquivo);
    }

    return inputUrl?.value.trim() || imagemAtualEdicao || "";
}

async function atualizarPreviewImagemVantagem() {
    const preview = document.getElementById("previewImagemVantagem");
    if (!preview) return;

    try {
        const imagem = await obterImagemVantagem();
        preview.innerHTML = imagem
            ? `<img src="${escaparHtml(imagem)}" alt="Prévia da imagem da vantagem">`
            : "";
    } catch (error) {
        preview.innerHTML = "";
    }
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
    await carregarAlunosResgates();
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
        const nomeEmpresa = encodeURIComponent(obterNomeEmpresa());
        const response = await fetch(`${VANTAGEM_API}/resgates/empresa?nomeEmpresa=${nomeEmpresa}`);
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

async function carregarAlunosResgates() {
    alunosPorId = new Map();

    if (!resgatesEmpresa.length) {
        return;
    }

    const idsAlunosResgates = [...new Set(
        resgatesEmpresa
            .map(resgate => Number(resgate.idAluno))
            .filter(id => Number.isFinite(id))
    )];

    try {
        const response = await fetch(ALUNO_API);
        if (!response.ok) throw new Error("Erro ao buscar alunos");

        const alunos = await response.json();
        if (!Array.isArray(alunos)) return;

        alunos.forEach(aluno => {
            if (aluno?.id != null) {
                alunosPorId.set(Number(aluno.id), aluno.nome || aluno.email || "Aluno sem nome");
            }
        });
    } catch (error) {
        console.error(error);
    }

    const idsFaltantes = idsAlunosResgates.filter(id => !alunosPorId.has(id));
    await Promise.all(idsFaltantes.map(async idAluno => {
        try {
            const response = await fetch(`${ALUNO_API}/${idAluno}`);
            if (!response.ok) return;

            const aluno = await response.json();
            alunosPorId.set(Number(idAluno), aluno.nome || aluno.email || "Aluno sem nome");
        } catch (error) {
            console.error(error);
        }
    }));
}

async function cadastrarVantagem() {
    if (!dadosDaEmpresaGlobal) {
        showToast("Dados da empresa não encontrados.", "error");
        return;
    }

    const titulo = document.getElementById("vantagemTitulo").value.trim();
    const descricao = document.getElementById("vantagemDescricao").value.trim();
    const custoMoedas = Number(document.getElementById("vantagemCusto").value);
    let imagemUrl = "";

    try {
        imagemUrl = await obterImagemVantagem();
    } catch (error) {
        showToast(error.message, "error");
        return;
    }

    if (!titulo || !descricao || !Number.isFinite(custoMoedas) || custoMoedas <= 0) {
        showToast("Preencha todos os dados da vantagem.", "error");
        return;
    }

    const vantagem = {
        titulo,
        descricao,
        custoMoedas,
        nomeEmpresa: obterNomeEmpresa(),
        imagemUrl
    };

    try {
        if (vantagemEmEdicaoId && vantagemFoiResgatada(vantagemEmEdicaoId)) {
            showToast("Essa oferta ja foi resgatada e nao pode ser editada.", "error");
            return;
        }

        const url = vantagemEmEdicaoId ? `${VANTAGEM_API}/${vantagemEmEdicaoId}` : VANTAGEM_API;
        const metodo = vantagemEmEdicaoId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vantagem)
        });

        if (!response.ok) throw new Error(await response.text());

        const estavaEditando = Boolean(vantagemEmEdicaoId);
        limparFormularioVantagem();
        showToast(estavaEditando ? "Oferta atualizada com sucesso!" : "Vantagem cadastrada com sucesso!", "success");
        await carregarPainelEmpresa();
        paginaOfertasAtual = Math.max(1, Math.ceil(vantagensEmpresa.length / ITENS_POR_PAGINA_OFERTAS));
        renderizarMinhasVantagens();
        trocarTab("minhas-vantagens");
    } catch (error) {
        console.error(error);
        showToast("Erro ao cadastrar vantagem.", "error");
    }
}

function vantagemFoiResgatada(idVantagem) {
    return resgatesEmpresa.some(resgate => Number(resgate.idVantagem) === Number(idVantagem));
}

function editarVantagem(idVantagem) {
    const vantagem = buscarVantagem(idVantagem);
    if (!vantagem) {
        showToast("Oferta nao encontrada.", "error");
        return;
    }

    if (vantagemFoiResgatada(idVantagem)) {
        showToast("Essa oferta ja foi resgatada e nao pode ser editada.", "error");
        return;
    }

    vantagemEmEdicaoId = Number(idVantagem);
    imagemAtualEdicao = vantagem.imagemUrl || "";

    document.getElementById("vantagemTitulo").value = vantagem.titulo || "";
    document.getElementById("vantagemCusto").value = vantagem.custoMoedas || "";
    document.getElementById("vantagemDescricao").value = vantagem.descricao || "";
    document.getElementById("vantagemImagemArquivo").value = "";
    document.getElementById("vantagemImagemUrl").value =
        imagemAtualEdicao && !imagemAtualEdicao.startsWith("data:") ? imagemAtualEdicao : "";
    document.getElementById("previewImagemVantagem").innerHTML = imagemAtualEdicao
        ? `<img src="${escaparHtml(imagemAtualEdicao)}" alt="Imagem atual da vantagem">`
        : "";
    document.getElementById("textoBotaoVantagem").innerText = "Salvar Alterações";
    document.getElementById("btnCancelarEdicaoVantagem").style.display = "inline-flex";

    trocarTab("cadastrar-vantagem");
}

function cancelarEdicaoVantagem() {
    limparFormularioVantagem();
}

function limparFormularioVantagem() {
    document.getElementById("formVantagem").reset();
    document.getElementById("previewImagemVantagem").innerHTML = "";
    document.getElementById("textoBotaoVantagem").innerText = "Cadastrar Vantagem";
    document.getElementById("btnCancelarEdicaoVantagem").style.display = "none";
    vantagemEmEdicaoId = null;
    imagemAtualEdicao = "";
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

function renderizarResgatesRecentesLegado() {
    const container = document.getElementById("resgatesRecentes");
    const recentes = resgatesEmpresa.slice(0, LIMITE_HOME_EMPRESA);

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
    return [...usados, ...restantes].slice(0, LIMITE_HOME_EMPRESA);
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

function renderizarMinhasVantagensLegado() {
    const container = document.getElementById("minhasVantagensLista");

    if (!vantagensEmpresa.length) {
        container.innerHTML = `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;
        return;
    }

    container.innerHTML = vantagensEmpresa.map(montarCardVantagem).join("");
}

function montarCardVantagem(vantagem) {
    const imagem = vantagem.imagemUrl
        ? `<img class="vantagem-img" src="${escaparHtml(vantagem.imagemUrl)}" alt="${escaparHtml(vantagem.titulo || "Vantagem")}" loading="lazy" onerror="this.closest('.vantagem-media').classList.add('sem-imagem'); this.remove();">`
        : "";
    const resgatada = vantagemFoiResgatada(vantagem.id);
    const acaoEdicao = resgatada
        ? `<span class="vantagem-status">Já resgatada</span>`
        : `<button type="button" class="btn-editar-vantagem" onclick="editarVantagem(${vantagem.id})">Editar</button>`;

    return `
        <article class="vantagem-card">
            <div class="vantagem-media ${vantagem.imagemUrl ? "" : "sem-imagem"}">
                ${imagem}
                <div class="vantagem-icon">
                    <i class="ph ph-ticket"></i>
                </div>
            </div>
            <div>
                <h4>${escaparHtml(vantagem.titulo || "Vantagem")}</h4>
                <p>${escaparHtml(vantagem.descricao || "Sem descrição.")}</p>
            </div>
            <strong>${formatarMoedas(vantagem.custoMoedas)} moedas</strong>
            <div class="vantagem-acoes">
                ${acaoEdicao}
            </div>
        </article>
    `;
}

function renderizarResgatesRecentes() {
    const container = document.getElementById("resgatesRecentes");
    const recentes = resgatesEmpresa.slice(0, LIMITE_HOME_EMPRESA);

    if (!recentes.length) {
        container.innerHTML = `<p class="empty-state">Nenhum resgate recente.</p>`;
        return;
    }

    container.innerHTML = recentes.map(resgate => {
        const vantagem = buscarVantagem(resgate.idVantagem);
        const titulo = vantagem?.titulo || `Vantagem #${resgate.idVantagem}`;
        const custo = vantagem?.custoMoedas || 0;
        const status = resgate.utilizado ? "Utilizado" : "Disponível";
        const nomeAluno = alunosPorId.get(Number(resgate.idAluno)) || "Aluno não encontrado";

        return `
            <div class="lista-item">
                <div>
                    <strong>${escaparHtml(titulo)}</strong>
                    <small>${escaparHtml(nomeAluno)} - Cupom ${escaparHtml(resgate.codigo).slice(0, 8)}</small>
                </div>
                <div class="item-meta">
                    <strong>${formatarMoedas(custo)}</strong>
                    <span>${status}</span>
                </div>
            </div>
        `;
    }).join("");
}

function renderizarMinhasVantagens() {
    const container = document.getElementById("minhasVantagensLista");
    const paginacao = document.getElementById("paginacaoMinhasVantagens");

    if (!vantagensEmpresa.length) {
        container.innerHTML = `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;
        if (paginacao) paginacao.innerHTML = "";
        return;
    }

    const totalPaginas = Math.max(1, Math.ceil(vantagensEmpresa.length / ITENS_POR_PAGINA_OFERTAS));
    paginaOfertasAtual = Math.min(Math.max(1, paginaOfertasAtual), totalPaginas);

    const inicio = (paginaOfertasAtual - 1) * ITENS_POR_PAGINA_OFERTAS;
    const itensPagina = vantagensEmpresa.slice(inicio, inicio + ITENS_POR_PAGINA_OFERTAS);

    container.innerHTML = itensPagina.map(montarCardVantagem).join("");
    renderizarPaginacaoOfertas(totalPaginas);
}

function renderizarPaginacaoOfertas(totalPaginas) {
    const paginacao = document.getElementById("paginacaoMinhasVantagens");
    if (!paginacao) return;

    if (totalPaginas <= 1) {
        paginacao.innerHTML = "";
        return;
    }

    paginacao.innerHTML = `
        <button type="button" onclick="mudarPaginaOfertas(-1)" ${paginaOfertasAtual === 1 ? "disabled" : ""}>
            Anterior
        </button>
        <span>Página ${paginaOfertasAtual} de ${totalPaginas}</span>
        <button type="button" onclick="mudarPaginaOfertas(1)" ${paginaOfertasAtual === totalPaginas ? "disabled" : ""}>
            Próxima
        </button>
    `;
}

function mudarPaginaOfertas(direcao) {
    const totalPaginas = Math.max(1, Math.ceil(vantagensEmpresa.length / ITENS_POR_PAGINA_OFERTAS));
    paginaOfertasAtual = Math.min(
        Math.max(1, paginaOfertasAtual + direcao),
        totalPaginas
    );

    renderizarMinhasVantagens();
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
