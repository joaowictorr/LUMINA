
// Recebe um número (ex: 60) e devolve "R$ 60,00". Sem preço, devolve "Consultar valor".
function formatarPrecoCatalogo(preco) {
  return preco != null ? 'R$ ' + preco.toFixed(2).replace('.', ',') : 'Consultar valor';
}

// monta o card de um produto (livro ou papelaria) para a grade principal
function criarCardProduto(produto) {
  const autorOuMarca = produto.autor || produto.marca || '';
  return `
    <article class="card-lancamento" data-genero="${produto.genero}">
      <a href="paginas-produtos/produto.html?id=${produto.id}">
        <img src="${produto.imagem}" alt="${produto.categoria === 'Livro' ? 'Capa do livro' : 'Foto do produto'} ${produto.titulo}">
        <div class="card-lancamento-info">
          <span class="card-lancamento-data">${produto.genero}</span>
          <h3>${produto.titulo}</h3>
          <p class="card-lancamento-autor">${autorOuMarca}</p>
          <p class="card-lancamento-preco">${formatarPrecoCatalogo(produto.preco)}</p>
        </div>
      </a>
    </article>
  `;
}

// renderiza a grade de produtos, opcionalmente filtrando por genero
function renderizarGrade(listaProdutos) {
  const grade = document.querySelector('#grade-catalogo');
  const contador = document.querySelector('#contador-produtos');
  if (!grade) return;

  grade.innerHTML = listaProdutos.map(criarCardProduto).join('');
  if (contador) {
    contador.textContent = `${listaProdutos.length} produto(s)`;
  }
}

// monta os botões de filtro de genero a partir dos gêneros existentes em "produtos"
function montarFiltrosGenero() {
  const listaFiltros = document.querySelector('#filtros-genero');
  if (!listaFiltros) return;

  // generos unicos, em ordem alfabetica
  const generos = [...new Set(produtos.map((p) => p.genero))].sort();

  // "Todos" sempre primeiro, depois um <li> por genrro
  const itensHtml = ['Todos', ...generos]
    .map((genero, indice) => {
      const ativo = indice === 0 ? 'ativo' : '';
      return `<li><button class="botao-filtro ${ativo}" data-genero="${genero}">${genero}</button></li>`;
    })
    .join('');

  listaFiltros.innerHTML = itensHtml;

  // clique em um filtro: marca como ativo e filtra a grade
  listaFiltros.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.botao-filtro');
    if (!botao) return;

    listaFiltros.querySelectorAll('.botao-filtro').forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');

    const generoEscolhido = botao.dataset.genero;
    const tituloGrade = document.querySelector('#titulo-grade-catalogo');

    if (generoEscolhido === 'Todos') {
      renderizarGrade(produtos);
      if (tituloGrade) tituloGrade.textContent = 'Todos os produtos';
    } else {
      renderizarGrade(produtos.filter((p) => p.genero === generoEscolhido));
      if (tituloGrade) tituloGrade.textContent = generoEscolhido;
    }
  });
}

// monta o "Mais vendidos" (ol) a partir de uma lista de ids
function montarMaisVendidos() {
  const lista = document.querySelector('#lista-mais-vendidos');
  if (!lista) return;

  // ranking fixo
  const idsMaisVendidos = [1, 2, 9, 15, 20];

  const itensHtml = idsMaisVendidos
    .map((id) => produtos.find((p) => p.id === id))
    .filter(Boolean)
    .map((produto) => `
      <li>
        <a href="paginas-produtos/produto.html?id=${produto.id}">
          <strong>${produto.titulo}</strong> — ${produto.autor || produto.marca}
        </a>
      </li>
    `)
    .join('');

  lista.innerHTML = itensHtml;
}

// monta "Generos com mais títulos" (ol) contando quantos produtos existem por genero
function montarGenerosEmAlta() {
  const lista = document.querySelector('#lista-generos-em-alta');
  if (!lista) return;

  const contagemPorGenero = {};
  produtos.forEach((p) => {
    contagemPorGenero[p.genero] = (contagemPorGenero[p.genero] || 0) + 1;
  });

  const generosOrdenados = Object.entries(contagemPorGenero)
    .sort((a, b) => b[1] - a[1]) // do genero com mais títulos para o com menos
    .slice(0, 5); // top 5

  lista.innerHTML = generosOrdenados
    .map(([genero, quantidade]) => `<li>${genero} <span class="contagem-genero">(${quantidade} título${quantidade > 1 ? 's' : ''})</span></li>`)
    .join('');
}

// monta "autores em destaque" (dl) agrupando os livros por autor
function montarListaAutores() {
  const lista = document.querySelector('#lista-autores');
  if (!lista) return;

  const livros = produtos.filter((p) => p.categoria === 'Livro' && p.autor);

  const porAutor = {};
  livros.forEach((livro) => {
    if (!porAutor[livro.autor]) {
      porAutor[livro.autor] = { quantidade: 0, generos: new Set() };
    }
    porAutor[livro.autor].quantidade += 1;
    porAutor[livro.autor].generos.add(livro.genero);
  });

  const autoresOrdenados = Object.entries(porAutor).sort((a, b) => a[0].localeCompare(b[0]));

  lista.innerHTML = autoresOrdenados
    .map(([autor, info]) => {
      const generosTexto = [...info.generos].join(', ');
      const tituloTexto = info.quantidade > 1 ? `${info.quantidade} títulos` : '1 título';
      return `<dt>${autor}</dt><dd>${tituloTexto} no catálogo · ${generosTexto}</dd>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // se esta página não tiver a grade do catálogo, não faz nada (script global)
  if (!document.querySelector('#grade-catalogo')) return;

  renderizarGrade(produtos);
  montarFiltrosGenero();
  montarMaisVendidos();
  montarGenerosEmAlta();
  montarListaAutores();
});
