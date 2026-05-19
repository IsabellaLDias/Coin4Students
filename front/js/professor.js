
const PROFESSOR_API = "https://professor-service-0rvu.onrender.com/professores";
const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";

let dadosDoProfessorGlobal = null;
let alunosDisponiveis = [];

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
        document.getElementById("valorSaldo").innerText = professor.saldoMoedas || 0;

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
    document.getElementById("perfilDepartamento").value = professor.departamento || "";
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
                    .slice(0, 5)
                    .map(aluno => `
                        <div class="lista-item"
                             style="padding:10px 0; border-bottom:1px solid #f5f5f5;">
                            ${aluno.nome}
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
            throw new Error("Erro ao distribuir moedas");
        }

        // Atualiza saldo local
        dadosDoProfessorGlobal.saldoMoedas -= quantidade;
        document.getElementById("valorSaldo").innerText =
            dadosDoProfessorGlobal.saldoMoedas;
        document.getElementById("perfilSaldo").value =
            dadosDoProfessorGlobal.saldoMoedas;

        // Limpa formulário
        document.getElementById("formDistribuir").reset();

        showToast("Moedas enviadas com sucesso!", "success");

        // Recarrega histórico
        await carregarHistorico();

    } catch (error) {
        console.error(error);
        showToast("Erro ao distribuir moedas.", "error");
    }
}

// ==========================================
// HISTÓRICO
// ==========================================
async function carregarHistorico() {
    try {
        // Endpoint esperado:
        // GET /professores/{id}/historico
        const response = await fetch(
            `${PROFESSOR_API}/${dadosDoProfessorGlobal.id}/historico`
        );

        if (!response.ok) {
            throw new Error("Erro ao buscar histórico");
        }

        const historico = await response.json();

        let html = "";

        if (!historico || historico.length === 0) {
            html = "<p>Nenhuma distribuição realizada.</p>";
        } else {
            historico.forEach(item => {
                const dataFormatada = item.data
                    ? new Date(item.data).toLocaleDateString("pt-BR")
                    : "";

                html += `
                    <div class="lista-item"
                         style="padding:10px 0; border-bottom:1px solid #f5f5f5; display:flex; justify-content:space-between;">
                        <div>
                            <span>
                                ${item.alunoNome || "Aluno"} - ${item.descricao || item.motivo || ""}
                            </span><br>
                            <small>${dataFormatada}</small>
                        </div>
                        <strong style="color: green;">
                            -${item.valor || item.quantidade || 0} moedas
                        </strong>
                    </div>
                `;
            });
        }

        const historicoHome = document.getElementById("historicoHome");
        const historicoLista = document.getElementById("historicoLista");

        if (historicoHome) {
            historicoHome.innerHTML = html;
        }

        if (historicoLista) {
            historicoLista.innerHTML = html;
        }

    } catch (error) {
        console.error(error);

        const historicoHome = document.getElementById("historicoHome");
        const historicoLista = document.getElementById("historicoLista");

        if (historicoHome) {
            historicoHome.innerHTML = "<p>Nenhuma distribuição recente.</p>";
        }

        if (historicoLista) {
            historicoLista.innerHTML = "<p>Nenhuma distribuição encontrada.</p>";
        }
    }
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
