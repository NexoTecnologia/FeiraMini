// ===== STORAGE (LOCALSTORAGE) =====
const Storage = {
    // Inicializar dados se não existirem
    init() {
        if (!localStorage.getItem('feiraMini')) {
            const dadosIniciais = {
                produtos: [ ],
                feiras: [],
                caixas: {},
                fechamentos: {},
                financeiro: {},
                historicoVendas: {}
            };
            localStorage.setItem('feiraMini', JSON.stringify(dadosIniciais));
        }
    },

    // ===== PRODUTOS =====
    getProdutos() {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [] };
        if (!dados.produtos) dados.produtos = [];
        return dados.produtos;
    },

    addProduto(produto) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.produtos) dados.produtos = [];
        produto.id = Date.now();
        dados.produtos.push(produto);
        localStorage.setItem('feiraMini', JSON.stringify(dados));
        return produto;
    },

    updateProduto(id, novosDados) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.produtos) dados.produtos = [];
        const index = dados.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
            dados.produtos[index] = { ...dados.produtos[index], ...novosDados };
            localStorage.setItem('feiraMini', JSON.stringify(dados));
            return true;
        }
        return false;
    },

    deleteProduto(id) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.produtos) dados.produtos = [];
        dados.produtos = dados.produtos.filter(p => p.id !== id);
        localStorage.setItem('feiraMini', JSON.stringify(dados));
    },

    // ===== FEIRAS =====
    getFeiras() {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { feiras: [] };
        if (!dados.feiras) dados.feiras = [];
        return dados.feiras;
    },

    addFeira(feira) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.feiras) dados.feiras = [];
        feira.id = Date.now();
        dados.feiras.push(feira);
        localStorage.setItem('feiraMini', JSON.stringify(dados));
        return feira;
    },

    updateFeira(id, novosDados) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.feiras) dados.feiras = [];
        const index = dados.feiras.findIndex(f => f.id === id);
        if (index !== -1) {
            dados.feiras[index] = { ...dados.feiras[index], ...novosDados };
            localStorage.setItem('feiraMini', JSON.stringify(dados));
            return true;
        }
        return false;
    },

    deleteFeira(id) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { produtos: [], feiras: [], caixas: {}, fechamentos: {} };
        if (!dados.feiras) dados.feiras = [];
        dados.feiras = dados.feiras.filter(f => f.id !== id);
        localStorage.setItem('feiraMini', JSON.stringify(dados));
    },

    // ===== CAIXA POR FEIRA =====
    getCaixa(feiraId) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { caixas: {} };
        if (!dados.caixas) dados.caixas = {};
        return dados.caixas[feiraId] || null;
    },

    abrirCaixa(feiraId, valorInicial) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { caixas: {} };
        if (!dados.caixas) dados.caixas = {};
        
        dados.caixas[feiraId] = {
            status: 'aberto',
            abertura: new Date().toLocaleString('pt-BR'),
            valorInicial: valorInicial,
            vendas: [],
            movimentacoes: [
                {
                    tipo: 'abertura',
                    descricao: 'Abertura de caixa',
                    valor: valorInicial,
                    data: new Date().toLocaleString('pt-BR')
                }
            ],
            totalVendas: 0,
            totalSaidas: 0,
            saldoAtual: valorInicial
        };
        
        localStorage.setItem('feiraMini', JSON.stringify(dados));
        return dados.caixas[feiraId];
    },

    fecharCaixa(feiraId) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { caixas: {} };
        if (!dados.caixas || !dados.caixas[feiraId]) return null;
        
        dados.caixas[feiraId].status = 'fechado';
        dados.caixas[feiraId].fechamento = new Date().toLocaleString('pt-BR');
        
        localStorage.setItem('feiraMini', JSON.stringify(dados));
        return dados.caixas[feiraId];
    },

    registrarMovimentacao(feiraId, tipo, descricao, valor) {
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || { caixas: {} };
    if (!dados.caixas || !dados.caixas[feiraId] || dados.caixas[feiraId].status !== 'aberto') return null;
    
    const caixa = dados.caixas[feiraId];
    
    caixa.movimentacoes.push({
        tipo: tipo,
        descricao: descricao,
        valor: valor,
        data: new Date().toLocaleString('pt-BR')
    });
    
    // Atualizar saldo (permitir negativo)
    if (tipo === 'entrada' || tipo === 'venda') {
        caixa.saldoAtual += valor;
        if (tipo === 'venda') caixa.totalVendas += valor;
    } else if (tipo === 'saida') {
        caixa.saldoAtual -= valor;
        caixa.totalSaidas += valor;
    }
    
    localStorage.setItem('feiraMini', JSON.stringify(dados));
    return caixa;
    },

    getMovimentacoes(feiraId) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { caixas: {} };
        if (!dados.caixas || !dados.caixas[feiraId]) return [];
        return dados.caixas[feiraId].movimentacoes || [];
    },

    // ===== FECHAMENTOS DE CAIXA =====
    registrarFechamento(feiraId, dadosFechamento) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { fechamentos: {} };
        if (!dados.fechamentos) dados.fechamentos = {};
        if (!dados.fechamentos[feiraId]) dados.fechamentos[feiraId] = [];
        
        dados.fechamentos[feiraId].push({
            ...dadosFechamento,
            id: Date.now(),
            dataFechamento: new Date().toLocaleString('pt-BR'),
            timestamp: Date.now()
        });
        
        localStorage.setItem('feiraMini', JSON.stringify(dados));
    },

    getFechamentos(feiraId, limite = null) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { fechamentos: {} };
        if (!dados.fechamentos || !dados.fechamentos[feiraId]) return [];
        
        let fechamentos = dados.fechamentos[feiraId].sort((a, b) => b.timestamp - a.timestamp);
        
        if (limite) {
            fechamentos = fechamentos.slice(0, limite);
        }
        
        return fechamentos;
    },

    buscarFechamentosPorData(feiraId, dataInicio, dataFim) {
        const dados = JSON.parse(localStorage.getItem('feiraMini')) || { fechamentos: {} };
        if (!dados.fechamentos || !dados.fechamentos[feiraId]) return [];
        
        return dados.fechamentos[feiraId].filter(f => {
            const dataFechamento = new Date(f.timestamp);
            return dataFechamento >= dataInicio && dataFechamento <= dataFim;
        }).sort((a, b) => b.timestamp - a.timestamp);
    }
};

// ===== FUNÇÕES DO SISTEMA =====
const abas = document.querySelectorAll('.aba');
const views = {
    dashboard: document.getElementById('viewDashboard'),
    feiras: document.getElementById('viewFeiras'),
    produtos: document.getElementById('viewProdutos'),
    pdv: document.getElementById('viewPdv'),
    caixa: document.getElementById('viewCaixa'),
    relatorios: document.getElementById('viewRelatorios'),
    ajuda: document.getElementById('viewAjuda')  
};

// Navegação entre abas
abas.forEach(aba => {
    aba.addEventListener('click', () => {
        abas.forEach(a => a.classList.remove('ativa'));
        aba.classList.add('ativa');
        
        Object.values(views).forEach(view => view.classList.remove('ativa'));
        
        const view = aba.dataset.view;
        if (views[view]) {
            views[view].classList.add('ativa');
        }
        
        toggleMenu(false);
    });
});

// Menu Hamburguer
function toggleMenu(force) {
    const menu = document.getElementById('sideMenu');
    const overlay = document.querySelector('.menu-overlay');
    
    if (force === false) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        menu.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Mudar seção pelo menu
function mudarSecao(secaoId) {
    console.log('Mudando para seção:', secaoId);
    
    // Fechar o menu
    toggleMenu(false);
    
    // Remover classe ativa de todas as abas
    abas.forEach(a => a.classList.remove('ativa'));
    
    // Esconder todas as views
    Object.values(views).forEach(view => {
        if (view) view.classList.remove('ativa');
    });
    
    // Mostrar a view correspondente
    if (views[secaoId]) {
        views[secaoId].classList.add('ativa');
        
        // Recarregar dados específicos
        if (secaoId === 'feiras') {
            carregarFeiras();
        } else if (secaoId === 'produtos') {
            carregarProdutos();
        } else if (secaoId === 'relatorios') {
            carregarRelatorios();
        } else if (secaoId === 'ajuda') {
            // Ajuda não precisa carregar dados específicos
            console.log('Central de Ajuda aberta');
        } else if (secaoId === 'dashboard') {
            carregarDashboard();
            atualizarGrafico();
        }

        // Se for uma das abas principais, marcar a aba correspondente
        const abasPrincipais = ['dashboard', 'pdv', 'caixa'];
        if (abasPrincipais.includes(secaoId)) {
            const abaCorrespondente = Array.from(abas).find(a => a.dataset.view === secaoId);
            if (abaCorrespondente) {
                abaCorrespondente.classList.add('ativa');
            }
        }
    } else {
        console.error('View não encontrada:', secaoId);
        // Fallback: mostrar dashboard
        if (views.dashboard) {
            views.dashboard.classList.add('ativa');
            const abaDashboard = Array.from(abas).find(a => a.dataset.view === 'dashboard');
            if (abaDashboard) abaDashboard.classList.add('ativa');
        }
    }
}

// Busca de produtos
const buscaProdutos = document.getElementById('buscaProdutos');
if (buscaProdutos) {
    buscaProdutos.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const produtos = document.querySelectorAll('#viewProdutos .produto-item');
        
        produtos.forEach(prod => {
            const nome = prod.querySelector('.nome-produto').textContent.toLowerCase();
            prod.style.display = nome.includes(termo) ? 'flex' : 'none';
        });
    });
}

// Busca no PDV
function buscarProdutosPdv() {
    const termo = document.getElementById('buscaPdv').value.toLowerCase();
    const produtos = document.querySelectorAll('.produto-pdv-item');
    
    produtos.forEach(prod => {
        const nome = prod.querySelector('.produto-pdv-nome').textContent.toLowerCase();
        prod.style.display = nome.includes(termo) ? 'flex' : 'none';
    });
}

// Modais
function abrirModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    
    // Se for o modal de seleção de feiras, carregar lista
    if (modalId === 'modalFeiras') {
        carregarModalSelecionarFeira();
        // Limpar busca
        const buscaInput = document.getElementById('buscaFeiras');
        if (buscaInput) buscaInput.value = '';
    }
}

function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    if (modalId === 'modalProduto') {
        document.querySelector('#modalProduto .modal-header h3').textContent = 'Novo Produto';
        delete document.getElementById('modalProduto').dataset.editando;
        document.getElementById('produtoNome').value = '';
        document.getElementById('produtoPreco').value = '';
    }
    
    if (modalId === 'modalFeira') {
        limparFormularioFeira();
    }
}

// Funções do sistema
let caixaStatus = 'fechado';
let carrinho = [];

function selecionarFeira(id) {
    const feira = Storage.getFeiras().find(f => f.id === id);
    
    if (feira) {
        // Salvar ID da feira ativa no localStorage
        localStorage.setItem('feiraAtivaId', id);
        
        // Atualizar interface
        document.querySelector('.feira-nome').textContent = feira.nome;
        
        // Formatar periodicidade
        if (feira.periodicidade) {
            document.querySelector('.feira-data').innerHTML = feira.periodicidade;
        } else {
            document.querySelector('.feira-data').innerHTML = 'Periodicidade não definida';
        }
        
        fecharModal('modalFeiras');
        mostrarToast(`Feira ${feira.nome} selecionada!`);
        
        // Recarregar dados da feira
        carregarCaixa();
        carregarDashboard(); 
        atualizarGrafico();
        carregarProdutosPDV();
        carregarDadosFeira(id);
    }
}

function editarFeira(id) {
    abrirModal('modalFeira');
}

function excluirFeira(id) {
    if (confirm('Excluir esta feira?')) {
        mostrarToast('Feira excluída!');
    }
}

function carregarDadosFeira(feiraId) {
    // Aqui você pode carregar vendas, caixa, etc específicos da feira
   
    // Exemplo: Atualizar resumo com dados da feira
    const feira = Storage.getFeiras().find(f => f.id === feiraId);
    
    if (feira) {
        // Atualizar cards de resumo com informações da feira
        // (implementar conforme necessidade)
    }
}

// ===== FUNÇÃO PARA CARREGAR FEIRA ATIVA AO INICIAR =====
function carregarFeiraAtiva() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const feira = Storage.getFeiras().find(f => f.id === feiraAtivaId);
    
    if (feira) {
        document.querySelector('.feira-nome').textContent = feira.nome;
        if (feira.periodicidade) {
            document.querySelector('.feira-data').innerHTML = feira.periodicidade;
        }
    } else {
        // Se a feira ativa não existir (foi excluída), pegar a primeira
        const feiras = Storage.getFeiras();
        if (feiras.length > 0) {
            localStorage.setItem('feiraAtivaId', feiras[0].id);
            document.querySelector('.feira-nome').textContent = feiras[0].nome;
            if (feiras[0].periodicidade) {
                document.querySelector('.feira-data').innerHTML = feiras[0].periodicidade;
            }
        }
    }
}

