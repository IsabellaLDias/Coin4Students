const ALUNO_API = "https://aluno-service-orux.onrender.com/alunos";
const EMPRESA_API = "https://empresa-service.onrender.com/empresas";

// ==========================================
// FUNÇÕES DE MÁSCARA
// ==========================================
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarRG(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    if (value.length > 8) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    } else if (value.length > 5) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarCNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    
    if (value.length > 12) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{3})/, '$1.$2');
    }
    
    input.value = value;
}

function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    input.value = value;
}

async function buscarEnderecoPerfil(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        return;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error('Erro na busca do CEP');
        }
        
        const data = await response.json();
        
        if (data.erro) {
            showToast('CEP não encontrado. Verifique o código digitado.', 'error');
            return;
        }

        document.getElementById('perfilEndereco').value = data.logradouro || '';
        document.getElementById('perfilBairro').value = data.bairro || '';
        document.getElementById('perfilCidade').value = data.localidade || '';
        document.getElementById('perfilEstado').value = data.uf || '';

        document.getElementById('perfilNumero').focus();
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showToast('Erro ao buscar endereço. Tente novamente.', 'error');
    }
}

function combinarEnderecoPerfil() {
    const endereco = document.getElementById('perfilEndereco').value;
    const numero = document.getElementById('perfilNumero').value;
    const bairro = document.getElementById('perfilBairro').value;
    const cidade = document.getElementById('perfilCidade').value;
    const estado = document.getElementById('perfilEstado').value;
    const cep = document.getElementById('perfilCEP').value;
    
    let enderecoCompleto = '';
    if (endereco) enderecoCompleto += endereco;
    if (numero) enderecoCompleto += `, ${numero}`;
    if (bairro) enderecoCompleto += ` - ${bairro}`;
    if (cidade) enderecoCompleto += `, ${cidade}`;
    if (estado) enderecoCompleto += `/${estado}`;
    if (cep) enderecoCompleto += ` - CEP: ${cep}`;
    
    return enderecoCompleto.trim();
}

function separarEndereco(enderecoCompleto) {
    const dados = {
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
    };
    
    if (!enderecoCompleto) return dados;

    const cepMatch = enderecoCompleto.match(/CEP:\s*([\d-]+)/);
    if (cepMatch) {
        dados.cep = cepMatch[1];
        enderecoCompleto = enderecoCompleto.replace(/ - CEP:\s*[\d-]+/, '').trim();
    }

    const estadoMatch = enderecoCompleto.match(/\/([A-Z]{2})$/);
    if (estadoMatch) {
        dados.estado = estadoMatch[1];
        enderecoCompleto = enderecoCompleto.replace(/\/[A-Z]{2}$/, '').trim();
    }

    const partes = enderecoCompleto.split(/,\s*|\s*-\s*/);
    
    if (partes.length >= 1) dados.endereco = partes[0] || '';
    if (partes.length >= 2) dados.numero = partes[1] || '';
    if (partes.length >= 3) dados.bairro = partes[2] || '';
    if (partes.length >= 4) dados.cidade = partes[3] || '';
    
    return dados;
}

// ==========================================

let dadosDoAlunoGlobal = null;

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
        endereco: combinarEnderecoPerfil(),
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
        const transacoesOrdenadas = Array.isArray(transacoes)
            ? [...transacoes].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))
            : [];

        const montarHtml = (itens, mensagemVazia) => {
            if (!itens || itens.length === 0) {
                return `<p>${mensagemVazia}</p>`;
            }

            return itens.map(t => {
                const nomeProfessor = t.nomeProfessor || `Professor #${t.idProfessor || ""}`;
                const mensagem = t.mensagem || t.descricao || "Recebimento de moedas";
                const valor = t.valor || 0;
                const dataFormatada = formatarData(t.data);

                return `
                    <div class="lista-item" style="padding:10px 0; border-bottom:1px solid #f5f5f5; display:flex; justify-content:space-between; gap:16px;">
                        <div>
                            <span><strong>${escaparHtml(nomeProfessor)}</strong></span><br>
                            <small>${escaparHtml(mensagem)}</small><br>
                            <small>${escaparHtml(dataFormatada)}</small>
                        </div>
                        <strong style="color:#15803d; white-space:nowrap;">+${valor} moedas</strong>
                    </div>`;
            }).join("");
        };

        document.getElementById("extratoHome").innerHTML =
            montarHtml(transacoesOrdenadas.slice(0, 5), "Sem transacoes recentes.");
        document.getElementById("extratoLista").innerHTML =
            montarHtml(transacoesOrdenadas, "Nenhuma transacao encontrada.");
        return;
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
