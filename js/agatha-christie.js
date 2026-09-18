/* ==========================================================================
   LUMINA LIVROS — agatha-christie.js
   Responsável: Leonardo (Req 17 - JavaScript: DOM + array, sem fetch).

   O QUE ESSE ARQUIVO FAZ:
   1) Pega o array "produtos" (vindo de produtos-dados.js, carregado ANTES
      deste script no agatha-christie.html).
   2) Filtra apenas os livros cujo campo "autor" é "Agatha Christie".
   3) Monta um card para cada livro encontrado dentro da grade da página.
   ========================================================================== */

function formatarPrecoAgatha(preco) {
  return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

function criarCardAgatha(produto) {
  return `
    <article class="card-lancamento">
      <a href="paginas-produtos/produto.html?id=${produto.id}">
        <img src="${produto.imagem}" alt="Capa do livro ${produto.titulo}">
        <div class="card-lancamento-info">
          <span class="card-lancamento-data">${produto.genero}</span>
          <h3>${produto.titulo}</h3>
          <p class="card-lancamento-autor">${produto.editora} · ${produto.paginas} páginas</p>
          <p class="card-lancamento-preco">${formatarPrecoAgatha(produto.preco)}</p>
        </div>
      </a>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const areaLivros = document.querySelector('#grade-agatha');
  if (!areaLivros) return;

  const livrosDaAutora = produtos.filter((item) => item.autor === 'Agatha Christie');

  if (livrosDaAutora.length === 0) {
    areaLivros.innerHTML = '<p>Nenhum título encontrado no momento.</p>';
    return;
  }

  areaLivros.innerHTML = livrosDaAutora.map(criarCardAgatha).join('');
});