function editarProduto(id) {
    const produto = Storage.getProdutos().find(p => p.id === id);
    
    if (produto) {
        // Preencher formulário
        document.getElementById('produtoNome').value = produto.nome;
        document.getElementById('produtoPreco').value = produto.preco;
        
        // Marcar que está editando
        document.getElementById('modalProduto').dataset.editando = id;
        
        // Mudar título do modal
        document.querySelector('#modalProduto .modal-header h3').textContent = 'Editar Produto';
        
        // Abrir modal
        abrirModal('modalProduto');
    }
}

function excluirProduto(id) {
    if (confirm('Excluir este produto?')) {
        Storage.deleteProduto(id);
        carregarProdutos();
        mostrarToast('Produto excluído!');
    }
}

function adicionarAoCarrinho(id) {
    carrinho.push({id});
    mostrarToast('Produto adicionado!');
}

function finalizarVenda() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    mostrarToast('Venda finalizada!');
    carrinho = [];
}

function abrirCaixa() {
    caixaStatus = 'aberto';
    document.getElementById('btnAbrirCaixa').style.display = 'none';
    document.getElementById('btnFecharCaixa').style.display = 'flex';
    document.getElementById('caixaAtivo').style.display = 'block';
    mostrarToast('Caixa aberto!');
}

function fecharCaixa() {
    if (confirm('Fechar caixa?')) {
        caixaStatus = 'fechado';
        document.getElementById('btnAbrirCaixa').style.display = 'flex';
        document.getElementById('btnFecharCaixa').style.display = 'none';
        document.getElementById('caixaAtivo').style.display = 'none';
        mostrarToast('Caixa fechado!');
    }
}

function registrarEntrada() {
    const valor = prompt('Valor da entrada:');
    if (valor) mostrarToast(`Entrada de R$ ${valor}`);
}

function registrarSaida() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (!caixaAtual || caixaAtual.status !== 'aberto') {
        alert('Caixa não está aberto!');
        return;
    }
    
    // Criar modal para saída
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Registrar Saída</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Descrição da saída</label>
                    <input type="text" id="descricaoSaida" class="form-control" placeholder="Ex: Compra de ingredientes" autofocus>
                </div>
                <div class="form-group">
                    <label>Valor (R$)</label>
                    <input type="number" id="valorSaida" class="form-control" placeholder="0,00" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="categoriaSaida" class="form-control">
                        <option value="insumos">Insumos/Ingredientes</option>
                        <option value="transporte">Transporte</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="contas">Contas (água, luz)</option>
                        <option value="impostos">Impostos/Taxas</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                
                <div id="avisoSaldo" style="display: none; margin-top: 10px; padding: 10px; background: #fff3e0; border-radius: 12px; border-left: 3px solid #e65100;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #e65100;"></i>
                        <span style="font-size: 13px; color: #e65100;">
                            ⚠️ Atenção: Esta saída deixará o caixa negativo.
                        </span>
                    </div>
                    <p style="font-size: 12px; color: #e65100; margin-top: 5px;">
                        Saldo atual: <strong id="saldoAtualMsg">R$ 0,00</strong>
                    </p>
                </div>
            </div>
            
            <button class="btn-salvar" id="btnConfirmarSaida" style="background: #b33f3f;">Registrar Saída</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const valorInput = modal.querySelector('#valorSaida');
    const avisoSaldo = modal.querySelector('#avisoSaldo');
    const saldoAtualMsg = modal.querySelector('#saldoAtualMsg');
    
    // Atualizar saldo atual
    saldoAtualMsg.textContent = `R$ ${caixaAtual.saldoAtual.toFixed(2)}`;
    
    // Verificar se vai ficar negativo
    valorInput.addEventListener('input', () => {
        const valor = parseFloat(valorInput.value) || 0;
        if (valor > caixaAtual.saldoAtual) {
            avisoSaldo.style.display = 'block';
        } else {
            avisoSaldo.style.display = 'none';
        }
    });
    
    const btnConfirmar = modal.querySelector('#btnConfirmarSaida');
    btnConfirmar.addEventListener('click', () => {
        const descricao = modal.querySelector('#descricaoSaida').value;
        const valor = parseFloat(modal.querySelector('#valorSaida').value);
        const categoria = modal.querySelector('#categoriaSaida').value;
        
        if (!descricao) {
            alert('Preencha a descrição da saída!');
            return;
        }
        
        if (!valor || valor <= 0) {
            alert('Valor inválido!');
            return;
        }
        
        // Registrar saída (permitir mesmo com saldo negativo)
        const categoriaNomes = {
            'insumos': 'Insumos',
            'transporte': 'Transporte',
            'alimentacao': 'Alimentação',
            'contas': 'Contas',
            'impostos': 'Impostos',
            'outros': 'Outros'
        };
        
        const nomeCategoria = categoriaNomes[categoria] || categoria;
        const descricaoCompleta = `${descricao} (${nomeCategoria})`;
        
        Storage.registrarMovimentacao(feiraAtivaId, 'saida', descricaoCompleta, valor);
        
        // Fechar modal
        modal.remove();
        
        // Recarregar caixa
        carregarCaixa();
        carregarDashboard();
        
        // Mostrar aviso se ficou negativo
        const novoCaixa = Storage.getCaixa(feiraAtivaId);
        if (novoCaixa && novoCaixa.saldoAtual < 0) {
            mostrarToast(`⚠️ Saída registrada! Novo saldo: R$ ${novoCaixa.saldoAtual.toFixed(2)} (negativo)`, 4000);
        } else {
            mostrarToast(`Saída de R$ ${valor.toFixed(2)} registrada!`);
        }
    });
}

function salvarFeira() {
    // Pegar valores do formulário
    const nome = document.getElementById('feiraNome').value;
    const periodicidade = document.getElementById('feiraPeriodicidade').value;
    const contribuicao = document.getElementById('feiraContribuicao').value;
    const tipoContribuicao = document.getElementById('feiraTipoContribuicao').value;
    const outrosCustos = document.getElementById('feiraOutrosCustos').value;
    const endereco = document.getElementById('feiraEndereco').value;
    
    // Validar (apenas nome é obrigatório)
    if (!nome) {
        alert('Nome da feira é obrigatório!');
        return;
    }
    
    // Verificar se é edição ou novo
    const feiraEditando = document.getElementById('modalFeira').dataset.editando;
    
    const dadosFeira = {
        nome: nome,
        periodicidade: periodicidade || '',
        contribuicao: contribuicao ? parseFloat(contribuicao) : null,
        tipoContribuicao: tipoContribuicao || 'diária',
        outrosCustos: outrosCustos ? parseFloat(outrosCustos) : null,
        endereco: endereco || ''
    };
    
    console.log('Salvando feira:', dadosFeira); // DEBUG
    
    if (feiraEditando) {
        Storage.updateFeira(parseInt(feiraEditando), dadosFeira);
        mostrarToast('Feira atualizada!');
    } else {
        Storage.addFeira(dadosFeira);
        mostrarToast('Feira adicionada!');
    }
    
    // Limpar formulário e fechar modal
    limparFormularioFeira();
    fecharModal('modalFeira');
    
    // Recarregar listas
    carregarFeiras();
    carregarDashboard(); 
    atualizarGrafico();   
}

function salvarProduto() {
    // Pegar valores do formulário
    const nome = document.getElementById('produtoNome').value;
    const preco = parseFloat(document.getElementById('produtoPreco').value);
    
    // Validar
    if (!nome || !preco) {
        alert('Preencha nome e preço do produto!');
        return;
    }
    
    if (isNaN(preco) || preco <= 0) {
        alert('Preço inválido!');
        return;
    }
    
    // Verificar se é edição ou novo
    const produtoEditando = document.getElementById('modalProduto').dataset.editando;
    
    if (produtoEditando) {
        Storage.updateProduto(parseInt(produtoEditando), {
            nome: nome,
            preco: preco
        });
        mostrarToast('Produto atualizado!');
    } else {
        Storage.addProduto({
            nome: nome,
            preco: preco
        });
        mostrarToast('Produto adicionado!');
    }
    
    // Limpar formulário e fechar modal
    document.getElementById('produtoNome').value = '';
    document.getElementById('produtoPreco').value = '';
    delete document.getElementById('modalProduto').dataset.editando;
    document.querySelector('#modalProduto .modal-header h3').textContent = 'Novo Produto';
    
    fecharModal('modalProduto');
    
    // Recarregar listas
    carregarProdutos();
    carregarProdutosPDV();
    carregarDashboard();     
    atualizarGrafico(); 
}

function mostrarToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e3b4f;
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        font-size: 14px;
        z-index: 2000;
        animation: fadeInOut 2s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Animação do toast
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, 20px); }
        10%, 90% { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(style);

// ===== CARREGAR PRODUTOS NA TELA =====
// ===== CARREGAR PRODUTOS NA TELA =====
function carregarProdutos() {
    const produtos = Storage.getProdutos();
    const container = document.querySelector('#viewProdutos .produtos-grid');
    
    if (!container) return;
    
    // Limpar container
    container.innerHTML = '';
    
    // Se não houver produtos, mostrar mensagem
    if (produtos.length === 0) {
        container.innerHTML = `
            <div class="vazio">
                <i class="fa-solid fa-box-open"></i>
                <p>Nenhum produto cadastrado</p>
                <p style="font-size: 14px; margin-top: 10px;">Clique em "Novo" para adicionar</p>
            </div>
        `;
        return;
    }
    
    // Listar produtos
    produtos.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'produto-item';
        item.innerHTML = `
            <div class="icone-produto"><i class="fa-solid fa-tag"></i></div>
            <div class="info-produto">
                <div class="nome-produto">${prod.nome}</div>
                <div class="preco-produto">R$ ${prod.preco.toFixed(2)}</div>
            </div>
            <div class="acoes-produto">
                <div class="editar-produto" onclick="editarProduto(${prod.id})"><i class="fa-regular fa-pen-to-square"></i></div>
                <div class="excluir-produto" onclick="excluirProduto(${prod.id})"><i class="fa-regular fa-trash-can"></i></div>
            </div>
        `;
        container.appendChild(item);
    });
    
    // Atualizar também a lista do PDV
    carregarProdutosPDV();
}

