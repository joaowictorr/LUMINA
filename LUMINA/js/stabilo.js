/* ==========================================================================
   LUMINA LIVROS — stabilo.js
   Responsável: Leonardo (Req 17 - JavaScript: DOM + array, sem fetch).

   O QUE ESSE ARQUIVO FAZ:
   1) Pega o array "produtos" (vindo de produtos-dados.js, carregado ANTES
      deste script no stabilo.html).
   2) Filtra apenas os itens da marca "Stabilo" que são marca-texto
      (gênero "Papelaria/Marca-texto"), deixando de fora outros produtos
      Stabilo, como a caneta Point 88.
   3) Monta um card para cada marca-texto encontrado dentro da grade.
   ========================================================================== */

function formatarPrecoStabilo(preco) {
  return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

function criarCardStabilo(produto) {
  return `
    <article class="card-lancamento">
      <a href="paginas-produtos/produto.html?id=${produto.id}">
        <img src="${produto.imagem}" alt="Foto do ${produto.titulo}">
        <div class="card-lancamento-info">
          <span class="card-lancamento-data">${produto.unidade}</span>
          <h3>${produto.titulo}</h3>
          <p class="card-lancamento-autor">${produto.descricaoCurta}</p>
        </div>
      </a>
      <div class="card-lancamento-rodape">
        <p class="card-lancamento-preco">${formatarPrecoStabilo(produto.preco)}</p>
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
  const areaProdutos = document.querySelector('#grade-stabilo');
  if (!areaProdutos) return;

  const marcaTextosStabilo = produtos.filter(
    (item) => item.marca === 'Stabilo' && item.genero === 'Papelaria/Marca-texto'
  );

  if (marcaTextosStabilo.length === 0) {
    areaProdutos.innerHTML = '<p>Nenhum marca-texto encontrado no momento.</p>';
    return;
  }

  areaProdutos.innerHTML = marcaTextosStabilo.map(criarCardStabilo).join('');
});
