/* ==========================================================================
   LUMINA LIVROS — carrinho.js
   Responsável: Leonardo (Req 17 - JavaScript: eventos, localStorage, DOM).

   O QUE ESSE ARQUIVO FAZ:
   1) Guarda os itens do carrinho no localStorage, então o carrinho continua
      preenchido mesmo se o usuário navegar entre as páginas do site.
   2) Cada item guardado tem o formato:
      { id, titulo, preco, imagem, quantidade }
   3) Atualiza o número no ícone do carrinho (cabeçalho) e desenha a lista
      de itens dentro do painel lateral (#painel-carrinho).
   4) Escuta cliques nos botões "Adicionar ao Carrinho" das grades de
      produtos (homepage, stabilo, agatha-christie) e no botão da página
      de produto, além dos botões de abrir/fechar o painel, aumentar/
      diminuir quantidade, remover item e finalizar compra.

   IMPORTANTE: este arquivo precisa ser carregado em TODAS as páginas,
   antes de main.js (e antes de produto.js, que também usa a função
   adicionarAoCarrinho).
   ========================================================================== */

const CHAVE_CARRINHO = 'lumina-carrinho';

// --- Leitura e escrita no localStorage -------------------------------------

function lerCarrinho() {
  try {
    const dados = localStorage.getItem(CHAVE_CARRINHO);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error('Não foi possível ler o carrinho salvo:', erro);
    return [];
  }
}

function salvarCarrinho(carrinho) {
  try {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  } catch (erro) {
    console.error('Não foi possível salvar o carrinho:', erro);
  }
}

// --- Funções auxiliares ------------------------------------------------------

function formatarPrecoCarrinho(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function calcularTotalItens(carrinho) {
  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

function calcularTotalPreco(carrinho) {
  return carrinho.reduce((total, item) => total + item.quantidade * item.preco, 0);
}

// A página de produto fica dentro de paginas-produtos/, então as imagens
// (que vêm com caminho tipo "img/produtos/x.jpg") precisam do prefixo "../"
// quando o carrinho é aberto a partir dessa página.
function resolverCaminhoImagem(caminho) {
  if (!caminho) return '';
  const estaEmSubpasta = window.location.pathname.includes('/paginas-produtos/');
  const jaTemPrefixo = caminho.startsWith('../') || caminho.startsWith('http');
  return estaEmSubpasta && !jaTemPrefixo ? '../' + caminho : caminho;
}

// --- Operações do carrinho ----------------------------------------------------

function adicionarAoCarrinho(produto) {
  const carrinho = lerCarrinho();
  const itemExistente = carrinho.find((item) => item.id === produto.id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id,
      titulo: produto.titulo,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1,
    });
  }

  salvarCarrinho(carrinho);
  atualizarInterfaceCarrinho();
}

function removerDoCarrinho(id) {
  const carrinho = lerCarrinho().filter((item) => item.id !== id);
  salvarCarrinho(carrinho);
  atualizarInterfaceCarrinho();
}

function alterarQuantidade(id, delta) {
  const carrinho = lerCarrinho();
  const item = carrinho.find((produto) => produto.id === id);
  if (!item) return;

  item.quantidade += delta;

  const carrinhoAtualizado =
    item.quantidade <= 0
      ? carrinho.filter((produto) => produto.id !== id)
      : carrinho;

  salvarCarrinho(carrinhoAtualizado);
  atualizarInterfaceCarrinho();
}

function esvaziarCarrinho() {
  salvarCarrinho([]);
  atualizarInterfaceCarrinho();
}

// --- Renderização na tela ------------------------------------------------------

function criarItemCarrinhoHTML(item) {
  return `
    <li class="carrinho-item" data-id="${item.id}">
      <img src="${resolverCaminhoImagem(item.imagem)}" alt="Capa de ${item.titulo}">
      <div class="carrinho-item-info">
        <p class="carrinho-item-titulo">${item.titulo}</p>
        <p class="carrinho-item-preco">${formatarPrecoCarrinho(item.preco)}</p>
        <div class="carrinho-item-quantidade">
          <button type="button" class="botao-quantidade" data-acao="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade de ${item.titulo}">−</button>
          <span>${item.quantidade}</span>
          <button type="button" class="botao-quantidade" data-acao="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade de ${item.titulo}">+</button>
        </div>
      </div>
      <button type="button" class="botao-remover-item" data-id="${item.id}" aria-label="Remover ${item.titulo} do carrinho">🗑</button>
    </li>
  `;
}