// ===== CARREGAR PRODUTOS NO PDV =====
// ===== CARREGAR PRODUTOS NO PDV =====
function carregarProdutosPDV() {
    const produtos = Storage.getProdutos();
    const container = document.getElementById('pdvProdutosLista');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (produtos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-box-open" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhum produto cadastrado</p>
                <p style="font-size: 12px;">Cadastre produtos no menu Configurações</p>
            </div>
        `;
        return;
    }
    
    produtos.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'produto-pdv-item';
        item.setAttribute('onclick', `adicionarAoCarrinho(${prod.id})`);
        item.innerHTML = `
            <div class="produto-pdv-info">
                <span class="produto-pdv-nome">${prod.nome}</span>
                <span class="produto-pdv-preco">R$ ${prod.preco.toFixed(2)}</span>
            </div>
            <i class="fa-solid fa-plus" style="color: #1b6b4c;"></i>
        `;
        container.appendChild(item);
    });
}

// ===== INICIALIZAÇÃO =====
function initApp() {
    console.log('App iniciado');
    
    // Inicializar localStorage
    Storage.init();
    
    // Carregar produtos na tela
    carregarProdutos();
    
    // Carregar feiras na tela
    carregarFeiras();
    
    // Carregar feira ativa
    carregarFeiraAtiva();
    
    // Carregar caixa da feira ativa
    carregarCaixa();
    
    // Carregar produtos no PDV
    carregarProdutosPDV();
    
    // Carregar dashboard com dados reais
    carregarDashboard();
    
    // Inicializar eventos de relatórios
    initRelatoriosEventos();
    
    // Carregar relatórios com pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
        carregarRelatorios();
    }, 100);
    
    console.log('FeiraMini iniciado com sucesso!');
}

// Se estiver no Cordova, aguarda device ready, senão inicia direto
if (window.cordova) {
    document.addEventListener('deviceready', initApp, false);
} else {
    // Está no navegador
    window.addEventListener('load', initApp);
}

// ===== CARREGAR FEIRAS NA TELA =====
function carregarFeiras() {
    const feiras = Storage.getFeiras();
    const container = document.querySelector('#viewFeiras .feiras-list');
    
    if (!container) return;
    
    // Limpar container
    container.innerHTML = '';
    
    // Se não houver feiras, mostrar mensagem
    if (feiras.length === 0) {
        container.innerHTML = `
            <div class="vazio">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>Nenhuma feira cadastrada</p>
                <p style="font-size: 14px; margin-top: 10px;">Clique em "Nova Feira" para adicionar</p>
            </div>
        `;
        return;
    }
    
    // Listar feiras
    feiras.forEach(feira => {
        const item = document.createElement('div');
        item.className = 'feira-item';
        
        // Formatar tipo de contribuição
        const tipoContribuicao = {
            'diária': 'Dia',
            'semanal': 'Semana',
            'mensal': 'Mês',
            'outra': 'Outro'
        }[feira.tipoContribuicao] || '';
        
        item.innerHTML = `
            <div class="icone-feira"><i class="fa-solid fa-calendar-alt"></i></div>
            <div class="info-feira">
                <div class="nome-feira">${feira.nome}</div>
                <div class="periodo-feira">${feira.periodicidade || 'Sem periodicidade'}</div>
                ${feira.contribuicao ? `<div class="proxima-feira"><i class="fa-solid fa-coins"></i> R$ ${feira.contribuicao.toFixed(2)}/${tipoContribuicao}</div>` : ''}
                ${feira.endereco ? `<div class="proxima-feira"><i class="fa-solid fa-location-dot"></i> ${feira.endereco.substring(0, 30)}${feira.endereco.length > 30 ? '...' : ''}</div>` : ''}
            </div>
            <div class="acoes-feira">
                <div class="editar-feira" onclick="editarFeira(${feira.id})"><i class="fa-regular fa-pen-to-square"></i></div>
                <div class="excluir-feira" onclick="excluirFeira(${feira.id})"><i class="fa-regular fa-trash-can"></i></div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ===== FUNÇÕES PARA FEIRAS =====
function salvarFeira() {
    // Pegar valores do formulário
    const nome = document.getElementById('feiraNome').value;
    const periodicidade = document.getElementById('feiraPeriodicidade').value;
    const contribuicao = parseFloat(document.getElementById('feiraContribuicao').value) || 0;
    const tipoContribuicao = document.getElementById('feiraTipoContribuicao').value;
    const outrosCustos = parseFloat(document.getElementById('feiraOutrosCustos').value) || 0;
    const endereco = document.getElementById('feiraEndereco').value;
    
    // Validar (apenas nome é obrigatório)
    if (!nome) {
        alert('Nome da feira é obrigatório!');
        return;
    }
    
    // Verificar se é edição ou novo
    const feiraEditando = document.getElementById('modalFeira').dataset.editando;
    
    const dadosFeira = {
        nome: nome,
        periodicidade: periodicidade,
        contribuicao: contribuicao || null,
        tipoContribuicao: tipoContribuicao,
        outrosCustos: outrosCustos || null,
        endereco: endereco
    };
    
    if (feiraEditando) {
        Storage.updateFeira(parseInt(feiraEditando), dadosFeira);
        mostrarToast('Feira atualizada!');
    } else {
        Storage.addFeira(dadosFeira);
        mostrarToast('Feira adicionada!');
    }
    
    // Limpar formulário e fechar modal
    limparFormularioFeira();
    fecharModal('modalFeira');
    
    // Recarregar listas
    carregarFeiras();
}

function editarFeira(id) {
    const feira = Storage.getFeiras().find(f => f.id === id);
    
    if (feira) {
        // Preencher formulário
        document.getElementById('feiraNome').value = feira.nome || '';
        document.getElementById('feiraPeriodicidade').value = feira.periodicidade || '';
        document.getElementById('feiraContribuicao').value = feira.contribuicao || '';
        document.getElementById('feiraTipoContribuicao').value = feira.tipoContribuicao || 'diária';
        document.getElementById('feiraOutrosCustos').value = feira.outrosCustos || '';
        document.getElementById('feiraEndereco').value = feira.endereco || '';
        
        // Marcar que está editando
        document.getElementById('modalFeira').dataset.editando = id;
        
        // Mudar título do modal
        document.querySelector('#modalFeira .modal-header h3').textContent = 'Editar Feira';
        
        // Abrir modal
        abrirModal('modalFeira');
    }
}

function excluirFeira(id) {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    if (id === feiraAtivaId) {
        if (confirm('Esta é a feira ativa no momento. Excluir pode afetar os dados atuais. Deseja continuar?')) {
            Storage.deleteFeira(id);
            
            // Escolher outra feira como ativa
            const feiras = Storage.getFeiras();
            if (feiras.length > 0) {
                localStorage.setItem('feiraAtivaId', feiras[0].id);
                carregarFeiraAtiva();
            } else {
                localStorage.removeItem('feiraAtivaId');
                document.querySelector('.feira-nome').textContent = 'Nenhuma feira';
                document.querySelector('.feira-data').innerHTML = 'Cadastre uma feira';
            }
            
            carregarFeiras();
            mostrarToast('Feira excluída!');
        }
    } else {
        if (confirm('Excluir esta feira?')) {
            Storage.deleteFeira(id);
            carregarFeiras();
            mostrarToast('Feira excluída!');
        }
    }
}

function limparFormularioFeira() {
    document.getElementById('feiraNome').value = '';
    document.getElementById('feiraPeriodicidade').value = '';
    document.getElementById('feiraContribuicao').value = '';
    document.getElementById('feiraTipoContribuicao').value = 'diária';
    document.getElementById('feiraOutrosCustos').value = '';
    document.getElementById('feiraEndereco').value = '';
    delete document.getElementById('modalFeira').dataset.editando;
    document.querySelector('#modalFeira .modal-header h3').textContent = 'Nova Feira';
}

// ===== FUNÇÃO PARA CARREGAR MODAL DE SELEÇÃO DE FEIRA =====
function carregarModalSelecionarFeira() {
    const feiras = Storage.getFeiras();
    const container = document.querySelector('#modalFeiras .feiras-lista');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (feiras.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhuma feira cadastrada</p>
                <p style="font-size: 12px;">Cadastre uma feira no menu Configurações</p>
            </div>
        `;
        return;
    }
    
    feiras.forEach(feira => {
        const item = document.createElement('div');
        item.className = 'feira-select-item';
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #f0f7fa;
            border-radius: 20px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        // Verificar se é a feira ativa
        const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
        const isAtiva = (feira.id === feiraAtivaId);
        
        item.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <span class="feira-listada">${feira.nome}</span>
                    ${isAtiva ? '<span style="font-size: 11px; background: #1b6b4c; color: white; padding: 2px 8px; border-radius: 20px;">Ativa</span>' : ''}
                </div>
                <div style="font-size: 12px; color: #4d6373; margin-top: 4px;">
                    ${feira.periodicidade || 'Sem periodicidade'}
                </div>
                ${feira.endereco ? `<div style="font-size: 11px; color: #6b8ba0; margin-top: 2px;"><i class="fa-solid fa-location-dot"></i> ${feira.endereco.substring(0, 30)}</div>` : ''}
            </div>
            <button class="btn-add" style="padding: 8px 16px; ${isAtiva ? 'opacity: 0.5;' : ''}" 
                onclick="selecionarFeira(${feira.id})" ${isAtiva ? 'disabled' : ''}>
                ${isAtiva ? 'Atual' : 'Selecionar'}
            </button>
        `;
        
        container.appendChild(item);
    });
}

// ===== BUSCAR FEIRAS NO MODAL =====
function buscarFeiras() {
    const termo = document.getElementById('buscaFeiras').value.toLowerCase();
    const feiras = Storage.getFeiras();
    const container = document.querySelector('#modalFeiras .feiras-lista');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    const feirasFiltradas = feiras.filter(f => 
        f.nome.toLowerCase().includes(termo) || 
        (f.periodicidade && f.periodicidade.toLowerCase().includes(termo)) ||
        (f.endereco && f.endereco.toLowerCase().includes(termo))
    );
    
    if (feirasFiltradas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-search" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhuma feira encontrada</p>
            </div>
        `;
        return;
    }
    
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    feirasFiltradas.forEach(feira => {
        const item = document.createElement('div');
        item.className = 'feira-select-item';
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #f0f7fa;
            border-radius: 20px;
            margin-bottom: 10px;
            cursor: pointer;
            color: black;
            transition: background 0.2s;
        `;
        
        const isAtiva = (feira.id === feiraAtivaId);
        
        item.innerHTML = `
            <div style="flex: 1;" onclick="selecionarFeira(${feira.id})">
                <div style="font-weight: 600; display: flex; align-items: center; gap: 8px; color: black;">
                    ${feira.nome}
                    ${isAtiva ? '<span style="font-size: 11px; background: #1b6b4c; color: white; padding: 2px 8px; border-radius: 20px;">Ativa</span>' : ''}
                </div>
                <div style="font-size: 12px; color: #4d6373; margin-top: 4px;">
                    ${feira.periodicidade || 'Sem periodicidade'}
                </div>
                ${feira.endereco ? `<div style="font-size: 11px; color: #6b8ba0; margin-top: 2px;"><i class="fa-solid fa-location-dot"></i> ${feira.endereco.substring(0, 30)}</div>` : ''}
            </div>
            <button class="btn-add" style="padding: 8px 16px; ${isAtiva ? 'opacity: 0.5;' : ''}" 
                onclick="selecionarFeira(${feira.id})" ${isAtiva ? 'disabled' : ''}>
                ${isAtiva ? 'Atual' : 'Selecionar'}
            </button>
        `;
        
        container.appendChild(item);
    });
}

// ===== FUNÇÕES DE CAIXA =====
let caixaAtual = null;

function carregarCaixa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    //console.log('Carregando caixa da feira:', feiraAtivaId, caixaAtual);
    
    if (caixaAtual && caixaAtual.status === 'aberto') {
        // Caixa aberto
        document.getElementById('btnAbrirCaixa').style.display = 'none';
        document.getElementById('btnFecharCaixa').style.display = 'flex';
        document.getElementById('caixaAtivo').style.display = 'block';
        
        // Atualizar informações
        document.getElementById('caixaAbertura').textContent = caixaAtual.abertura || '';
        document.getElementById('caixaVendas').textContent = `R$ ${(caixaAtual.totalVendas || 0).toFixed(2)}`;
        document.getElementById('caixaPedidos').textContent = caixaAtual.movimentacoes?.filter(m => m.tipo === 'venda').length || 0;
        
        // Atualizar saldo atual com cor especial se negativo
        const saldoElement = document.querySelector('#caixaAtivo .caixa-info-item:first-child + .caixa-info-item + .caixa-info-item .caixa-info-value');
        if (saldoElement) {
            const saldoAtual = caixaAtual.saldoAtual || 0;
            saldoElement.textContent = `R$ ${saldoAtual.toFixed(2)}`;
            if (saldoAtual < 0) {
                saldoElement.style.color = '#b33f3f';
                saldoElement.style.fontWeight = 'bold';
            } else {
                saldoElement.style.color = '#1e313f';
                saldoElement.style.fontWeight = 'normal';
            }
        }
        
        atualizarSaldoCaixa();
        carregarMovimentacoes();
        
        if (painelFinanceiroAberto) {
            carregarResumoFinanceiro();
        }
    } else {
        // Caixa fechado
        document.getElementById('btnAbrirCaixa').style.display = 'flex';
        document.getElementById('btnFecharCaixa').style.display = 'none';
        document.getElementById('caixaAtivo').style.display = 'none';
    }
    
    carregarHistoricoFechamentos();
}
function atualizarSaldoCaixa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (caixaAtual && caixaAtual.status === 'aberto') {
        document.getElementById('caixaVendas').textContent = `R$ ${(caixaAtual.totalVendas || 0).toFixed(2)}`;
        document.getElementById('caixaPedidos').textContent = caixaAtual.movimentacoes?.filter(m => m.tipo === 'venda').length || 0;
        
        // Atualizar saldo no card de saldo
        const saldoCard = document.querySelector('.card-resumo.total .card-valor');
        if (saldoCard) {
            const saldoAtual = caixaAtual.saldoAtual || 0;
            saldoCard.textContent = `R$ ${saldoAtual.toFixed(2)}`;
            if (saldoAtual < 0) {
                saldoCard.style.color = '#b33f3f';
            } else {
                saldoCard.style.color = '#1e313f';
            }
        }
    }
}

function carregarMovimentacoes() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const movimentacoes = Storage.getMovimentacoes(feiraAtivaId);
    const container = document.querySelector('#caixaAtivo .caixa-info:last-child');
    
    if (!container) return;
    
    // Limpar movimentações anteriores (manter o título)
    const titulo = container.querySelector('h3');
    container.innerHTML = '';
    if (titulo) container.appendChild(titulo);
    
    const ultimasMov = movimentacoes.slice(-10).reverse(); // Últimas 10, mais recentes primeiro
    
    if (ultimasMov.length === 0) {
        container.innerHTML += `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <p>Nenhuma movimentação hoje</p>
            </div>
        `;
    } else {
        ultimasMov.forEach(mov => {
            const item = document.createElement('div');
            item.className = 'caixa-info-item';
            
            const valorFormatado = `R$ ${mov.valor.toFixed(2)}`;
            const cor = (mov.tipo === 'entrada' || mov.tipo === 'venda' || mov.tipo === 'abertura') ? '#1b6b4c' : '#b33f3f';
            const sinal = (mov.tipo === 'entrada' || mov.tipo === 'venda' || mov.tipo === 'abertura') ? '+' : '-';
            
            // Se for venda, extrair forma de pagamento da descrição
            let descricaoDisplay = mov.descricao;
            if (mov.tipo === 'venda' && mov.descricao.includes(' | Pag: ')) {
                const partes = mov.descricao.split(' | Pag: ');
                descricaoDisplay = `
                    <div>${partes[0]}</div>
                    <div style="font-size: 11px; color: #1b6b4c; margin-top: 2px;">
                        <i class="fa-solid fa-credit-card"></i> ${partes[1]}
                    </div>
                `;
            }
            
            item.innerHTML = `
                <div style="display: flex; flex-direction: column; flex: 1;">
                    <div style="font-weight: 500;">${descricaoDisplay}</div>
                    <div style="font-size: 11px; color: #4d6373; margin-top: 2px;">${mov.data}</div>
                </div>
                <span style="color: ${cor}; font-weight: 600;">${sinal} ${valorFormatado}</span>
            `;
            
            container.appendChild(item);
        });
    }
}

