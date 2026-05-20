
const PROFESSOR_API = "https://professor-service-0rvu.onrender.com/professores";
const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const TRANSACAO_API = "https://transacao-service.onrender.com/transacoes";

let dadosDoProfessorGlobal = null;
let alunosDisponiveis = [];
let historicoCompleto = [];
let paginaHistoricoAtual = 1;
const ITENS_POR_PAGINA_HISTORICO = 8;

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

function atualizarSaldoNaTela(valor) {
    const saldo = valor || 0;
    const valorSaldo = document.getElementById("valorSaldo");
    const perfilSaldo = document.getElementById("perfilSaldo");
    const saldoDistribuicao = document.getElementById("saldoDistribuicao");

    if (valorSaldo) valorSaldo.innerText = saldo;
    if (perfilSaldo) perfilSaldo.value = saldo;
    if (saldoDistribuicao) saldoDistribuicao.innerText = saldo;
}

function selecionarDepartamento(departamento) {
    const select = document.getElementById("perfilDepartamento");
    if (!select) return;

    if (!departamento) {
        select.value = "";
        return;
    }

    const existe = Array.from(select.options).some(option => option.value === departamento);
    if (!existe) {
        select.add(new Option(departamento, departamento));
    }

    select.value = departamento;
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const professorId = localStorage.getItem("professorIdLogado");

    if (!professorId) {
        window.location.href = "coin4students.html";
        return;
    }

    try {
        const response = await fetch(`${PROFESSOR_API}/${professorId}`);

        if (!response.ok) {
            throw new Error("Erro ao buscar dados do professor");
        }

        const professor = await response.json();
        dadosDoProfessorGlobal = professor;

        // Preenche informações da página
        document.getElementById("nomeProfessor").innerText = professor.nome || "Professor";
        atualizarSaldoNaTela(professor.saldoMoedas);

        preencherCamposFormulario(professor);

        // Carrega dados das seções
        await carregarAlunos();
        await carregarHistorico();

        // Botões de mostrar/ocultar senha
        criarBotaoOlhinho("perfilNovaSenha");
        criarBotaoOlhinho("perfilConfirmarSenha");

    } catch (error) {
        console.error("Erro:", error);
        showToast("Sessão inválida. Faça login novamente.", "error");
        setTimeout(() => logout(), 2000);
    }
});

// ==========================================
// PERFIL
// ==========================================
function preencherCamposFormulario(professor) {
    document.getElementById("perfilNome").value = professor.nome || "";
    document.getElementById("perfilCPF").value = professor.cpf || "";
    selecionarDepartamento(professor.departamento || "");
    document.getElementById("perfilSaldo").value = professor.saldoMoedas || 0;
    document.getElementById("perfilEmail").value = professor.email || "";
}