function renderizarCarrinho() {
  const lista = document.querySelector('#carrinho-lista');
  const totalEl = document.querySelector('#carrinho-total');
  if (!lista || !totalEl) return;

  const carrinho = lerCarrinho();

  lista.innerHTML =
    carrinho.length === 0
      ? '<li class="carrinho-vazio">Seu carrinho está vazio.</li>'
      : carrinho.map(criarItemCarrinhoHTML).join('');

  totalEl.textContent = formatarPrecoCarrinho(calcularTotalPreco(carrinho));
}

function atualizarContador() {
  const contador = document.querySelector('#carrinho-contador');
  if (!contador) return;
  contador.textContent = calcularTotalItens(lerCarrinho());
}

function atualizarInterfaceCarrinho() {
  atualizarContador();
  renderizarCarrinho();
}

// --- Abrir/fechar o painel ------------------------------------------------------

function abrirCarrinho() {
  document.querySelector('#painel-carrinho')?.classList.add('aberto');
  document.querySelector('#fundo-carrinho')?.classList.add('visivel');
}

function fecharCarrinho() {
  document.querySelector('#painel-carrinho')?.classList.remove('aberto');
  document.querySelector('#fundo-carrinho')?.classList.remove('visivel');
}

// --- Eventos ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Sempre que uma página carrega, atualiza o número do ícone e a lista
  // do painel com o que já está salvo no localStorage.
  atualizarInterfaceCarrinho();

  document.querySelector('#botao-carrinho-header')?.addEventListener('click', abrirCarrinho);
  document.querySelector('#botao-fechar-carrinho')?.addEventListener('click', fecharCarrinho);
  document.querySelector('#fundo-carrinho')?.addEventListener('click', fecharCarrinho);

  document.querySelector('#botao-esvaziar-carrinho')?.addEventListener('click', esvaziarCarrinho);

  document.querySelector('#botao-finalizar-compra')?.addEventListener('click', () => {
    const carrinho = lerCarrinho();

    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    alert('Compra finalizada! Total: ' + formatarPrecoCarrinho(calcularTotalPreco(carrinho)));
    esvaziarCarrinho();
    fecharCarrinho();
  });

  // Delegação de eventos: os cards de produto são criados dinamicamente
  // (homepage.js, stabilo.js, agatha-christie.js), então o clique é
  // escutado no "document" e identificado pela classe do botão.
  document.addEventListener('click', (evento) => {
    const botaoAdicionar = evento.target.closest('.botao-adicionar-carrinho');
    if (botaoAdicionar) {
      adicionarAoCarrinho({
        id: Number(botaoAdicionar.dataset.id),
        titulo: botaoAdicionar.dataset.titulo,
        preco: Number(botaoAdicionar.dataset.preco),
        imagem: botaoAdicionar.dataset.imagem,
      });

      // Feedback visual rápido, igual ao usado no botão da página de produto
      const textoOriginal = botaoAdicionar.textContent;
      botaoAdicionar.textContent = '✔';
      botaoAdicionar.classList.add('adicionado');
      botaoAdicionar.disabled = true;

      setTimeout(() => {
        botaoAdicionar.textContent = textoOriginal;
        botaoAdicionar.classList.remove('adicionado');
        botaoAdicionar.disabled = false;
      }, 1000);

      return;
    }

    const botaoQuantidade = evento.target.closest('.botao-quantidade');
    if (botaoQuantidade) {
      const id = Number(botaoQuantidade.dataset.id);
      const delta = botaoQuantidade.dataset.acao === 'aumentar' ? 1 : -1;
      alterarQuantidade(id, delta);
      return;
    }

    const botaoRemover = evento.target.closest('.botao-remover-item');
    if (botaoRemover) {
      removerDoCarrinho(Number(botaoRemover.dataset.id));
    }
  });
});