function abrirCaixa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const feira = Storage.getFeiras().find(f => f.id === feiraAtivaId);
    
    // Criar modal para valor inicial
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Abrir Caixa - ${feira.nome}</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Valor Inicial (R$)</label>
                    <input type="number" id="valorInicialCaixa" class="form-control" placeholder="0,00" step="0.01" min="0" value="0" autofocus>
                </div>
            </div>
            
            <button class="btn-salvar" onclick="confirmarAberturaCaixa()">Abrir Caixa</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function confirmarAberturaCaixa() {
    const valorInicial = parseFloat(document.getElementById('valorInicialCaixa').value) || 0;
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    Storage.abrirCaixa(feiraAtivaId, valorInicial);
    
    // Fechar modal
    document.querySelector('.modal.active').remove();
    
    // Recarregar caixa
    carregarCaixa();
    carregarDashboard();
    atualizarGrafico();
    mostrarToast('Caixa aberto com sucesso!');
}

function fecharCaixa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (!caixaAtual) return;
    
    // Criar modal de resumo
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Fechar Caixa</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="caixa-info" style="margin-bottom: 10px;">
                    <div class="caixa-info-item">
                        <span>Valor Inicial:</span>
                        <span>R$ ${caixaAtual.valorInicial.toFixed(2)}</span>
                    </div>
                    <div class="caixa-info-item">
                        <span>Total de Vendas:</span>
                        <span style="color: #1b6b4c;">+ R$ ${(caixaAtual.totalVendas || 0).toFixed(2)}</span>
                    </div>
                    <div class="caixa-info-item">
                        <span>Total de Saídas:</span>
                        <span style="color: #b33f3f;">- R$ ${(caixaAtual.totalSaidas || 0).toFixed(2)}</span>
                    </div>
                    <div class="caixa-info-item" style="border-bottom: none;">
                        <span style="font-weight: 700;">Saldo Final:</span>
                        <span style="font-weight: 700; font-size: 18px;">R$ ${caixaAtual.saldoAtual.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <button class="btn-salvar" onclick="confirmarFechamentoCaixa()" style="background: #b33f3f;">Confirmar Fechamento</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function confirmarFechamentoCaixa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const feira = Storage.getFeiras().find(f => f.id === feiraAtivaId);
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (caixaAtual) {
        // Registrar fechamento no histórico
        Storage.registrarFechamento(feiraAtivaId, {
            feiraNome: feira.nome,
            valorInicial: caixaAtual.valorInicial,
            totalVendas: caixaAtual.totalVendas,
            totalSaidas: caixaAtual.totalSaidas,
            saldoFinal: caixaAtual.saldoAtual,
            movimentacoes: caixaAtual.movimentacoes
        });
        
        Storage.fecharCaixa(feiraAtivaId);
    }
    
    // Fechar modal
    document.querySelector('.modal.active').remove();
    
    // Recarregar caixa e dashboard
    carregarCaixa();
    carregarDashboard(); 
    atualizarGrafico();
    carregarHistoricoFechamentos();
    
    mostrarToast('Caixa fechado!');
}

function registrarEntrada() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (!caixaAtual || caixaAtual.status !== 'aberto') {
        alert('Caixa não está aberto!');
        return;
    }
    
    // Criar modal para entrada
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Registrar Entrada</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Descrição da entrada</label>
                    <input type="text" id="descricaoEntrada" class="form-control" placeholder="Ex: Venda de produtos" autofocus>
                </div>
                <div class="form-group">
                    <label>Valor (R$)</label>
                    <input type="number" id="valorEntrada" class="form-control" placeholder="0,00" step="0.01" min="0.01">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="categoriaEntrada" class="form-control">
                        <option value="venda">Venda de produtos</option>
                        <option value="encomenda">Encomenda especial</option>
                        <option value="extra">Serviço extra</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
            </div>
            
            <button class="btn-salvar" id="btnConfirmarEntrada" style="background: #1b6b4c;">Registrar Entrada</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const btnConfirmar = modal.querySelector('#btnConfirmarEntrada');
    btnConfirmar.addEventListener('click', () => {
        const descricao = modal.querySelector('#descricaoEntrada').value;
        const valor = parseFloat(modal.querySelector('#valorEntrada').value);
        const categoria = modal.querySelector('#categoriaEntrada').value;
        
        if (!descricao) {
            alert('Preencha a descrição da entrada!');
            return;
        }
        
        if (!valor || valor <= 0) {
            alert('Valor inválido!');
            return;
        }
        
        // Mapear categoria para exibição
        const categoriaNomes = {
            'venda': 'Venda',
            'encomenda': 'Encomenda',
            'extra': 'Serviço extra',
            'outros': 'Outros'
        };
        
        const nomeCategoria = categoriaNomes[categoria] || categoria;
        const descricaoCompleta = `${descricao} (${nomeCategoria})`;
        
        // Registrar entrada no caixa
        Storage.registrarMovimentacao(feiraAtivaId, 'entrada', descricaoCompleta, valor);
        
        // Recarregar caixa e dashboard
        carregarCaixa();
        carregarDashboard();
        atualizarGrafico();

        // Fechar modal
        modal.remove();
        
        
        mostrarToast(`Entrada de R$ ${valor.toFixed(2)} registrada!`);
    });
}

function registrarSaida() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (!caixaAtual || caixaAtual.status !== 'aberto') {
        alert('Caixa não está aberto!');
        return;
    }
    
    // Criar modal para saída
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Registrar Saída</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Descrição da saída</label>
                    <input type="text" id="descricaoSaida" class="form-control" placeholder="Ex: Compra de ingredientes" autofocus>
                </div>
                <div class="form-group">
                    <label>Valor (R$)</label>
                    <input type="number" id="valorSaida" class="form-control" placeholder="0,00" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="categoriaSaida" class="form-control">
                        <option value="insumos">Insumos/Ingredientes</option>
                        <option value="transporte">Transporte</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="contas">Contas (água, luz)</option>
                        <option value="impostos">Impostos/Taxas</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                
                <div id="avisoSaldo" style="display: none; margin-top: 10px; padding: 10px; background: #fff3e0; border-radius: 12px; border-left: 3px solid #e65100;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #e65100;"></i>
                        <span style="font-size: 13px; color: #e65100;">
                            ⚠️ Atenção: Esta saída deixará o caixa negativo.
                        </span>
                    </div>
                    <p style="font-size: 12px; color: #e65100; margin-top: 5px;">
                        Saldo atual: <strong id="saldoAtualMsg">R$ 0,00</strong>
                    </p>
                </div>
            </div>
            
            <button class="btn-salvar" id="btnConfirmarSaida" style="background: #b33f3f;">Registrar Saída</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const valorInput = modal.querySelector('#valorSaida');
    const avisoSaldo = modal.querySelector('#avisoSaldo');
    const saldoAtualMsg = modal.querySelector('#saldoAtualMsg');
    
    // Atualizar saldo atual
    saldoAtualMsg.textContent = `R$ ${caixaAtual.saldoAtual.toFixed(2)}`;
    
    // Verificar se vai ficar negativo
    valorInput.addEventListener('input', () => {
        const valor = parseFloat(valorInput.value) || 0;
        if (valor > caixaAtual.saldoAtual) {
            avisoSaldo.style.display = 'block';
        } else {
            avisoSaldo.style.display = 'none';
        }
    });
    
    const btnConfirmar = modal.querySelector('#btnConfirmarSaida');
    btnConfirmar.addEventListener('click', () => {
        const descricao = modal.querySelector('#descricaoSaida').value;
        const valor = parseFloat(modal.querySelector('#valorSaida').value);
        const categoria = modal.querySelector('#categoriaSaida').value;
        
        if (!descricao) {
            alert('Preencha a descrição da saída!');
            return;
        }
        
        if (!valor || valor <= 0) {
            alert('Valor inválido!');
            return;
        }
        
        // Registrar saída (permitir mesmo com saldo negativo)
        const categoriaNomes = {
            'insumos': 'Insumos',
            'transporte': 'Transporte',
            'alimentacao': 'Alimentação',
            'contas': 'Contas',
            'impostos': 'Impostos',
            'outros': 'Outros'
        };
        
        const nomeCategoria = categoriaNomes[categoria] || categoria;
        const descricaoCompleta = `${descricao} (${nomeCategoria})`;
        
        Storage.registrarMovimentacao(feiraAtivaId, 'saida', descricaoCompleta, valor);
        
        // Recarregar caixa
        carregarCaixa();
        carregarDashboard();
        atualizarGrafico();
        // Fechar modal
        modal.remove();
        
        
        // Mostrar aviso se ficou negativo
        const novoCaixa = Storage.getCaixa(feiraAtivaId);
        if (novoCaixa && novoCaixa.saldoAtual < 0) {
            mostrarToast(`⚠️ Saída registrada! Novo saldo: R$ ${novoCaixa.saldoAtual.toFixed(2)} (negativo)`, 4000);
        } else {
            mostrarToast(`Saída de R$ ${valor.toFixed(2)} registrada!`);
        }
    });
}

// Função para registrar venda (será chamada pelo PDV)
function registrarVenda(itens, total) {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    caixaAtual = Storage.getCaixa(feiraAtivaId);
    
    if (!caixaAtual || caixaAtual.status !== 'aberto') {
        alert('Caixa não está aberto! Abra o caixa antes de vender.');
        return false;
    }
    
    const descricao = `Venda: ${itens.map(i => `${i.qtd}x ${i.nome}`).join(', ')}`;
    Storage.registrarMovimentacao(feiraAtivaId, 'venda', descricao, total);
    carregarCaixa();
    return true;
}

// ===== HISTÓRICO DE FECHAMENTOS =====
let historicoExpandido = false;

