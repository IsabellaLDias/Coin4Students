const ALUNO_API = "https://aluno-service-aqwz.onrender.com/alunos";
const PROFESSOR_API = "https://professor-service-f8yr.onrender.com/professores";
const TRANSACAO_API = "https://transacao-service-hc98.onrender.com/transacoes";
const VANTAGEM_API = "https://vantagem-service-1lv1.onrender.com/vantagens";

const LIMITE_HOME = 4;
const ITENS_POR_PAGINA_EXTRATO = 8;
const ITENS_POR_PAGINA_VANTAGENS = 8;

let dadosDoAlunoGlobal = null;
let vantagensDisponiveis = [];
let resgatesAluno = [];
let extratoCompleto = [];
let professoresPorId = new Map();
let paginaExtratoAtual = 1;
let paginaVantagensAtual = 1;
let vantagemSelecionada = null;

function escaparHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarData(data) {
    if (!data) return "";
    const dataObj = new Date(data);
    if (Number.isNaN(dataObj.getTime())) return "";

    return dataObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatarMoedas(valor) {
    return Number(valor || 0).toLocaleString("pt-BR");
}

function formatarCPF(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
    else if (value.length > 3) value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
    input.value = value;
}

function formatarCEP(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) value = value.replace(/(\d{5})(\d{3})/, "$1-$2");
    input.value = value;
}

async function buscarEnderecoPerfil(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!response.ok) throw new Error("Erro na busca do CEP");

        const data = await response.json();
        if (data.erro) {
            showToast("CEP não encontrado.", "error");
            return;
        }

        document.getElementById("perfilEndereco").value = data.logradouro || "";
        document.getElementById("perfilBairro").value = data.bairro || "";
        document.getElementById("perfilCidade").value = data.localidade || "";
        document.getElementById("perfilEstado").value = data.uf || "";
        document.getElementById("perfilNumero").focus();
    } catch (error) {
        console.error(error);
        showToast("Erro ao buscar endereço.", "error");
    }
}

function combinarEnderecoPerfil() {
    const endereco = document.getElementById("perfilEndereco").value;
    const numero = document.getElementById("perfilNumero").value;
    const bairro = document.getElementById("perfilBairro").value;
    const cidade = document.getElementById("perfilCidade").value;
    const estado = document.getElementById("perfilEstado").value;
    const cep = document.getElementById("perfilCEP").value;

    let enderecoCompleto = "";
    if (endereco) enderecoCompleto += endereco;
    if (numero) enderecoCompleto += `, ${numero}`;
    if (bairro) enderecoCompleto += ` - ${bairro}`;
    if (cidade) enderecoCompleto += `, ${cidade}`;
    if (estado) enderecoCompleto += `/${estado}`;
    if (cep) enderecoCompleto += ` - CEP: ${cep}`;
    return enderecoCompleto.trim();
}

