/* ==========================================================================
   LUMINA LIVROS — produto.js
   Responsável: Leonardo (Req 17 - JavaScript: DOM + eventos, sem fetch).

   O QUE ESSE ARQUIVO FAZ:
   1) Lê o número depois de "?id=" na URL da página
      (ex: produto.html?id=3  ->  id = 3)
   2) Procura, dentro do array "produtos" (vindo de produtos-dados.js),
      o objeto cujo campo "id" é igual a esse número.
   3) Usa esse objeto para preencher os elementos da página (título,
      autor, preço, imagem, descrição, lista de detalhes).
   4) Adiciona um evento de clique num botão como exemplo de
      "automatizar eventos" (Req 17).

   IMPORTANTE: este arquivo depende de "produtos-dados.js" já ter sido
   carregado ANTES dele no HTML (o array "produtos" precisa existir).
   ========================================================================== */

// Transforma "2020-11-09" em "09/11/2020" (formato mais comum no Brasil)
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 1) Pegar o "id" da URL -------------------------------------------
  const parametros = new URLSearchParams(window.location.search);
  const idProduto = Number(parametros.get('id'));

  // --- 2) Procurar o produto correspondente no array ----------------------
  const produto = produtos.find((item) => item.id === idProduto);

  if (!produto) {
    const areaDados = document.querySelector('#dados-produto');
    if (areaDados) {
      areaDados.innerHTML = '<h1>Produto não encontrado</h1><p>Verifique o link acessado.</p>';
    }
    return;
  }

  // --- 3) Preencher os elementos simples da página ------------------------
  const elTitulo = document.querySelector('#titulo-produto');
  if (elTitulo) elTitulo.textContent = produto.titulo;

  const elAutor = document.querySelector('#autor-produto');
  if (elAutor) elAutor.textContent = produto.autor;

  const elPreco = document.querySelector('#preco-produto');
  if (elPreco) {
    elPreco.textContent = 'R$ ' + produto.preco.toFixed(2).replace('.', ',');
  }

  const elImagem = document.querySelector('#imagem-produto');
  if (elImagem) {
    elImagem.src = '../' + produto.imagem;
    elImagem.alt = 'Capa do livro ' + produto.titulo;
  }

  const elDescricao = document.querySelector('#descricao-produto');
  if (elDescricao) elDescricao.textContent = produto.descricaoCurta;

  document.title = produto.titulo + ' | Lumina Livros';

  // --- 4) Lista "O que você precisa saber sobre este produto" -------------
  // Monta uma lista de pares [rótulo, valor] a partir dos campos do produto
  // e transforma cada par em um <li>.
  const elListaDetalhes = document.querySelector('#lista-detalhes-produto');
  if (elListaDetalhes) {
    const detalhes = [
      ['Gênero', produto.genero],
      ['Editora', produto.editora],
      ['Edição', produto.edicao],
      ['Número de páginas', produto.paginas],
      ['Data de publicação', formatarData(produto.publicacao)],
      ['Dimensões', produto.dimensoes],
      ['ISBN', produto.isbn],
    ];

    elListaDetalhes.innerHTML = detalhes
      .map(([rotulo, valor]) => `<li><strong>${rotulo}:</strong> ${valor}</li>`)
      .join('');
  }

  // --- 5) Evento automatizado (Req 17): favoritar --------------------------
  const botaoFavoritar = document.querySelector('#botao-favoritar');
  if (botaoFavoritar) {
    botaoFavoritar.addEventListener('click', () => {
      const favoritado = botaoFavoritar.classList.toggle('favoritado');
      botaoFavoritar.textContent = favoritado ? '★ Favoritado' : '☆ Favoritar';
    });
  }

  // --- 6) Evento automatizado (Req 17): adicionar ao carrinho --------------
  // Ao clicar, o produto é realmente salvo no carrinho (via adicionarAoCarrinho,
  // função de js/carrinho.js, que precisa estar carregada ANTES deste arquivo).
  // Além disso, o botão muda de texto/cor por 2 segundos (feedback visual)
  // e depois volta ao normal. setTimeout() agenda um código para rodar
  // depois de um tempo (aqui, 2000 milissegundos = 2 segundos).
  const botaoCarrinho = document.querySelector('#botao-carrinho');
  if (botaoCarrinho) {
    const textoOriginal = botaoCarrinho.textContent;

    botaoCarrinho.addEventListener('click', () => {
      adicionarAoCarrinho({
        id: produto.id,
        titulo: produto.titulo,
        preco: produto.preco,
        imagem: produto.imagem,
      });

      botaoCarrinho.textContent = '✔ Adicionado ao Carrinho';
      botaoCarrinho.classList.add('adicionado');

      setTimeout(() => {
        botaoCarrinho.textContent = textoOriginal;
        botaoCarrinho.classList.remove('adicionado');
      }, 2000);
    });
  }

});