function carregarHistoricoFechamentos() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const fechamentos = Storage.getFechamentos(feiraAtivaId, 3); // Últimos 3
    const container = document.getElementById('historicoFechamentos');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (fechamentos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-archive" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhum fechamento registrado</p>
                <p style="font-size: 12px;">Os fechamentos aparecerão aqui</p>
            </div>
        `;
        return;
    }
    
    fechamentos.forEach(f => {
        const item = document.createElement('div');
        item.className = 'fechamento-item';
        item.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid #d0dde8;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        item.onmouseover = () => item.style.transform = 'translateX(5px)';
        item.onmouseout = () => item.style.transform = 'translateX(0)';
        item.onclick = () => mostrarDetalhesFechamento(f);
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #1e313f;">${f.dataFechamento}</span>
                <span style="background: #1e3b4f; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                    R$ ${f.saldoFinal.toFixed(2)}
                </span>
            </div>
            <div style="display: flex; gap: 15px; font-size: 13px; color: #4d6373;">
                <span><i class="fa-solid fa-arrow-down" style="color: #1b6b4c;"></i> R$ ${f.totalVendas.toFixed(2)}</span>
                <span><i class="fa-solid fa-arrow-up" style="color: #b33f3f;"></i> R$ ${f.totalSaidas.toFixed(2)}</span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function mostrarDetalhesFechamento(fechamento) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    
    // Criar lista de movimentações
    const movimentacoesHtml = fechamento.movimentacoes?.map(m => {
        const sinal = (m.tipo === 'entrada' || m.tipo === 'venda' || m.tipo === 'abertura') ? '+' : '-';
        const cor = (m.tipo === 'entrada' || m.tipo === 'venda' || m.tipo === 'abertura') ? '#1b6b4c' : '#b33f3f';
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">
                <div>
                    <div class="modal-subtitle">${m.descricao}</div>
                    <div style="font-size: 11px; color: #64748b;">${m.data}</div>
                </div>
                <span style="color: ${cor}; font-weight: 600;">${sinal} R$ ${m.valor.toFixed(2)}</span>
            </div>
        `;
    }).join('') || '<p>Nenhuma movimentação registrada</p>';
    
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px; max-width: 420px;">
            <div class="modal-header">
                <h3>Detalhes do Fechamento</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: #f8fafc; border-radius: 20px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Data:</span>
                        <span class="modal-txt">${fechamento.dataFechamento}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Feira:</span>
                        <span class="modal-txt"">${fechamento.feiraNome}</span>
                    </div>
                    <div style="border-top: 1px solid #e2e8f0; margin: 10px 0; padding-top: 10px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span class="modal-txt">Valor Inicial:</span>
                            <span class="modal-txt">R$ ${fechamento.valorInicial.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span class="modal-txt">Total Vendas:</span>
                            <span style="color: #1b6b4c;">+ R$ ${fechamento.totalVendas.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span class="modal-txt">Total Saídas:</span>
                            <span style="color: #b33f3f;">- R$ ${fechamento.totalSaidas.toFixed(2)}</span>
                        </div>
                        <div style="border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between;">
                            <span class="modal-title">Saldo Final:</span>
                            <span style="font-weight: 700; font-size: 18px; color: #1e3b4f;">R$ ${fechamento.saldoFinal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 10px; color: #1e313f;">Movimentações do Dia</h4>
                <div style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                    ${movimentacoesHtml}
                </div>
            </div>
            
            <button class="btn-salvar" onclick="this.closest('.modal').remove()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function toggleHistorico() {
    historicoExpandido = !historicoExpandido;
    const container = document.getElementById('historicoFechamentos');
    const btnExpandir = document.getElementById('btnExpandirHistorico');
    const buscaContainer = document.getElementById('buscaHistoricoContainer');
    
    if (historicoExpandido) {
        // Expandir: mostrar busca e carregar mais fechamentos
        container.style.maxHeight = '400px';
        container.style.overflowY = 'auto';
        btnExpandir.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Mostrar menos';
        buscaContainer.style.display = 'block';
        carregarTodosFechamentos();
        
        // Limpar campo de busca ao expandir
        document.getElementById('dataBusca').value = '';
    } else {
        // Recolher: mostrar apenas os 3 últimos
        container.style.maxHeight = 'none';
        container.style.overflowY = 'visible';
        btnExpandir.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Ver histórico completo';
        buscaContainer.style.display = 'none';
        carregarHistoricoFechamentos();
    }
}

function carregarTodosFechamentos() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const fechamentos = Storage.getFechamentos(feiraAtivaId);
    const container = document.getElementById('historicoFechamentos');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (fechamentos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-archive" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhum fechamento registrado</p>
            </div>
        `;
        return;
    }
    
    fechamentos.forEach(f => {
        const item = document.createElement('div');
        item.className = 'fechamento-item';
        item.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid #d0dde8;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        item.onclick = () => mostrarDetalhesFechamento(f);
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #1e313f;">${f.dataFechamento}</span>
                <span style="background: #1e3b4f; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                    R$ ${f.saldoFinal.toFixed(2)}
                </span>
            </div>
            <div style="display: flex; gap: 15px; font-size: 13px; color: #4d6373;">
                <span><i class="fa-solid fa-arrow-down" style="color: #1b6b4c;"></i> R$ ${f.totalVendas.toFixed(2)}</span>
                <span><i class="fa-solid fa-arrow-up" style="color: #b33f3f;"></i> R$ ${f.totalSaidas.toFixed(2)}</span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function buscarFechamentos() {
    const dataBusca = document.getElementById('dataBusca').value;
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const container = document.getElementById('historicoFechamentos');
    
    if (!dataBusca) {
        carregarTodosFechamentos();
        return;
    }
    
    // CORREÇÃO DO FUSO HORÁRIO
    // Dividir a data em ano, mês, dia e criar no fuso local
    const [ano, mes, dia] = dataBusca.split('-').map(Number);
    const dataBuscaObj = new Date(ano, mes - 1, dia); // Mês em JS é 0-based
    dataBuscaObj.setHours(0, 0, 0, 0);
    
    const dataBuscaFim = new Date(ano, mes - 1, dia);
    dataBuscaFim.setHours(23, 59, 59, 999);
    
    const fechamentos = Storage.getFechamentos(feiraAtivaId);
    
    const fechamentosFiltrados = fechamentos.filter(f => {
        const dataFechamento = new Date(f.timestamp);
        // Comparar timestamps diretamente
        return dataFechamento >= dataBuscaObj && dataFechamento <= dataBuscaFim;
    });
    
    container.innerHTML = '';
    
    if (fechamentosFiltrados.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #4d6373;">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhum fechamento encontrado em ${new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR')}</p>
            </div>
        `;
        return;
    }
    
    fechamentosFiltrados.forEach(f => {
        const item = document.createElement('div');
        item.className = 'fechamento-item';
        item.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid #d0dde8;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        item.onclick = () => mostrarDetalhesFechamento(f);
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #1e313f;">${f.dataFechamento}</span>
                <span style="background: #1e3b4f; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                    R$ ${f.saldoFinal.toFixed(2)}
                </span>
            </div>
            <div style="display: flex; gap: 15px; font-size: 13px; color: #4d6373;">
                <span><i class="fa-solid fa-arrow-down" style="color: #1b6b4c;"></i> R$ ${f.totalVendas.toFixed(2)}</span>
                <span><i class="fa-solid fa-arrow-up" style="color: #b33f3f;"></i> R$ ${f.totalSaidas.toFixed(2)}</span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// ===== CONTROLE DE DESPESAS/RECEITAS =====
let painelFinanceiroAberto = false;

function toggleFinanceiro() {
    painelFinanceiroAberto = !painelFinanceiroAberto;
    const painel = document.getElementById('painelFinanceiro');
    const resumo = document.getElementById('resumoFinanceiro');
    const seta = document.getElementById('setaFinanceiro');
    
    if (painelFinanceiroAberto) {
        painel.style.display = 'block';
        resumo.style.display = 'block';
        seta.className = 'fa-solid fa-chevron-up';
        carregarResumoFinanceiro();
    } else {
        painel.style.display = 'none';
        resumo.style.display = 'none';
        seta.className = 'fa-solid fa-chevron-down';
    }
}

function registrarDespesa() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Registrar Despesa</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Descrição da despesa</label>
                    <input type="text" id="descDespesa" class="form-control" placeholder="Ex: Compra de ingredientes" autofocus>
                </div>
                <div class="form-group">
                    <label>Valor (R$)</label>
                    <input type="number" id="valorDespesa" class="form-control" placeholder="0,00" step="0.01" min="0.01">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="categoriaDespesa" class="form-control">
                        <option value="insumos">Insumos/Ingredientes</option>
                        <option value="transporte">Transporte</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="contribuicao">Contribuição da feira</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
            </div>
            
            <button class="btn-salvar" onclick="confirmarDespesa()" style="background: #e65100;">Registrar Despesa</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function registrarReceita() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    // Criar modal simples
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Registrar Receita Extra</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div class="form-group">
                    <label>Descrição da receita</label>
                    <input type="text" id="descReceita" class="form-control" placeholder="Ex: Encomenda especial" autofocus>
                </div>
                <div class="form-group">
                    <label>Valor (R$)</label>
                    <input type="number" id="valorReceita" class="form-control" placeholder="0,00" step="0.01" min="0.01">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="categoriaReceita" class="form-control">
                        <option value="encomenda">Encomendas</option>
                        <option value="extra">Serviços extras</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
            </div>
            
            <button class="btn-salvar" onclick="confirmarReceita()" style="background: #2e7d32;">Registrar Receita</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function confirmarDespesa() {
    const descricao = document.getElementById('descDespesa').value;
    const valor = parseFloat(document.getElementById('valorDespesa').value);
    const categoria = document.getElementById('categoriaDespesa').value;
    
    if (!descricao || !valor) {
        alert('Preencha descrição e valor!');
        return;
    }
    
    if (valor <= 0) {
        alert('Valor inválido!');
        return;
    }
    
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    // Salvar no Storage (criar seção específica)
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    if (!dados.financeiro) dados.financeiro = {};
    if (!dados.financeiro[feiraAtivaId]) dados.financeiro[feiraAtivaId] = [];
    
    dados.financeiro[feiraAtivaId].push({
        tipo: 'despesa',
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        data: new Date().toLocaleString('pt-BR'),
        timestamp: Date.now()
    });
    
    localStorage.setItem('feiraMini', JSON.stringify(dados));
    
    // Atualizar resumo
    carregarResumoFinanceiro();
    carregarDashboard(); 
    atualizarGrafico();

    // Fechar modal
    document.querySelector('.modal.active').remove();
    
    mostrarToast('Despesa registrada!');
}

function confirmarReceita() {
    const descricao = document.getElementById('descReceita').value;
    const valor = parseFloat(document.getElementById('valorReceita').value);
    const categoria = document.getElementById('categoriaReceita').value;
    
    if (!descricao || !valor) {
        alert('Preencha descrição e valor!');
        return;
    }
    
    if (valor <= 0) {
        alert('Valor inválido!');
        return;
    }
    
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    // Salvar no Storage
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    if (!dados.financeiro) dados.financeiro = {};
    if (!dados.financeiro[feiraAtivaId]) dados.financeiro[feiraAtivaId] = [];
    
    dados.financeiro[feiraAtivaId].push({
        tipo: 'receita',
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        data: new Date().toLocaleString('pt-BR'),
        timestamp: Date.now()
    });
    
    localStorage.setItem('feiraMini', JSON.stringify(dados));
    
    // Atualizar resumo
    carregarResumoFinanceiro();
    carregarDashboard();
    atualizarGrafico();

    // Fechar modal
    document.querySelector('.modal.active').remove();
   
    mostrarToast('Receita registrada!');
}

function carregarResumoFinanceiro() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    
    if (!dados.financeiro || !dados.financeiro[feiraAtivaId]) {
        document.getElementById('totalDespesas').textContent = 'R$ 0,00';
        document.getElementById('totalReceitas').textContent = 'R$ 0,00';
        return;
    }
    
    // Filtrar apenas movimentos de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const movimentosHoje = dados.financeiro[feiraAtivaId].filter(m => {
        const dataMov = new Date(m.timestamp);
        dataMov.setHours(0, 0, 0, 0);
        return dataMov.getTime() === hoje.getTime();
    });
    
    const totalDespesas = movimentosHoje
        .filter(m => m.tipo === 'despesa')
        .reduce((acc, m) => acc + m.valor, 0);
    
    const totalReceitas = movimentosHoje
        .filter(m => m.tipo === 'receita')
        .reduce((acc, m) => acc + m.valor, 0);
    
    document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.getElementById('totalReceitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
}



function adicionarAoCarrinho(id) {
    mostrarToast('Funcionalidade em desenvolvimento');
}


// ===== ESTADO DO PDV =====
let carrinhoAtual = []; // Cada item: { id, nome, preco, quantidade, subtotal }

// ===== FUNÇÕES DO PDV =====
function adicionarAoCarrinho(produtoId) {
    const produtos = Storage.getProdutos();
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) {
        mostrarToast('Produto não encontrado!');
        return;
    }
    
    // Verificar se já está no resumo
    const itemExistente = carrinhoAtual.find(item => item.id === produtoId);
    
    if (itemExistente) {
        // Incrementar quantidade
        itemExistente.quantidade++;
        itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
    } else {
        // Adicionar novo item
        carrinhoAtual.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            subtotal: produto.preco
        });
    }
    
    // Atualizar interface
    atualizarResumo();
    mostrarToast(`${produto.nome} adicionado!`);
}

function removerDoCarrinho(produtoId) {
    const index = carrinhoAtual.findIndex(item => item.id === produtoId);
    
    if (index !== -1) {
        const produto = carrinhoAtual[index];
        
        if (produto.quantidade > 1) {
            // Diminuir quantidade
            produto.quantidade--;
            produto.subtotal = produto.quantidade * produto.preco;
        } else {
            // Remover item
            carrinhoAtual.splice(index, 1);
        }
        
        atualizarResumo();
        mostrarToast(`${produto.nome} removido!`);
    }
}

function alterarQuantidade(produtoId, novaQuantidade) {
    const item = carrinhoAtual.find(i => i.id === produtoId);
    
    if (item) {
        if (novaQuantidade <= 0) {
            // Remover item se quantidade for zero ou negativa
            carrinhoAtual = carrinhoAtual.filter(i => i.id !== produtoId);
        } else {
            item.quantidade = novaQuantidade;
            item.subtotal = item.quantidade * item.preco;
        }
        
        atualizarResumo();
    }
}

function calcularTotalResumo() {
    return carrinhoAtual.reduce((total, item) => total + item.subtotal, 0);
}

