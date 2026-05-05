let dadosDoAlunoGlobal = null;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Busca o ID que foi salvo lá no momento do cadastro ou login
    const alunoId = localStorage.getItem("alunoIdLogado");

    // 2. Se não tiver ID, manda de volta para a tela inicial
    if (!alunoId) {
        window.location.href = "coin4students.html";
        return;
    }

    try {
        // 3. Busca os dados desse aluno específico
        const response = await fetch(`http://localhost:8080/alunos/${alunoId}`);
        
        if (response.ok) {
            const aluno = await response.json();
            dadosDoAlunoGlobal = aluno;

            // Atualiza a interface
            document.getElementById("nomeAluno").innerText = aluno.nome;
            document.getElementById("valorSaldo").innerText = aluno.saldoMoedas;

            // Preenche o formulário de perfil
            preencherCamposFormulario(aluno);

            // Carrega as listas
            carregarVantagens();
            carregarExtrato();
        } else {
            throw new Error("Erro ao buscar dados do aluno");
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Sessão inválida. Faça login novamente.");
        logout();
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

    const dadosAtualizados = {
        ...dadosDoAlunoGlobal, // Mantém dados sensíveis como senha e saldo
        nome: document.getElementById("perfilNome").value,
        email: document.getElementById("perfilEmail").value,
        endereco: document.getElementById("perfilEndereco").value,
        curso: document.getElementById("perfilInstituicao").value
        // CPF e RG geralmente não mudam, mas se mudar no form, adicione aqui
    };

    try {
        const response = await fetch(`http://localhost:8080/alunos/${dadosDoAlunoGlobal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            alert("Perfil atualizado com sucesso!");
            location.reload(); 
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
}

async function excluirConta() {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é permanente!")) {
        try {
            const response = await fetch(`http://localhost:8080/alunos/${dadosDoAlunoGlobal.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Conta excluída.");
                logout();
            }
        } catch (error) {
            alert("Erro ao excluir.");
        }
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

// 1. Carregar Vantagens do Back-end (Empresa Service na porta 8081)
async function carregarVantagens() {
    try {
        const response = await fetch("http://localhost:8081/vantagens"); // URL do seu serviço de empresas/vantagens
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

// 2. Carregar Extrato Real do Aluno
async function carregarExtrato() {
    try {
        // Supondo que você tenha um endpoint de extrato no seu aluno-service
        const response = await fetch(`http://localhost:8080/alunos/${dadosDoAlunoGlobal.id}/extrato`);
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
        // Se ainda não tiver o endpoint de extrato, deixamos uma mensagem amigável
        document.getElementById("extratoHome").innerHTML = "Sem transações recentes.";
    }
}

// 3. Função extra: Resgatar Vantagem (Lógica da Sprint 2)
async function resgatarVantagem(vantagemId, valor) {
    if (dadosDoAlunoGlobal.saldoMoedas < valor) {
        alert("Saldo insuficiente, diva! 💸");
        return;
    }

    if (confirm("Deseja resgatar esta vantagem?")) {
        // Aqui você faria um POST para o seu service de transações/resgates
        alert("Resgate realizado! O código foi enviado para o seu e-mail.");
        // O ideal aqui é atualizar o saldo no banco e dar um location.reload()
    }
}

function logout() {
    localStorage.removeItem("alunoIdLogado");
    window.location.href = "coin4students.html";
}