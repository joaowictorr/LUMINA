// recebe "2026-08-14" e devolve "14/08/2026"
function formatarDataLancamento(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// recebe um número (ex: 60) e devolve "R$ 60,00"
function formatarPrecoLancamento(preco) {
  return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

// monta o html de um card de lançamento a partir de um objeto "produto"
function criarCardLancamento(produto) {
  return `
    <article class="card-lancamento">
      <a href="paginas-produtos/produto.html?id=${produto.id}">
        <img src="${produto.imagem}" alt="Capa do livro ${produto.titulo}">
        <div class="card-lancamento-info">
          <span class="card-lancamento-data">Lançado em ${formatarDataLancamento(produto.publicacao)}</span>
          <h3>${produto.titulo}</h3>
          <p class="card-lancamento-autor">${produto.autor}</p>
          <p class="card-lancamento-preco">${formatarPrecoLancamento(produto.preco)}</p>
        </div>
      </a>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const areaLancamentos = document.querySelector('#grade-lancamentos');

  if (!areaLancamentos) return;

  // 1 filtra so os livros com data de publicacao
  const livros = produtos.filter((item) => item.categoria === 'Livro' && item.publicacao);

  // 2 ordem do lançamento mais recente para o mais antigo
  livros.sort((a, b) => b.publicacao.localeCompare(a.publicacao));

  // 3 pega os 4 primeiros e transforma cada um em um card
  const maisRecentes = livros.slice(0, 4);
  areaLancamentos.innerHTML = maisRecentes.map(criarCardLancamento).join('');
});