function atualizarResumo() {
    const container = document.getElementById('resumoItens');
    const totalElement = document.getElementById('resumoTotal');
    const total = calcularTotalResumo();
    
    if (!container) return;
    
    // Limpar container
    container.innerHTML = '';
    
    if (carrinhoAtual.length === 0) {
        container.innerHTML = `
            <div class="vazio" style="padding: 20px;">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Resumo vazio</p>
                <p style="font-size: 12px;">Adicione produtos para vender</p>
            </div>
        `;
        totalElement.textContent = `R$ 0,00`;
        return;
    }
    
    // Listar itens do resumo
    carrinhoAtual.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'resumo-item';
        itemDiv.innerHTML = `
            <div class="resumo-item-info">
                <button onclick="alterarQuantidade(${item.id}, ${item.quantidade - 1})" style="background: none; border: none; color: #b33f3f; font-size: 18px; cursor: pointer; width: 28px;">−</button>
                <span class="resumo-qtd">${item.quantidade}x</span>
                <button onclick="alterarQuantidade(${item.id}, ${item.quantidade + 1})" style="background: none; border: none; color: #1b6b4c; font-size: 18px; cursor: pointer; width: 28px;">+</button>
                <span>${item.nome}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span>R$ ${item.subtotal.toFixed(2)}</span>
                <button onclick="removerDoCarrinho(${item.id})" style="background: none; border: none; color: #b17f79; font-size: 16px; cursor: pointer;">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
    
    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

function finalizarVenda() {
    if (carrinhoAtual.length === 0) {
        alert('Resumo vazio! Adicione produtos para vender.');
        return;
    }
    
    const total = calcularTotalResumo();
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    // Verificar se caixa está aberto
    const caixa = Storage.getCaixa(feiraAtivaId);
    if (!caixa || caixa.status !== 'aberto') {
        alert('Caixa não está aberto! Abra o caixa antes de vender.');
        return;
    }
    
    // Abrir modal de forma de pagamento
    abrirModalPagamento(total);
}

function abrirModalPagamento(total) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px; max-width: 380px;">
            <div class="modal-header">
                <h3>Finalizar Venda</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #1e3b4f; margin-bottom: 10px;">
                    R$ ${total.toFixed(2)}
                </div>
                <div style="font-size: 14px; color: #64748b;">
                    Selecione a forma de pagamento
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
                <button class="btn-pagamento" data-pagamento="dinheiro" style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 20px; background: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s;">
                    <i class="fa-solid fa-money-bill-wave" style="font-size: 24px; color: #2c5a7a;"></i>
                    <span style="font-weight: 600; color: #1e313f;">Dinheiro</span>
                </button>
                <button class="btn-pagamento" data-pagamento="pix" style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 20px; background: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s;">
                    <i class="fa-brands fa-pix" style="font-size: 24px; color: #2c5a7a;"></i>
                    <span style="font-weight: 600;color: #1e313f">PIX</span>
                </button>
                <button class="btn-pagamento" data-pagamento="credito" style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 20px; background: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s;">
                    <i class="fa-regular fa-credit-card" style="font-size: 24px; color: #2c5a7a;"></i>
                    <span style="font-weight: 600;color: #1e313f">Cartão Crédito</span>
                </button>
                <button class="btn-pagamento" data-pagamento="debito" style="padding: 16px; border: 2px solid #e2e8f0; border-radius: 20px; background: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s;">
                    <i class="fa-solid fa-credit-card" style="font-size: 24px; color: #2c5a7a;"></i>
                    <span style="font-weight: 600;color: #1e313f">Cartão Débito</span>
                </button>
            </div>
            
            <button class="btn-salvar" id="btnConfirmarVenda" style="background: #1b6b4c;" disabled>
                Confirmar Venda
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let pagamentoSelecionado = null;
    
    // Adicionar evento aos botões de pagamento
    const botoesPagamento = modal.querySelectorAll('.btn-pagamento');
    const btnConfirmar = modal.querySelector('#btnConfirmarVenda');
    
    botoesPagamento.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover seleção anterior
            botoesPagamento.forEach(b => {
                b.style.borderColor = '#e2e8f0';
                b.style.background = 'white';
            });
            
            // Destacar selecionado
            btn.style.borderColor = '#1b6b4c';
            btn.style.background = '#e8f5e9';
            
            pagamentoSelecionado = btn.dataset.pagamento;
            btnConfirmar.disabled = false;
            btnConfirmar.style.opacity = '1';
            btnConfirmar.style.cursor = 'pointer';
        });
    });
    
    btnConfirmar.addEventListener('click', () => {
        if (pagamentoSelecionado) {
            confirmarVendaComPagamento(total, pagamentoSelecionado, modal);
        }
    });
}

function confirmarVendaComPagamento(total, pagamento, modal) {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    const nomesPagamento = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'credito': 'Cartão de Crédito',
        'debito': 'Cartão de Débito'
    };
    
    const nomePagamento = nomesPagamento[pagamento] || pagamento;
    
    const itensVenda = carrinhoAtual.map(item => ({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade,
        subtotal: item.subtotal
    }));
    
    Storage.registrarMovimentacao(feiraAtivaId, 'venda', 
        `Venda: ${itensVenda.map(i => `${i.quantidade}x ${i.nome}`).join(', ')} | Pag: ${nomePagamento}`, 
        total);
    
    registrarVendaDetalhada(feiraAtivaId, {
        data: new Date().toLocaleString('pt-BR'),
        timestamp: Date.now(),
        itens: itensVenda,
        total: total,
        pagamento: pagamento,
        nomePagamento: nomePagamento
    });
    
    carrinhoAtual = [];
    atualizarResumo();
    
    // Atualizar caixa, dashboard e gráfico
    carregarCaixa();
    carregarDashboard();  
    atualizarGrafico();      
    
    modal.remove();
    mostrarToast(`Venda finalizada! Total: R$ ${total.toFixed(2)} - Pagamento: ${nomePagamento}`);
}

// Função para registrar venda detalhada (histórico)
function registrarVendaDetalhada(feiraId, venda) {
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    if (!dados.historicoVendas) dados.historicoVendas = {};
    if (!dados.historicoVendas[feiraId]) dados.historicoVendas[feiraId] = [];
    
    dados.historicoVendas[feiraId].push(venda);
    localStorage.setItem('feiraMini', JSON.stringify(dados));
}

// Função para obter vendas detalhadas (útil para relatórios)
function getVendasDetalhadas(feiraId) {
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    if (!dados.historicoVendas || !dados.historicoVendas[feiraId]) return [];
    return dados.historicoVendas[feiraId].sort((a, b) => b.timestamp - a.timestamp);
}

// ===== BUSCA NO PDV =====
function buscarProdutosPdv() {
    const termo = document.getElementById('buscaPdv').value.toLowerCase();
    const produtos = Storage.getProdutos();
    const container = document.getElementById('pdvProdutosLista');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    const produtosFiltrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo)
    );
    
    if (produtosFiltrados.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #4d6373;">
                <i class="fa-solid fa-search" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }
    
    produtosFiltrados.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'produto-pdv-item';
        item.setAttribute('onclick', `adicionarAoCarrinho(${prod.id})`);
        item.innerHTML = `
            <div class="produto-pdv-info">
                <span class="produto-pdv-nome">${prod.nome}</span>
                <span class="produto-pdv-preco">R$ ${prod.preco.toFixed(2)}</span>
            </div>
            <i class="fa-solid fa-plus" style="color: #1b6b4c;"></i>
        `;
        container.appendChild(item);
    });
}

// ===== DASHBOARD =====
function carregarDashboard() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    const caixa = Storage.getCaixa(feiraAtivaId);
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    
    // Calcular vendas e despesas do dia
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    
    let vendasHoje = 0;
    let despesasHoje = 0;
    
    if (caixa && caixa.status === 'aberto') {
        // CAIXA ABERTO: dados do caixa atual
        vendasHoje = caixa.totalVendas || 0;
        despesasHoje = caixa.totalSaidas || 0;
    } else {
        // CAIXA FECHADO: buscar dados do histórico
        const vendas = getVendasDetalhadas(feiraAtivaId);
        const vendasHojeFiltradas = vendas.filter(v => {
            const dataVenda = new Date(v.timestamp);
            return dataVenda >= hoje && dataVenda < amanha;
        });
        vendasHoje = vendasHojeFiltradas.reduce((acc, v) => acc + v.total, 0);
        
        // Buscar despesas do fechamento do dia
        if (dados.fechamentos && dados.fechamentos[feiraAtivaId]) {
            const fechamentosHoje = dados.fechamentos[feiraAtivaId].filter(f => {
                const dataFechamento = new Date(f.timestamp);
                return dataFechamento >= hoje && dataFechamento < amanha;
            });
            despesasHoje = fechamentosHoje.reduce((acc, f) => acc + (f.totalSaidas || 0), 0);
        }
    }
    
    // SEMPRE adicionar despesas do controle financeiro (fora do caixa)
    if (dados.financeiro && dados.financeiro[feiraAtivaId]) {
        const despesasExtras = dados.financeiro[feiraAtivaId].filter(d => {
            const dataDespesa = new Date(d.timestamp);
            return d.tipo === 'despesa' && dataDespesa >= hoje && dataDespesa < amanha;
        });
        despesasHoje += despesasExtras.reduce((acc, d) => acc + d.valor, 0);
    }
    
    // Atualizar cards
    const cardEntradas = document.querySelector('.card-resumo.entrada .card-valor');
    const cardSaidas = document.querySelector('.card-resumo.saida .card-valor');
    const cardSaldo = document.querySelector('.card-resumo.total .card-valor');
    
    if (cardEntradas) cardEntradas.textContent = `R$ ${vendasHoje.toFixed(2)}`;
    if (cardSaidas) cardSaidas.textContent = `R$ ${despesasHoje.toFixed(2)}`;
    
    const saldo = vendasHoje - despesasHoje;
    if (cardSaldo) {
        cardSaldo.textContent = `R$ ${saldo.toFixed(2)}`;
        if (saldo < 0) cardSaldo.style.color = '#b33f3f';
        else cardSaldo.style.color = '#1e313f';
    }
    
    // Carregar últimas vendas
    carregarUltimasVendas();
    
    // Atualizar gráfico
    atualizarGrafico();
}
function carregarUltimasVendas() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const vendas = getVendasDetalhadas(feiraAtivaId);
    const container = document.querySelector('.ultimas-vendas');
    
    if (!container) return;
    
    // Manter o título
    const titulo = container.querySelector('h3');
    container.innerHTML = '';
    if (titulo) container.appendChild(titulo);
    
    const ultimasVendas = vendas.slice(0, 5); // Últimas 5 vendas
    
    if (ultimasVendas.length === 0) {
        container.innerHTML += `
            <div class="vazio" style="padding: 20px;">
                <i class="fa-solid fa-chart-line"></i>
                <p>Nenhuma venda registrada</p>
                <p style="font-size: 12px;">As vendas aparecerão aqui</p>
            </div>
        `;
        return;
    }
    
    const nomesPagamento = {
        'dinheiro': '💰 Dinheiro',
        'pix': '📱 PIX',
        'credito': '💳 Crédito',
        'debito': '💳 Débito'
    };
    
    ultimasVendas.forEach(venda => {
        const item = document.createElement('div');
        item.className = 'venda-item';
        
        // Resumo dos itens
        const itensResumo = venda.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
        const nomePagamento = nomesPagamento[venda.pagamento] || venda.pagamento;
        
        item.innerHTML = `
            <div style="flex: 1;">
                <div class="venda-produto">${itensResumo}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    ${venda.data} • ${nomePagamento}
                </div>
            </div>
            <div class="venda-valor">R$ ${venda.total.toFixed(2)}</div>
        `;
        container.appendChild(item);
    });
}

function carregarResumoFinanceiroDashboard() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    
    if (!dados.financeiro || !dados.financeiro[feiraAtivaId]) {
        return;
    }
    
    // Filtrar movimentos de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const movimentosHoje = dados.financeiro[feiraAtivaId].filter(m => {
        const dataMov = new Date(m.timestamp);
        dataMov.setHours(0, 0, 0, 0);
        return dataMov.getTime() === hoje.getTime();
    });
    
    const totalDespesasHoje = movimentosHoje
        .filter(m => m.tipo === 'despesa')
        .reduce((acc, m) => acc + m.valor, 0);
    
    const totalReceitasHoje = movimentosHoje
        .filter(m => m.tipo === 'receita')
        .reduce((acc, m) => acc + m.valor, 0);
    
    // Atualizar cards (se existir a informação)
    const cardSaidas = document.querySelector('.card-resumo.saida .card-valor');
    if (cardSaidas && totalDespesasHoje > 0) {
        // Se já tem saídas do caixa, somar com despesas
        const valorAtual = parseFloat(cardSaidas.textContent.replace('R$ ', '').replace(',', '.')) || 0;
        cardSaidas.textContent = `R$ ${(valorAtual + totalDespesasHoje).toFixed(2)}`;
    }
}

function atualizarGrafico() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const vendas = getVendasDetalhadas(feiraAtivaId);
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    const ctx = document.getElementById('graficoDashboard');
    
    if (!ctx) return;
    
    // Agrupar vendas por semana (últimas 4 semanas)
    const hoje = new Date();
    const semanas = [];
    const despesasSemana = [];
    
    for (let i = 3; i >= 0; i--) {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - (hoje.getDay() + 7 * i));
        inicioSemana.setHours(0, 0, 0, 0);
        
        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);
        
        // Total de vendas da semana
        const vendasSemana = vendas.filter(v => {
            const dataVenda = new Date(v.timestamp);
            return dataVenda >= inicioSemana && dataVenda <= fimSemana;
        });
        const totalVendas = vendasSemana.reduce((acc, v) => acc + v.total, 0);
        semanas.push(totalVendas);
        
        // ===== DESPESAS DA SEMANA (CAIXA OPERACIONAL + CONTROLE FINANCEIRO) =====
        let totalDespesas = 0;
        
        // 1. Despesas do caixa operacional (saídas)
        const caixa = Storage.getCaixa(feiraAtivaId);
        if (caixa && caixa.movimentacoes) {
            const despesasCaixa = caixa.movimentacoes.filter(m => {
                const dataMov = new Date(m.timestamp || new Date(m.data));
                return m.tipo === 'saida' && dataMov >= inicioSemana && dataMov <= fimSemana;
            });
            totalDespesas += despesasCaixa.reduce((acc, m) => acc + m.valor, 0);
        }
        
        // 2. Despesas do controle financeiro (despesas extras)
        if (dados.financeiro && dados.financeiro[feiraAtivaId]) {
            const despesasExtras = dados.financeiro[feiraAtivaId].filter(d => {
                const dataDespesa = new Date(d.timestamp);
                return d.tipo === 'despesa' && dataDespesa >= inicioSemana && dataDespesa <= fimSemana;
            });
            totalDespesas += despesasExtras.reduce((acc, d) => acc + d.valor, 0);
        }
        
        // 3. Despesas do fechamento de caixa (se houver fechamentos na semana)
        if (dados.fechamentos && dados.fechamentos[feiraAtivaId]) {
            const fechamentos = dados.fechamentos[feiraAtivaId].filter(f => {
                const dataFechamento = new Date(f.timestamp);
                return dataFechamento >= inicioSemana && dataFechamento <= fimSemana;
            });
            // Somar saídas dos fechamentos (já estão incluídas no caixa, mas garantimos)
            const despesasFechamentos = fechamentos.reduce((acc, f) => acc + (f.totalSaidas || 0), 0);
            // Para não contar duplicado, só adicionamos se não tiver caixa aberto
            if (!caixa || caixa.status !== 'aberto') {
                totalDespesas += despesasFechamentos;
            }
        }
        
        despesasSemana.push(totalDespesas);
    }
    
    // Atualizar gráfico
    if (window.meuGrafico) {
        window.meuGrafico.data.datasets[0].data = semanas;
        window.meuGrafico.data.datasets[1].data = despesasSemana;
        window.meuGrafico.update();
    } else {
        // Criar gráfico
        window.meuGrafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [
                    {
                        label: 'Vendas',
                        data: semanas,
                        borderColor: '#1b6b4c',
                        backgroundColor: 'rgba(27, 107, 76, 0.1)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#1b6b4c',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Despesas',
                        data: despesasSemana,
                        borderColor: '#b33f3f',
                        backgroundColor: 'rgba(179, 63, 63, 0.1)',
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#b33f3f',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        },
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

function mostrarToast(msg, duracao = 2000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e3b4f;
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        font-size: 14px;
        z-index: 2000;
        animation: fadeInOut ${duracao / 1000}s ease;
        max-width: 90%;
        text-align: center;
        white-space: nowrap;
    `;
    
    // Se a mensagem for muito longa, quebrar linha
    if (msg.length > 40) {
        toast.style.whiteSpace = 'normal';
        toast.style.maxWidth = '300px';
    }
    
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duracao);
}