async function atualizarPerfil() {
    if (!dadosDoProfessorGlobal) return;

    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

    if (novaSenha || confirmarSenha) {
        if (novaSenha !== confirmarSenha) {
            showToast("As senhas não coincidem!", "error");
            return;
        }

        if (novaSenha.length < 4) {
            showToast("A senha deve ter pelo menos 4 caracteres.", "error");
            return;
        }
    }

    const dadosAtualizados = {
        ...dadosDoProfessorGlobal,
        nome: document.getElementById("perfilNome").value,
        departamento: document.getElementById("perfilDepartamento").value
    };

    if (novaSenha) {
        dadosAtualizados.senha = novaSenha;
    }

    try {
        const response = await fetch(`${PROFESSOR_API}/${dadosDoProfessorGlobal.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar perfil");
        }

        document.getElementById("perfilNovaSenha").value = "";
        document.getElementById("perfilConfirmarSenha").value = "";

        showToast("Perfil atualizado com sucesso!", "success");

        setTimeout(() => location.reload(), 1500);

    } catch (error) {
        console.error(error);
        showToast("Erro ao conectar com o servidor.", "error");
    }
}

// ==========================================
// EXCLUSÃO DE CONTA
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
        const response = await fetch(`${PROFESSOR_API}/${dadosDoProfessorGlobal.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir conta");
        }

        showToast("Conta excluída com sucesso.", "info");

        setTimeout(() => logout(), 1500);

    } catch (error) {
        console.error(error);
        showToast("Erro ao excluir conta.", "error");
    }
}

// ==========================================
// NAVEGAÇÃO ENTRE ABAS
// ==========================================
function trocarTab(tab) {
    const secoes = ["home", "distribuir", "historico", "perfil"];

    secoes.forEach(secao => {
        const elemento = document.getElementById(`secao-${secao}`);
        const botao = document.getElementById(`btn-${secao}`);

        if (elemento) elemento.style.display = "none";
        if (botao) botao.classList.remove("active");
    });

    const secaoAtiva = document.getElementById(`secao-${tab}`);
    const botaoAtivo = document.getElementById(`btn-${tab}`);

    if (secaoAtiva) secaoAtiva.style.display = "block";
    if (botaoAtivo) botaoAtivo.classList.add("active");
}

// ==========================================
// CARREGAR ALUNOS
// ==========================================
async function carregarAlunos() {
    try {
        const response = await fetch(ALUNO_API);

        if (!response.ok) {
            throw new Error("Erro ao buscar alunos");
        }

        const alunos = await response.json();
        alunosDisponiveis = alunos;

        // Select da aba Distribuir
        const selectAluno = document.getElementById("selectAluno");
        if (selectAluno) {
            selectAluno.innerHTML = `
                <option value="">Selecione um aluno</option>
            `;

            alunos.forEach(aluno => {
                selectAluno.innerHTML += `
                    <option value="${aluno.id}">
                        ${aluno.nome}
                    </option>
                `;
            });
        }

        // Home - lista de alunos recentes
        const alunosHome = document.getElementById("alunosHome");
        if (alunosHome) {
            if (alunos.length === 0) {
                alunosHome.innerHTML = "<p>Nenhum aluno cadastrado.</p>";
            } else {
                alunosHome.innerHTML = alunos
                    .slice(0, 4)
                    .map(aluno => `
                        <div class="lista-item" style="display:flex; justify-content:space-between; gap:16px;">
                            <div>
                                <span><strong>${escaparHtml(aluno.nome || "Aluno")}</strong></span><br>
                                <small>${escaparHtml(aluno.email || "Sem email cadastrado")}</small>
                            </div>
                            <strong style="color:#2e7d32; white-space:nowrap;">
                                ${aluno.saldoMoedas || 0}
                            </strong>
                        </div>
                    `)
                    .join("");
            }
        }

    } catch (error) {
        console.error(error);

        const alunosHome = document.getElementById("alunosHome");
        if (alunosHome) {
            alunosHome.innerHTML = "<p>Erro ao carregar alunos.</p>";
        }
    }
}

// ==========================================
// DISTRIBUIR MOEDAS
// ==========================================
async function distribuirMoedas() {
    const alunoId = document.getElementById("selectAluno").value;
    const quantidade = parseInt(document.getElementById("quantidadeMoedas").value);
    const motivo = document.getElementById("motivoMoedas").value.trim();

    if (!alunoId) {
        showToast("Selecione um aluno.", "error");
        return;
    }

    if (!quantidade || quantidade <= 0) {
        showToast("Informe uma quantidade válida.", "error");
        return;
    }

    if (quantidade > (dadosDoProfessorGlobal.saldoMoedas || 0)) {
        showToast("Saldo insuficiente.", "error");
        return;
    }

    if (!motivo) {
        showToast("Informe o motivo.", "error");
        return;
    }

    try {
        const alunoSelecionado = alunosDisponiveis.find(aluno => String(aluno.id) === String(alunoId));

        const response = await fetch(
            `${PROFESSOR_API}/${dadosDoProfessorGlobal.id}/enviar-moedas`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idAluno: Number(alunoId),
                    valor: quantidade,
                    mensagem: motivo,
                    emailProfessor: dadosDoProfessorGlobal.email,
                    emailAluno: alunoSelecionado?.email || ""
                })
            }
        );

        if (!response.ok) {
            const mensagemErro = await response.text();
            throw new Error(mensagemErro || "Erro ao distribuir moedas");
        }

        // Atualiza saldo local
        dadosDoProfessorGlobal.saldoMoedas -= quantidade;
        atualizarSaldoNaTela(dadosDoProfessorGlobal.saldoMoedas);

        // Limpa formulário
        document.getElementById("formDistribuir").reset();

        showToast("Moedas enviadas com sucesso!", "success");

        // Recarrega histórico
        await carregarHistorico();

    } catch (error) {
        console.error(error);
        showToast(error.message || "Erro ao distribuir moedas.", "error");
    }
}

