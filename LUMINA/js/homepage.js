/* ==========================================================================
   LUMINA LIVROS — homepage.js
   Responsável: Leonardo (Req 17 - JavaScript: DOM + array, sem fetch).

   O QUE ESSE ARQUIVO FAZ:
   1) Pega o array "produtos" (vindo de produtos-dados.js, que precisa ser
      carregado ANTES deste script no homepage.html).
   2) Filtra apenas os livros (categoria "Livro") e ordena pela data de
      publicação, do mais novo pro mais antigo.
   3) Pega os 4 primeiros e monta um "card" de livro para cada um dentro
      da seção "Lançamentos".
   ========================================================================== */

// Recebe "2026-08-14" e devolve "14/08/2026"
function formatarDataLancamento(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Recebe um número (ex: 60) e devolve "R$ 60,00"
function formatarPrecoLancamento(preco) {
  return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

// Monta o HTML de um card de lançamento a partir de um objeto "produto".
// Preço e botão "Adicionar ao Carrinho" ficam FORA do <a>, porque não é
// válido colocar um <button> dentro de um link (Req 17: evento de carrinho).
function criarCardLancamento(produto) {
  return `
    <article class="card-lancamento">
      <a href="paginas-produtos/produto.html?id=${produto.id}">
        <img src="${produto.imagem}" alt="Capa do livro ${produto.titulo}">
        <div class="card-lancamento-info">
          <span class="card-lancamento-data">Lançado em ${formatarDataLancamento(produto.publicacao)}</span>
          <h3>${produto.titulo}</h3>
          <p class="card-lancamento-autor">${produto.autor}</p>
        </div>
      </a>
      <div class="card-lancamento-rodape">
        <p class="card-lancamento-preco">${formatarPrecoLancamento(produto.preco)}</p>
        <button
          type="button"
          class="botao-adicionar-carrinho"
          data-id="${produto.id}"
          data-titulo="${produto.titulo}"
          data-preco="${produto.preco}"
          data-imagem="${produto.imagem}"
          aria-label="Adicionar ${produto.titulo} ao carrinho"
        >+ Carrinho</button>
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const areaLancamentos = document.querySelector('#grade-lancamentos');

  // Se este script for carregado em outra página (sem essa área), não faz nada
  if (!areaLancamentos) return;

  // 1) Filtra só os livros que têm data de publicação preenchida
  const livros = produtos.filter((item) => item.categoria === 'Livro' && item.publicacao);

  // 2) Ordena do lançamento mais recente para o mais antigo
  livros.sort((a, b) => b.publicacao.localeCompare(a.publicacao));

  // 3) Pega os 4 primeiros e transforma cada um em um card
  const maisRecentes = livros.slice(0, 4);
  areaLancamentos.innerHTML = maisRecentes.map(criarCardLancamento).join('');
});