// ===== FUNÇÃO PARA ATUALIZAR DASHBOARD QUANDO TROCAR DE FEIRA =====
function carregarDadosFeira(feiraId) {
    //console.log('Carregando dados da feira:', feiraId);
    
    // Atualizar cards
    carregarDashboard();
    
    // Atualizar caixa
    carregarCaixa();
    
    // Atualizar produtos (se necessário)
    carregarProdutos();
    
    // Atualizar feiras
    carregarFeiras();
}

// ===== RELATÓRIOS =====
let vendasFiltradas = [];

function carregarRelatorios() {
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    const periodoAtivo = document.querySelector('.btn-periodo.ativo')?.dataset.periodo || 'hoje';
    
    let dataInicio, dataFim;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    switch(periodoAtivo) {
        case 'hoje':
            dataInicio = new Date(hoje);
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            // Verificar se elemento existe antes de modificar
            const periodoElement = document.getElementById('periodoAtual');
            if (periodoElement) periodoElement.textContent = 'Hoje';
            break;
        case 'semana':
            dataInicio = new Date(hoje);
            dataInicio.setDate(hoje.getDate() - hoje.getDay());
            dataInicio.setHours(0, 0, 0, 0);
            dataFim = new Date(hoje);
            dataFim.setHours(23, 59, 59, 999);
            const periodoElementSemana = document.getElementById('periodoAtual');
            if (periodoElementSemana) periodoElementSemana.textContent = 'Esta Semana';
            break;
        case 'mes':
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            dataFim.setHours(23, 59, 59, 999);
            const periodoElementMes = document.getElementById('periodoAtual');
            if (periodoElementMes) periodoElementMes.textContent = 'Este Mês';
            break;
        default:
            return;
    }
    
    carregarDadosRelatorios(feiraAtivaId, dataInicio, dataFim);
    
    // Carregar gráfico comparativo por feira (últimos 30 dias)
    // Verificar se a função existe e se o elemento canvas existe
    if (typeof carregarVendasPorFeira === 'function') {
        // Verificar se o canvas existe antes de chamar
        const canvas = document.getElementById('graficoVendasPorFeira');
        if (canvas) {
            carregarVendasPorFeira();
        } else {
            console.log('Canvas graficoVendasPorFeira não encontrado, aguardando...');
            // Tentar novamente após um tempo
            setTimeout(() => {
                if (document.getElementById('graficoVendasPorFeira')) {
                    carregarVendasPorFeira();
                }
            }, 500);
        }
    }
}

function carregarDadosRelatorios(feiraId, dataInicio, dataFim) {
    // Buscar vendas
    const vendas = getVendasDetalhadas(feiraId);
    vendasFiltradas = vendas.filter(v => {
        const dataVenda = new Date(v.timestamp);
        return dataVenda >= dataInicio && dataVenda <= dataFim;
    });
    
    // Buscar despesas
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    let despesas = [];
    if (dados.financeiro && dados.financeiro[feiraId]) {
        despesas = dados.financeiro[feiraId].filter(d => {
            const dataDespesa = new Date(d.timestamp);
            return d.tipo === 'despesa' && dataDespesa >= dataInicio && dataDespesa <= dataFim;
        });
    }
    
    // Calcular totais
    const totalVendas = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);
    const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
    const lucro = totalVendas - totalDespesas;
    
    // Atualizar cards com verificação de existência
    const relTotalVendas = document.getElementById('relTotalVendas');
    if (relTotalVendas) relTotalVendas.textContent = `R$ ${totalVendas.toFixed(2)}`;
    
    const relQtdVendas = document.getElementById('relQtdVendas');
    if (relQtdVendas) relQtdVendas.textContent = `${vendasFiltradas.length} vendas`;
    
    const relTotalDespesas = document.getElementById('relTotalDespesas');
    if (relTotalDespesas) relTotalDespesas.textContent = `R$ ${totalDespesas.toFixed(2)}`;
    
    const relQtdDespesas = document.getElementById('relQtdDespesas');
    if (relQtdDespesas) relQtdDespesas.textContent = `${despesas.length} despesas`;
    
    const lucroElement = document.getElementById('relLucro');
    if (lucroElement) {
        lucroElement.textContent = `R$ ${lucro.toFixed(2)}`;
        if (lucro < 0) {
            lucroElement.style.color = '#b33f3f';
        } else {
            lucroElement.style.color = '#1b6b4c';
        }
    }
    
    // Atualizar gráfico
    if (typeof atualizarGraficoVendasDiarias === 'function') {
        atualizarGraficoVendasDiarias(vendasFiltradas, dataInicio, dataFim);
    }
    
    // Atualizar detalhamento por pagamento
    if (typeof atualizarDetalhamentoPagamento === 'function') {
        atualizarDetalhamentoPagamento(vendasFiltradas);
    }
    
    // Atualizar lista de vendas
    if (typeof atualizarListaVendas === 'function') {
        atualizarListaVendas(vendasFiltradas);
    }
}

function atualizarGraficoVendasDiarias(vendas, dataInicio, dataFim) {
    const ctx = document.getElementById('graficoVendasDiarias');
    if (!ctx) {
        console.log('Canvas graficoVendasDiarias não encontrado');
        return;
    }
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não carregado. Aguardando...');
        setTimeout(() => atualizarGraficoVendasDiarias(vendas, dataInicio, dataFim), 500);
        return;
    }
    
    // Agrupar vendas por dia
    const dias = [];
    const valores = [];
    const dataAtual = new Date(dataInicio);
    
    while (dataAtual <= dataFim) {
        const dataStr = dataAtual.toLocaleDateString('pt-BR');
        dias.push(dataStr);
        
        const totalDia = vendas.filter(v => {
            const dataVenda = new Date(v.timestamp);
            return dataVenda.toDateString() === dataAtual.toDateString();
        }).reduce((acc, v) => acc + v.total, 0);
        
        valores.push(totalDia);
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    // Destruir gráfico anterior se existir
    if (window.graficoDiario) {
        window.graficoDiario.destroy();
        window.graficoDiario = null;
    }
    
    try {
        window.graficoDiario = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: valores,
                    backgroundColor: 'rgba(27, 107, 76, 0.6)',
                    borderColor: '#1b6b4c',
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `R$ ${context.raw.toFixed(2)}`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico de vendas diárias:', error);
    }
}

function atualizarDetalhamentoPagamento(vendas) {
    const container = document.getElementById('pagamentoDetalhes');
    if (!container) return;
    
    const pagamentos = {
        'dinheiro': { nome: 'Dinheiro', total: 0, qtd: 0, icon: 'fa-money-bill-wave' },
        'pix': { nome: 'PIX', total: 0, qtd: 0, icon: 'fa-brands fa-pix' },
        'credito': { nome: 'Cartão Crédito', total: 0, qtd: 0, icon: 'fa-regular fa-credit-card' },
        'debito': { nome: 'Cartão Débito', total: 0, qtd: 0, icon: 'fa-solid fa-credit-card' }
    };
    
    vendas.forEach(v => {
        if (pagamentos[v.pagamento]) {
            pagamentos[v.pagamento].total += v.total;
            pagamentos[v.pagamento].qtd++;
        }
    });
    
    container.innerHTML = '';
    
    Object.values(pagamentos).forEach(p => {
        if (p.qtd > 0 || p.total > 0) {
            const percentual = vendas.length > 0 ? (p.total / vendas.reduce((acc, v) => acc + v.total, 0)) * 100 : 0;
            
            const div = document.createElement('div');
            div.className = 'pagamento-item';
            div.style.cssText = `
                background: white;
                border-radius: 20px;
                padding: 12px 16px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
                border: 1px solid #e2e8f0;
            `;
            div.innerHTML = `
                <div style="width: 40px; height: 40px; background: #e8f0f7; border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                    <i class="${p.icon}" style="color: #2c5a7a;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600;">${p.nome}</div>
                    <div style="font-size: 12px; color: #64748b;">${p.qtd} vendas</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700;">R$ ${p.total.toFixed(2)}</div>
                    <div style="font-size: 11px; color: #1b6b4c;">${percentual.toFixed(1)}%</div>
                </div>
            `;
            container.appendChild(div);
        }
    });
    
    if (vendas.length === 0) {
        container.innerHTML = `
            <div class="vazio" style="padding: 30px;">
                <i class="fa-solid fa-chart-simple"></i>
                <p>Nenhuma venda no período</p>
            </div>
        `;
    }
}