// ==========================================
// HISTÓRICO
// ==========================================
async function carregarHistorico() {
    try {
        const response = await fetch(
            `${TRANSACAO_API}/extrato/professor/${dadosDoProfessorGlobal.id}`
        );

        if (!response.ok) {
            throw new Error("Erro ao buscar histórico");
        }

        const historico = await response.json();

        const historicoOrdenado = Array.isArray(historico)
            ? [...historico].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))
            : [];
        historicoCompleto = historicoOrdenado;
        paginaHistoricoAtual = Math.min(
            paginaHistoricoAtual,
            Math.max(1, Math.ceil(historicoCompleto.length / ITENS_POR_PAGINA_HISTORICO))
        );

        const totalMoedas = historicoOrdenado.reduce(
            (total, item) => total + (Number(item.valor || item.quantidade || 0)),
            0
        );
        const alunosImpactados = new Set(
            historicoOrdenado.map(item => item.idAluno).filter(Boolean)
        ).size;

        const totalDistribuicoes = document.getElementById("totalDistribuicoes");
        const totalMoedasEnviadas = document.getElementById("totalMoedasEnviadas");
        const totalAlunosImpactados = document.getElementById("totalAlunosImpactados");
        const historicoResumo = document.getElementById("historicoResumo");

        if (totalDistribuicoes) totalDistribuicoes.innerText = historicoOrdenado.length;
        if (totalMoedasEnviadas) totalMoedasEnviadas.innerText = totalMoedas;
        if (totalAlunosImpactados) totalAlunosImpactados.innerText = alunosImpactados;
        if (historicoResumo) {
            historicoResumo.innerText =
                `${historicoOrdenado.length} ${historicoOrdenado.length === 1 ? "registro" : "registros"}`;
        }

        const montarHtml = (itens, mensagemVazia) => {
            if (!itens || itens.length === 0) {
                return `<p>${mensagemVazia}</p>`;
            }

            return itens.map(item => {
                const aluno = alunosDisponiveis.find(a => String(a.id) === String(item.idAluno));
                const nomeAluno = item.nomeAluno || item.alunoNome || aluno?.nome || `Aluno #${item.idAluno || ""}`;
                const mensagem = item.mensagem || item.descricao || item.motivo || "Envio de moedas";
                const valor = item.valor || item.quantidade || 0;
                const dataFormatada = formatarData(item.data);

                return `
                    <div class="lista-item" style="padding:10px 0; border-bottom:1px solid #f5f5f5; display:flex; justify-content:space-between; gap:16px;">
                        <div>
                            <span><strong>${escaparHtml(nomeAluno)}</strong></span><br>
                            <small>${escaparHtml(mensagem)}</small><br>
                            <small>${escaparHtml(dataFormatada)}</small>
                        </div>
                        <strong style="color:#b91c1c; white-space:nowrap;">
                            -${valor} moedas
                        </strong>
                    </div>
                `;
            }).join("");
        };

        const inicioPagina = (paginaHistoricoAtual - 1) * ITENS_POR_PAGINA_HISTORICO;
        const itensPagina = historicoOrdenado.slice(
            inicioPagina,
            inicioPagina + ITENS_POR_PAGINA_HISTORICO
        );

        const htmlHome = montarHtml(historicoOrdenado.slice(0, 4), "Nenhuma distribuição recente.");
        const htmlLista = montarHtml(itensPagina, "Nenhuma distribuição realizada.");

        const historicoHome = document.getElementById("historicoHome");
        const historicoLista = document.getElementById("historicoLista");

        if (historicoHome) {
            historicoHome.innerHTML = htmlHome;
        }

        if (historicoLista) {
            historicoLista.innerHTML = htmlLista;
        }

        renderizarPaginacaoHistorico();

    } catch (error) {
        console.error(error);

        const historicoHome = document.getElementById("historicoHome");
        const historicoLista = document.getElementById("historicoLista");

        if (historicoHome) {
            historicoHome.innerHTML = "<p>Histórico indisponível no momento.</p>";
        }

        if (historicoLista) {
            historicoLista.innerHTML = "<p>Não foi possível carregar o histórico. Verifique a URL do transacao-service.</p>";
        }
    }
}

function renderizarPaginacaoHistorico() {
    const paginacao = document.getElementById("paginacaoHistorico");
    if (!paginacao) return;

    const totalPaginas = Math.ceil(historicoCompleto.length / ITENS_POR_PAGINA_HISTORICO);
    if (totalPaginas <= 1) {
        paginacao.innerHTML = "";
        return;
    }

    paginacao.innerHTML = `
        <button type="button" onclick="mudarPaginaHistorico(-1)" ${paginaHistoricoAtual === 1 ? "disabled" : ""}>
            <i class="ph ph-caret-left"></i>
            Anterior
        </button>
        <span>Página ${paginaHistoricoAtual} de ${totalPaginas}</span>
        <button type="button" onclick="mudarPaginaHistorico(1)" ${paginaHistoricoAtual === totalPaginas ? "disabled" : ""}>
            Próxima
            <i class="ph ph-caret-right"></i>
        </button>
    `;
}

function mudarPaginaHistorico(direcao) {
    const totalPaginas = Math.ceil(historicoCompleto.length / ITENS_POR_PAGINA_HISTORICO);
    paginaHistoricoAtual = Math.min(
        Math.max(1, paginaHistoricoAtual + direcao),
        Math.max(1, totalPaginas)
    );

    carregarHistorico();
}

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    localStorage.removeItem("professorIdLogado");
    window.location.href = "coin4students.html";
}

// ==========================================
// BOTÃO MOSTRAR/OCULTAR SENHA
// ==========================================
function criarBotaoOlhinho(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const wrapper = document.createElement("div");
    wrapper.style.cssText =
        "position:relative; display:flex; align-items:center;";

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
        btn.innerHTML = isPassword
            ? olhinhoFechado()
            : olhinhoAberto();
    });

    btn.addEventListener("mouseenter", () => {
        btn.style.opacity = "1";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.opacity = "0.8";
    });

    wrapper.appendChild(btn);
}

function olhinhoAberto() {
    return `
        <svg width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    `;
}

function olhinhoFechado() {
    return `
        <svg width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
    `;
}
