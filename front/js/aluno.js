const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

let dadosDoAlunoGlobal = null;

document.addEventListener("DOMContentLoaded", async () => {
    const alunoId = localStorage.getItem("alunoIdLogado");

    if (!alunoId) {
        window.location.href = "coin4students.html";
        return;
    }

    try {
        const response = await fetch(`${ALUNO_API}/${alunoId}`);
        
        if (response.ok) {
            const aluno = await response.json();
            dadosDoAlunoGlobal = aluno;

            document.getElementById("nomeAluno").innerText = aluno.nome;
            document.getElementById("valorSaldo").innerText = aluno.saldoMoedas;

            preencherCamposFormulario(aluno);
            carregarVantagens();
            carregarExtrato();

            criarBotaoOlhinhoPerfil();
            criarBotaoOlhinho("perfilNovaSenha");
            criarBotaoOlhinho("perfilConfirmarSenha");
        } else {
            throw new Error("Erro ao buscar dados do aluno");
        }

    } catch (error) {
        console.error("Erro:", error);
        showToast("Sessão inválida. Faça login novamente.", 'error');
        setTimeout(() => logout(), 2000);
    }
});

function preencherCamposFormulario(aluno) {
    document.getElementById("perfilNome").value = aluno.nome || "";
    document.getElementById("perfilEmail").value = aluno.email || "";
    document.getElementById("perfilEndereco").value = aluno.endereco || "";
    document.getElementById("perfilCPF").value = aluno.cpf || "";
    document.getElementById("perfilRG").value = aluno.rg || "";
    document.getElementById("perfilInstituicao").value = aluno.curso || "";
}

async function atualizarPerfil() {
    if (!dadosDoAlunoGlobal) return;

    const novaSenha = document.getElementById("perfilNovaSenha").value;
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value;

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
        ...dadosDoAlunoGlobal,
        nome: document.getElementById("perfilNome").value,
        email: document.getElementById("perfilEmail").value,
        endereco: document.getElementById("perfilEndereco").value,
        curso: document.getElementById("perfilInstituicao").value
    };

    if (novaSenha) {
        dadosAtualizados.senha = novaSenha;
    }

    try {
        const response = await fetch(`${ALUNO_API}/${dadosDoAlunoGlobal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            document.getElementById("perfilNovaSenha").value = "";
            document.getElementById("perfilConfirmarSenha").value = "";
            showToast("Perfil atualizado com sucesso!", 'success');
            setTimeout(() => location.reload(), 1500);
        }
    } catch (error) {
        showToast("Erro ao conectar com o servidor.", 'error');
    }
}

function excluirConta() {
    document.getElementById('confirmModal').style.display = 'flex';
}

function fecharConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

async function confirmarExclusao() {
    fecharConfirmModal();
    try {
        const response = await fetch(`${ALUNO_API}/${dadosDoAlunoGlobal.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            showToast("Conta excluída.", 'info');
            setTimeout(() => logout(), 1500);
        }
    } catch (error) {
        showToast("Erro ao excluir.", 'error');
    }
}

function trocarTab(tab) {
    const secoes = ['home', 'extrato', 'vantagens', 'perfil'];
    secoes.forEach(s => {
        document.getElementById(`secao-${s}`).style.display = 'none';
        const btn = document.getElementById(`btn-${s}`);
        if(btn) btn.classList.remove('active');
    });

    document.getElementById(`secao-${tab}`).style.display = 'block';
    const btnAtivo = document.getElementById(`btn-${tab}`);
    if(btnAtivo) btnAtivo.classList.add('active');
}

async function carregarVantagens() {
    try {
        const response = await fetch("https://empresa-service.onrender.com/vantagens");
        if (!response.ok) throw new Error("Erro ao buscar vantagens");
        
        const vantagens = await response.json();
        let html = "";

        if (vantagens.length === 0) {
            html = "<p>Nenhuma vantagem cadastrada no momento.</p>";
        } else {
            vantagens.forEach(v => {
                html += `
                    <div class="vantagem-card" style="border-bottom:1px solid #eee; padding:10px 0; display:flex; justify-content:space-between; align-items:center;">
                        <span><strong>${v.nome}</strong> (${v.valor} moedas)</span>
                        <button class="btn-resgatar" onclick="resgatarVantagem(${v.id}, ${v.valor})">Resgatar</button>
                    </div>`;
            });
        }

        document.getElementById("vantagensHome").innerHTML = html;
        document.getElementById("vantagensLista").innerHTML = html;
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("vantagensHome").innerHTML = "Erro ao carregar vantagens.";
    }
}

async function carregarExtrato() {
    try {
        const response = await fetch(`${ALUNO_API}/${dadosDoAlunoGlobal.id}/extrato`);
        if (!response.ok) throw new Error("Erro ao buscar extrato");

        const transacoes = await response.json();
        let html = "";

        if (transacoes.length === 0) {
            html = "<p>Nenhuma transação encontrada.</p>";
        } else {
            transacoes.forEach(t => {
                const cor = t.tipo === 'RECEBIDO' ? 'green' : 'red';
                const sinal = t.tipo === 'RECEBIDO' ? '+' : '-';
                html += `
                    <div class="lista-item" style="padding:10px 0; border-bottom: 1px solid #f5f5f5; display:flex; justify-content:space-between;">
                        <div>
                            <span>${t.descricao}</span><br>
                            <small>${new Date(t.data).toLocaleDateString()}</small>
                        </div>
                        <strong style="color:${cor}">${sinal}${t.valor} moedas</strong>
                    </div>`;
            });
        }

        document.getElementById("extratoHome").innerHTML = html;
        document.getElementById("extratoLista").innerHTML = html;
    } catch (error) {
        document.getElementById("extratoHome").innerHTML = "Sem transações recentes.";
    }
}

async function resgatarVantagem(vantagemId, valor) {
    if (dadosDoAlunoGlobal.saldoMoedas < valor) {
        showToast("Saldo insuficiente, diva! 💸", 'error');
        return;
    }

    if (confirm("Deseja resgatar esta vantagem?")) {
        showToast("Resgate realizado! O código foi enviado para o seu e-mail.", 'success');
    }
}

function criarBotaoOlhinhoPerfil() {
    const senhaInput = document.getElementById("perfilSenha");
    if (!senhaInput) return;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:relative; display:flex; align-items:center;";
    senhaInput.parentNode.insertBefore(wrapper, senhaInput);
    wrapper.appendChild(senhaInput);

    senhaInput.style.paddingRight = "42px";
    senhaInput.style.width = "100%";

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
    `;
    btn.innerHTML = olhinhoAberto();

    btn.addEventListener("click", () => {
        const isPassword = senhaInput.type === "password";
        senhaInput.type = isPassword ? "text" : "password";
        btn.innerHTML = isPassword ? olhinhoFechado() : olhinhoAberto();
    });

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

function logout() {
    localStorage.removeItem("alunoIdLogado");
    window.location.href = "coin4students.html";
}

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