function atualizarListaVendas(vendas) {
    const container = document.getElementById('listaVendas');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (vendas.length === 0) {
        container.innerHTML = `
            <div class="vazio" style="padding: 30px;">
                <i class="fa-solid fa-receipt"></i>
                <p>Nenhuma venda encontrada</p>
            </div>
        `;
        return;
    }
    
    const nomesPagamento = {
        'dinheiro': '💰 Dinheiro',
        'pix': '📱 PIX',
        'credito': '💳 Crédito',
        'debito': '💳 Débito'
    };
    
    vendas.forEach(venda => {
        const div = document.createElement('div');
        div.className = 'venda-detalhada-item';
        div.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 12px;
            margin-bottom: 10px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        div.onclick = () => mostrarDetalhesVenda(venda);
        
        const itensResumo = venda.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
        const nomePagamento = nomesPagamento[venda.pagamento] || venda.pagamento;
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div>
                    <span style="font-weight: 600;">${venda.data}</span>
                    <span style="font-size: 12px; color: #64748b; margin-left: 8px;">${nomePagamento}</span>
                </div>
                <span style="font-weight: 700; color: #1b6b4c;">R$ ${venda.total.toFixed(2)}</span>
            </div>
            <div style="font-size: 13px; color: #4d6373;">${itensResumo}</div>
        `;
        
        container.appendChild(div);
    });
}

function filtrarVendas() {
    const termo = document.getElementById('buscaVendas').value.toLowerCase();
    const vendasFiltradasPorProduto = vendasFiltradas.filter(v => {
        return v.itens.some(i => i.nome.toLowerCase().includes(termo));
    });
    atualizarListaVendas(vendasFiltradasPorProduto);
}

function mostrarDetalhesVenda(venda) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.alignItems = 'center';
    
    const nomesPagamento = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'credito': 'Cartão de Crédito',
        'debito': 'Cartão de Débito'
    };
    
    const itensHtml = venda.itens.map(i => `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eef2f6;">
            <div>
                <span style="font-weight: 500;">${i.nome}</span>
                <span style="font-size: 12px; color: #64748b; margin-left: 8px;">${i.quantidade}x</span>
            </div>
            <span>R$ ${i.subtotal.toFixed(2)}</span>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="border-radius: 30px;">
            <div class="modal-header">
                <h3>Detalhes da Venda</h3>
                <div class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fa-solid fa-times"></i>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: #f8fafc; border-radius: 20px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Data:</span>
                        <span>${venda.data}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Pagamento:</span>
                        <span>${nomesPagamento[venda.pagamento] || venda.pagamento}</span>
                    </div>
                    <div style="border-top: 1px solid #e2e8f0; margin-top: 8px; padding-top: 8px;">
                        <div style="font-weight: 600; margin-bottom: 8px;">Produtos:</div>
                        ${itensHtml}
                    </div>
                    <div style="border-top: 2px solid #e2e8f0; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
                        <span style="font-weight: 700;">Total:</span>
                        <span style="font-weight: 700; font-size: 18px; color: #1b6b4c;">R$ ${venda.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <button class="btn-salvar" onclick="this.closest('.modal').remove()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function carregarRelatoriosPersonalizados() {
    const dataInicio = document.getElementById('dataInicioRel').value;
    const dataFim = document.getElementById('dataFimRel').value;
    const feiraAtivaId = parseInt(localStorage.getItem('feiraAtivaId') || '1');
    
    if (!dataInicio || !dataFim) {
        alert('Selecione as datas de início e fim!');
        return;
    }
    
    const inicio = new Date(dataInicio);
    inicio.setHours(0, 0, 0, 0);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59, 999);
    
    document.getElementById('periodoAtual').textContent = `${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`;
    
    carregarDadosRelatorios(feiraAtivaId, inicio, fim);
}

function toggleFiltroPersonalizado() {
    const periodo = document.querySelector('.btn-periodo.ativo')?.dataset.periodo;
    const filtroPersonalizado = document.getElementById('filtroPersonalizado');
    
    if (periodo === 'personalizado') {
        filtroPersonalizado.style.display = 'block';
    } else {
        filtroPersonalizado.style.display = 'none';
    }
}

function initRelatoriosEventos() {
    const botoesPeriodo = document.querySelectorAll('.btn-periodo');
    if (botoesPeriodo.length > 0) {
        botoesPeriodo.forEach(btn => {
            btn.addEventListener('click', () => {
                botoesPeriodo.forEach(b => b.classList.remove('ativo'));
                btn.classList.add('ativo');
                toggleFiltroPersonalizado();
                carregarRelatorios();
            });
        });
    }
}

// ===== RELATÓRIO POR FEIRA =====
// ===== RELATÓRIO POR FEIRA =====
function carregarVendasPorFeira() {
    // Verificar se Chart.js está carregado
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não carregado. Aguardando...');
        // Tentar novamente após 500ms
        setTimeout(carregarVendasPorFeira, 500);
        return;
    }
    
    const todasFeiras = Storage.getFeiras();
    const dados = JSON.parse(localStorage.getItem('feiraMini')) || {};
    
    // Calcular período (últimos 30 dias)
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);
    trintaDiasAtras.setHours(0, 0, 0, 0);
    
    const vendasPorFeira = [];
    const nomesFeiras = [];
    const cores = [
        '#1b6b4c', '#2c5a7a', '#e65100', '#b33f3f', 
        '#4a6b8f', '#e6b800', '#7c4dff', '#ff7043',
        '#00acc1', '#8d6e63', '#5c6bc0', '#f06292'
    ];
    
    todasFeiras.forEach((feira, index) => {
        // Buscar vendas da feira no período
        let vendasFeira = [];
        if (dados.historicoVendas && dados.historicoVendas[feira.id]) {
            vendasFeira = dados.historicoVendas[feira.id].filter(v => {
                const dataVenda = new Date(v.timestamp);
                return dataVenda >= trintaDiasAtras && dataVenda <= hoje;
            });
        }
        
        const totalVendas = vendasFeira.reduce((acc, v) => acc + v.total, 0);
        const qtdVendas = vendasFeira.length;
        
        vendasPorFeira.push({
            id: feira.id,
            nome: feira.nome,
            total: totalVendas,
            quantidade: qtdVendas,
            cor: cores[index % cores.length]
        });
        
        nomesFeiras.push(feira.nome);
    });
    
    // Ordenar por total de vendas (decrescente)
    vendasPorFeira.sort((a, b) => b.total - a.total);
    
    // Atualizar gráfico
    atualizarGraficoVendasPorFeira(vendasPorFeira);
    
    // Adicionar resumo abaixo do gráfico
    adicionarResumoVendasPorFeira(vendasPorFeira);
}

function atualizarGraficoVendasPorFeira(dados) {
    const canvas = document.getElementById('graficoVendasPorFeira');
    if (!canvas) {
        console.error('Canvas graficoVendasPorFeira não encontrado');
        return;
    }
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está disponível');
        return;
    }
    
    const nomes = dados.map(d => d.nome);
    const valores = dados.map(d => d.total);
    const cores = dados.map(d => d.cor);
    
    // Função para truncar nomes longos
    const nomesTruncados = nomes.map(nome => 
        nome.length > 15 ? nome.substring(0, 12) + '...' : nome
    );
    
    // Destruir gráfico anterior se existir
    if (window.graficoPorFeira) {
        window.graficoPorFeira.destroy();
        window.graficoPorFeira = null;
    }
    
    try {
        window.graficoPorFeira = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: nomesTruncados,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: valores,
                    backgroundColor: cores,
                    borderColor: cores.map(c => c),
                    borderWidth: 1,
                    borderRadius: 8,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.raw;
                                const feira = dados[context.dataIndex];
                                return [
                                    `Total: R$ ${valor.toFixed(2)}`,
                                    `Vendas: ${feira.quantidade} transações`
                                ];
                            },
                            title: function(context) {
                                return dados[context[0].dataIndex].nome;
                            }
                        },
                        bodyAlign: 'left',
                        titleAlign: 'center'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        },
                        grid: {
                            color: '#e2e8f0'
                        },
                        title: {
                            display: true,
                            text: 'Valor em Reais (R$)',
                            color: '#64748b',
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Feiras',
                            color: '#64748b',
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                // Adicionar fallback para quando não há dados
                onComplete: function() {
                    if (valores.every(v => v === 0)) {
                        console.log('Nenhum dado de venda para mostrar');
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
    }
}

function adicionarResumoVendasPorFeira(dados) {
    const container = document.querySelector('.comparativo-feiras');
    if (!container) return;
    
    // Remover resumo antigo se existir
    const resumoAntigo = container.querySelector('.resumo-feiras');
    if (resumoAntigo) resumoAntigo.remove();
    
    const totalGeral = dados.reduce((acc, d) => acc + d.total, 0);
    const mediaVendas = dados.length > 0 ? totalGeral / dados.length : 0;
    const feiraTop = dados.length > 0 ? dados[0] : null;
    
    const resumoDiv = document.createElement('div');
    resumoDiv.className = 'resumo-feiras';
    resumoDiv.style.cssText = `
        background: #f8fafc;
        border-radius: 20px;
        padding: 12px;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
    `;
    
    resumoDiv.innerHTML = `
        <div style="flex: 1; text-align: center; background: white; border-radius: 16px; padding: 8px;">
            <div style="font-size: 11px; color: #64748b;">Total Geral</div>
            <div style="font-size: 20px; font-weight: 700; color: #1e3b4f;">R$ ${totalGeral.toFixed(2)}</div>
        </div>
        <div style="flex: 1; text-align: center; background: white; border-radius: 16px; padding: 8px;">
            <div style="font-size: 11px; color: #64748b;">Média por Feira</div>
            <div style="font-size: 18px; font-weight: 600; color: #2c5a7a;">R$ ${mediaVendas.toFixed(2)}</div>
        </div>
        ${feiraTop ? `
        <div style="flex: 1; text-align: center; background: white; border-radius: 16px; padding: 8px;">
            <div style="font-size: 11px; color: #64748b;">🏆 Feira Destaque</div>
            <div style="font-size: 14px; font-weight: 600; color: #e65100;">${feiraTop.nome}</div>
            <div style="font-size: 13px;">R$ ${feiraTop.total.toFixed(2)}</div>
        </div>
        ` : ''}
    `;
    
    // Inserir após o gráfico
    const chartContainer = container.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.after(resumoDiv);
    } else {
        container.appendChild(resumoDiv);
    }
}

function atualizarGraficoVendasPorFeira(dados) {
    const ctx = document.getElementById('graficoVendasPorFeira');
    if (!ctx) return;
    
    const nomes = dados.map(d => d.nome);
    const valores = dados.map(d => d.total);
    const cores = dados.map(d => d.cor);
    
    // Função para truncar nomes longos
    const nomesTruncados = nomes.map(nome => 
        nome.length > 15 ? nome.substring(0, 12) + '...' : nome
    );
    
    if (window.graficoPorFeira) {
        window.graficoPorFeira.data.labels = nomesTruncados;
        window.graficoPorFeira.data.datasets[0].data = valores;
        window.graficoPorFeira.data.datasets[0].backgroundColor = cores;
        window.graficoPorFeira.update();
    } else {
        window.graficoPorFeira = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nomesTruncados,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: valores,
                    backgroundColor: cores,
                    borderColor: cores.map(c => c),
                    borderWidth: 1,
                    borderRadius: 8,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const valor = context.raw;
                                const feira = dados[context.dataIndex];
                                return [
                                    `Total: R$ ${valor.toFixed(2)}`,
                                    `Vendas: ${feira.quantidade} transações`
                                ];
                            },
                            title: function(context) {
                                return dados[context[0].dataIndex].nome;
                            }
                        },
                        bodyAlign: 'left',
                        titleAlign: 'center'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        },
                        grid: {
                            color: '#e2e8f0'
                        },
                        title: {
                            display: true,
                            text: 'Valor em Reais (R$)',
                            color: '#64748b'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Feiras',
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }
}

function adicionarResumoVendasPorFeira(dados) {
    const container = document.querySelector('.comparativo-feiras');
    if (!container) return;
    
    // Remover resumo antigo se existir
    const resumoAntigo = container.querySelector('.resumo-feiras');
    if (resumoAntigo) resumoAntigo.remove();
    
    const totalGeral = dados.reduce((acc, d) => acc + d.total, 0);
    const mediaVendas = dados.length > 0 ? totalGeral / dados.length : 0;
    const feiraTop = dados.length > 0 ? dados[0] : null;
    
    const resumoDiv = document.createElement('div');
    resumoDiv.className = 'resumo-feiras';
    resumoDiv.style.cssText = `
        background: #f8fafc;
        border-radius: 20px;
        padding: 12px;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
    `;
    
    resumoDiv.innerHTML = `
        <div style="flex: 1; text-align: center;">
            <div style="font-size: 11px; color: #64748b;">Total Geral</div>
            <div style="font-size: 20px; font-weight: 700; color: #1e3b4f;">R$ ${totalGeral.toFixed(2)}</div>
        </div>
        <div style="flex: 1; text-align: center;">
            <div style="font-size: 11px; color: #64748b;">Média por Feira</div>
            <div style="font-size: 18px; font-weight: 600; color: #2c5a7a;">R$ ${mediaVendas.toFixed(2)}</div>
        </div>
        ${feiraTop ? `
        <div style="flex: 1; text-align: center;">
            <div style="font-size: 11px; color: #64748b;">🏆 Feira Destaque</div>
            <div style="font-size: 14px; font-weight: 600; color: #e65100;">${feiraTop.nome}</div>
            <div style="font-size: 13px;">R$ ${feiraTop.total.toFixed(2)}</div>
        </div>
        ` : ''}
    `;
    
    // Inserir após o gráfico
    const chartContainer = container.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.after(resumoDiv);
    } else {
        container.appendChild(resumoDiv);
    }
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    // Caminho correto para GitHub Pages (case sensitive!)
    navigator.serviceWorker.register('/FeiraMini/sw.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso!', registration);
        })
        .catch(error => {
            console.log('Falha ao registrar Service Worker:', error);
        });
}