function separarEndereco(enderecoCompleto) {
    const dados = { endereco: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" };
    if (!enderecoCompleto) return dados;

    const cepMatch = enderecoCompleto.match(/CEP:\s*([\d-]+)/);
    if (cepMatch) {
        dados.cep = cepMatch[1];
        enderecoCompleto = enderecoCompleto.replace(/ - CEP:\s*[\d-]+/, "").trim();
    }

    const estadoMatch = enderecoCompleto.match(/\/([A-Z]{2})$/);
    if (estadoMatch) {
        dados.estado = estadoMatch[1];
        enderecoCompleto = enderecoCompleto.replace(/\/[A-Z]{2}$/, "").trim();
    }

    const partes = enderecoCompleto.split(/,\s*|\s*-\s*/);
    if (partes.length >= 1) dados.endereco = partes[0] || "";
    if (partes.length >= 2) dados.numero = partes[1] || "";
    if (partes.length >= 3) dados.bairro = partes[2] || "";
    if (partes.length >= 4) dados.cidade = partes[3] || "";
    return dados;
}

document.addEventListener("DOMContentLoaded", async () => {
    const alunoId = localStorage.getItem("alunoIdLogado");
    if (!alunoId) {
        window.location.href = "coin4students.html";
        return;
    }

    try {
        await carregarAluno(alunoId);
        await carregarProfessores();
        await carregarResgatesAluno();
        await carregarVantagens();
        await carregarExtrato();
    } catch (error) {
        console.error(error);
        showToast("Sessão inválida. Faça login novamente.", "error");
        setTimeout(() => logout(), 2000);
    }
});

async function carregarAluno(alunoId = dadosDoAlunoGlobal?.id) {
    const response = await fetch(`${ALUNO_API}/${alunoId}`);
    if (!response.ok) throw new Error("Erro ao buscar dados do aluno");

    dadosDoAlunoGlobal = await response.json();
    atualizarAlunoNaTela();
    preencherCamposFormulario(dadosDoAlunoGlobal);
}

function atualizarAlunoNaTela() {
    document.getElementById("nomeAluno").innerText = dadosDoAlunoGlobal?.nome || "Aluno";
    document.getElementById("valorSaldo").innerText = formatarMoedas(dadosDoAlunoGlobal?.saldoMoedas || 0);
}

function preencherCamposFormulario(aluno) {
    document.getElementById("perfilNome").value = aluno.nome || "";
    document.getElementById("perfilEmail").value = aluno.email || "";

    const enderecoSeparado = separarEndereco(aluno.endereco || "");
    document.getElementById("perfilEndereco").value = enderecoSeparado.endereco;
    document.getElementById("perfilNumero").value = enderecoSeparado.numero;
    document.getElementById("perfilBairro").value = enderecoSeparado.bairro;
    document.getElementById("perfilCidade").value = enderecoSeparado.cidade;
    document.getElementById("perfilEstado").value = enderecoSeparado.estado;
    document.getElementById("perfilCEP").value = enderecoSeparado.cep;
    document.getElementById("perfilCPF").value = aluno.cpf || "";
    document.getElementById("perfilRG").value = aluno.rg || "";
    document.getElementById("perfilInstituicao").value = aluno.curso || "";
}

async function carregarProfessores() {
    professoresPorId = new Map();

    try {
        const response = await fetch(PROFESSOR_API);
        if (!response.ok) throw new Error("Erro ao buscar professores");

        const professores = await response.json();
        if (!Array.isArray(professores)) return;

        professores.forEach(professor => {
            if (professor?.id != null) {
                professoresPorId.set(Number(professor.id), professor);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function garantirProfessoresDoExtrato() {
    const ids = [...new Set(
        extratoCompleto
            .map(transacao => Number(transacao.idProfessor))
            .filter(id => Number.isFinite(id) && !professoresPorId.has(id))
    )];

    await Promise.all(ids.map(async id => {
        try {
            const response = await fetch(`${PROFESSOR_API}/${id}`);
            if (!response.ok) return;
            const professor = await response.json();
            professoresPorId.set(Number(id), professor);
        } catch (error) {
            console.error(error);
        }
    }));
}

async function carregarResgatesAluno() {
    try {
        const response = await fetch(`${VANTAGEM_API}/resgates/aluno/${dadosDoAlunoGlobal.id}`);
        if (!response.ok) throw new Error("Erro ao buscar resgates do aluno");

        const resgates = await response.json();
        resgatesAluno = Array.isArray(resgates) ? resgates : [];
    } catch (error) {
        console.error(error);
        resgatesAluno = [];
    }
}

async function carregarVantagens() {
    try {
        const response = await fetch(VANTAGEM_API);
        if (!response.ok) throw new Error("Erro ao buscar vantagens");

        const vantagens = await response.json();
        vantagensDisponiveis = Array.isArray(vantagens) ? vantagens : [];
        renderizarVantagens();
        atualizarResumo();
    } catch (error) {
        console.error(error);
        document.getElementById("vantagensHome").innerHTML = `<p class="empty-state">Erro ao carregar vantagens.</p>`;
        document.getElementById("vantagensLista").innerHTML = `<p class="empty-state">Erro ao carregar vantagens.</p>`;
    }
}

async function carregarExtrato() {
    try {
        const response = await fetch(`${TRANSACAO_API}/extrato/aluno/${dadosDoAlunoGlobal.id}`);
        if (!response.ok) throw new Error("Erro ao buscar extrato");

        const transacoes = await response.json();
        extratoCompleto = Array.isArray(transacoes)
            ? [...transacoes].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))
            : [];

        await garantirProfessoresDoExtrato();
        renderizarExtrato();
        atualizarResumo();
    } catch (error) {
        console.error(error);
        document.getElementById("extratoHome").innerHTML = `<p class="empty-state">Sem transações recentes.</p>`;
        document.getElementById("extratoLista").innerHTML = `<p class="empty-state">Nenhuma transação encontrada.</p>`;
    }
}

function atualizarResumo() {
    const totalMoedas = extratoCompleto.reduce((soma, transacao) => soma + Number(transacao.valor || 0), 0);
    document.getElementById("totalTransacoes").innerText = extratoCompleto.length;
    document.getElementById("totalMoedasRecebidas").innerText = formatarMoedas(totalMoedas);
    document.getElementById("totalCupons").innerText = resgatesAluno.length;
    document.getElementById("extratoResumo").innerText =
        `${extratoCompleto.length} ${extratoCompleto.length === 1 ? "registro" : "registros"}`;
    document.getElementById("vantagensResumo").innerText =
        `${vantagensDisponiveis.length} ${vantagensDisponiveis.length === 1 ? "vantagem" : "vantagens"}`;
}

function dadosProfessor(idProfessor) {
    return professoresPorId.get(Number(idProfessor)) || {};
}

function nomeProfessor(idProfessor) {
    return dadosProfessor(idProfessor).nome || "Professor não encontrado";
}

function emailProfessor(idProfessor) {
    return dadosProfessor(idProfessor).email || "E-mail não disponível";
}

function renderizarExtrato() {
    document.getElementById("extratoHome").innerHTML =
        montarExtratoHtml(extratoCompleto.slice(0, LIMITE_HOME), "Sem transações recentes.");

    const totalPaginas = Math.max(1, Math.ceil(extratoCompleto.length / ITENS_POR_PAGINA_EXTRATO));
    paginaExtratoAtual = Math.min(Math.max(1, paginaExtratoAtual), totalPaginas);
    const inicio = (paginaExtratoAtual - 1) * ITENS_POR_PAGINA_EXTRATO;
    const itensPagina = extratoCompleto.slice(inicio, inicio + ITENS_POR_PAGINA_EXTRATO);

    document.getElementById("extratoLista").innerHTML =
        montarExtratoHtml(itensPagina, "Nenhuma transação encontrada.");
    renderizarPaginacao("paginacaoExtrato", paginaExtratoAtual, totalPaginas, "mudarPaginaExtrato");
}

function montarExtratoHtml(itens, mensagemVazia) {
    if (!itens.length) {
        return `<p class="empty-state">${mensagemVazia}</p>`;
    }

    return itens.map(transacao => {
        const professor = nomeProfessor(transacao.idProfessor);
        const email = emailProfessor(transacao.idProfessor);
        const mensagem = transacao.mensagem || transacao.descricao || "Recebimento de moedas";

        return `
            <div class="lista-item">
                <div>
                    <strong>${escaparHtml(professor)}</strong>
                    <small>${escaparHtml(email)}</small>
                    <small>${escaparHtml(mensagem)}</small>
                    <small>${escaparHtml(formatarData(transacao.data))}</small>
                </div>
                <div class="item-meta">
                    <strong>+${formatarMoedas(transacao.valor || 0)}</strong>
                    <small>moedas</small>
                </div>
            </div>
        `;
    }).join("");
}

function resgateDaVantagem(idVantagem) {
    return resgatesAluno.find(resgate => Number(resgate.idVantagem) === Number(idVantagem));
}

function renderizarVantagens() {
    const sugestoes = vantagensDisponiveis.slice(0, LIMITE_HOME);
    document.getElementById("vantagensHome").innerHTML =
        sugestoes.length
            ? sugestoes.map(montarCardVantagem).join("")
            : `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;

    const totalPaginas = Math.max(1, Math.ceil(vantagensDisponiveis.length / ITENS_POR_PAGINA_VANTAGENS));
    paginaVantagensAtual = Math.min(Math.max(1, paginaVantagensAtual), totalPaginas);
    const inicio = (paginaVantagensAtual - 1) * ITENS_POR_PAGINA_VANTAGENS;
    const itensPagina = vantagensDisponiveis.slice(inicio, inicio + ITENS_POR_PAGINA_VANTAGENS);

    document.getElementById("vantagensLista").innerHTML =
        itensPagina.length
            ? itensPagina.map(montarCardVantagem).join("")
            : `<p class="empty-state">Nenhuma vantagem cadastrada.</p>`;
    renderizarPaginacao("paginacaoVantagens", paginaVantagensAtual, totalPaginas, "mudarPaginaVantagens");
}

function montarCardVantagem(vantagem) {
    const titulo = vantagem.titulo || vantagem.nome || "Vantagem";
    const custo = Number(vantagem.custoMoedas || vantagem.valor || 0);
    const resgate = resgateDaVantagem(vantagem.id);
    const imagem = vantagem.imagemUrl
        ? `<img class="vantagem-img" src="${escaparHtml(vantagem.imagemUrl)}" alt="${escaparHtml(titulo)}" loading="lazy" onerror="this.closest('.vantagem-media').classList.add('sem-imagem'); this.remove();">`
        : "";
    const botao = resgate
        ? `<span class="status-pill">Utilizado</span>`
        : `<button class="btn-resgatar" onclick="abrirModalResgate(${vantagem.id})">Resgatar</button>`;

    return `
        <article class="vantagem-card">
            <div class="vantagem-media ${vantagem.imagemUrl ? "" : "sem-imagem"}">
                ${imagem}
                <div class="vantagem-icon">
                    <i class="ph ph-ticket"></i>
                </div>
            </div>
            <div>
                <h4>${escaparHtml(titulo)}</h4>
                <p>${escaparHtml(vantagem.descricao || "Sem descrição.")}</p>
            </div>
            <strong>${formatarMoedas(custo)} moedas</strong>
            <div class="vantagem-acoes">
                <span class="status-pill">${escaparHtml(vantagem.nomeEmpresa || "Empresa")}</span>
                ${botao}
            </div>
        </article>
    `;
}

function renderizarPaginacao(idContainer, paginaAtual, totalPaginas, fnNome) {
    const container = document.getElementById(idContainer);
    if (!container) return;

    if (totalPaginas <= 1) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <button type="button" onclick="${fnNome}(-1)" ${paginaAtual === 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${paginaAtual} de ${totalPaginas}</span>
        <button type="button" onclick="${fnNome}(1)" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima</button>
    `;
}

function mudarPaginaExtrato(direcao) {
    const totalPaginas = Math.max(1, Math.ceil(extratoCompleto.length / ITENS_POR_PAGINA_EXTRATO));
    paginaExtratoAtual = Math.min(Math.max(1, paginaExtratoAtual + direcao), totalPaginas);
    renderizarExtrato();
}

function mudarPaginaVantagens(direcao) {
    const totalPaginas = Math.max(1, Math.ceil(vantagensDisponiveis.length / ITENS_POR_PAGINA_VANTAGENS));
    paginaVantagensAtual = Math.min(Math.max(1, paginaVantagensAtual + direcao), totalPaginas);
    renderizarVantagens();
}

function abrirModalResgate(idVantagem) {
    const vantagem = vantagensDisponiveis.find(v => Number(v.id) === Number(idVantagem));
    if (!vantagem) {
        showToast("Vantagem não encontrada.", "error");
        return;
    }

    const custo = Number(vantagem.custoMoedas || vantagem.valor || 0);
    if ((dadosDoAlunoGlobal?.saldoMoedas || 0) < custo) {
        showToast("Saldo insuficiente.", "error");
        return;
    }

    vantagemSelecionada = vantagem;
    document.getElementById("resgateModalConteudo").innerHTML = montarConteudoModalResgate(vantagem);
    document.getElementById("btnConfirmarResgate").disabled = false;
    document.getElementById("btnConfirmarResgate").innerText = "Confirmar Resgate";
    document.getElementById("resgateModal").style.display = "flex";
}

function montarConteudoModalResgate(vantagem, cupom = null) {
    const titulo = vantagem.titulo || "Vantagem";
    const custo = Number(vantagem.custoMoedas || 0);
    const qr = cupom?.qrCodeBase64
        ? `<img class="cupom-qr" src="data:image/png;base64,${cupom.qrCodeBase64}" alt="QR Code do cupom">`
        : "";
    const codigo = cupom?.codigo
        ? `<div><strong>Código:</strong> ${escaparHtml(cupom.codigo)}</div>`
        : "";

    return `
        <h3>${cupom ? "Cupom gerado" : "Confirmar resgate"}</h3>
        <p>${cupom ? "O cupom foi enviado para o seu e-mail." : "Confira os dados antes de confirmar."}</p>
        <div class="cupom-detalhes">
            <div><strong>Vantagem:</strong> ${escaparHtml(titulo)}</div>
            <div><strong>Empresa:</strong> ${escaparHtml(vantagem.nomeEmpresa || "Empresa")}</div>
            <div><strong>Custo:</strong> ${formatarMoedas(custo)} moedas</div>
            <div><strong>Status:</strong> ${cupom ? "Utilizado" : "Aguardando confirmação"}</div>
            ${codigo}
        </div>
        ${qr}
    `;
}

async function confirmarResgate() {
    if (!vantagemSelecionada) return;

    const custo = Number(vantagemSelecionada.custoMoedas || 0);
    if ((dadosDoAlunoGlobal?.saldoMoedas || 0) < custo) {
        showToast("Saldo insuficiente.", "error");
        fecharModalResgate();
        return;
    }

    const btn = document.getElementById("btnConfirmarResgate");
    btn.disabled = true;
    btn.innerText = "Resgatando...";

    try {
        const response = await fetch(`${VANTAGEM_API}/${vantagemSelecionada.id}/resgatar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idAluno: dadosDoAlunoGlobal.id,
                emailAluno: dadosDoAlunoGlobal.email
            })
        });

        if (!response.ok) throw new Error(await response.text());

        const cupom = await response.json();
        document.getElementById("resgateModalConteudo").innerHTML = montarConteudoModalResgate(vantagemSelecionada, cupom);
        btn.style.display = "none";
        showToast("Resgate realizado! O cupom foi enviado para o seu e-mail.", "success");

        await carregarAluno();
        await carregarResgatesAluno();
        renderizarVantagens();
        atualizarResumo();
    } catch (error) {
        console.error(error);
        btn.disabled = false;
        btn.innerText = "Confirmar Resgate";
        showToast("Erro ao resgatar vantagem.", "error");
    }
}

function fecharModalResgate() {
    document.getElementById("resgateModal").style.display = "none";
    document.getElementById("btnConfirmarResgate").style.display = "inline-flex";
    vantagemSelecionada = null;
}

async function atualizarPerfil() {
    if (!dadosDoAlunoGlobal) return;

    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

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
        ...dadosDoAlunoGlobal,
        nome: document.getElementById("perfilNome").value,
        email: document.getElementById("perfilEmail").value,
        endereco: combinarEnderecoPerfil(),
        curso: document.getElementById("perfilInstituicao").value
    };

    if (novaSenha) dadosAtualizados.senha = novaSenha;

    try {
        const response = await fetch(`${ALUNO_API}/${dadosDoAlunoGlobal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error(await response.text());

        dadosDoAlunoGlobal = await response.json();
        preencherCamposFormulario(dadosDoAlunoGlobal);
        atualizarAlunoNaTela();
        document.getElementById("perfilNovaSenha").value = "";
        document.getElementById("perfilConfirmarSenha").value = "";
        showToast("Perfil atualizado com sucesso!", "success");
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
        const response = await fetch(`${ALUNO_API}/${dadosDoAlunoGlobal.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(await response.text());
        showToast("Conta excluída.", "info");
        setTimeout(logout, 900);
    } catch (error) {
        console.error(error);
        showToast("Erro ao excluir conta.", "error");
    }
}

function trocarTab(tab) {
    ["home", "extrato", "vantagens", "perfil"].forEach(secao => {
        const el = document.getElementById(`secao-${secao}`);
        if (el) el.style.display = "none";
        const btn = document.getElementById(`btn-${secao}`);
        if (btn) btn.classList.remove("active");
    });

    document.getElementById(`secao-${tab}`).style.display = "block";
    const btnAtivo = document.getElementById(`btn-${tab}`);
    if (btnAtivo) btnAtivo.classList.add("active");
}

function logout() {
    localStorage.removeItem("alunoIdLogado");
    window.location.href = "coin4students.html";
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
