function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// escreve um valor dentro de uma célula da tabela; se não houver valor, mostra "—"
function preencherCelula(id, valor) {
  const celula = document.querySelector('#' + id);
  if (!celula) return;
  if (valor === undefined || valor === null || valor === '') {
    celula.textContent = '—';
  } else {
    celula.textContent = valor;
  }
}

// Preenche o rótulo (rot-) e o dado (tab-) de uma linha da tabela
function preencherLinha(posicao, rotulo, valor) {
  preencherCelula('rot-' + posicao, rotulo);
  preencherCelula('tab-' + posicao, valor);
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 1) Pegar o "id" da URL ---
  const parametros = new URLSearchParams(window.location.search);
  const idProduto = Number(parametros.get('id'));

  // --- 2) Procurar o produto correspondente ---
  const produto = produtos.find((item) => item.id === idProduto);

  if (!produto) {
    const areaDados = document.querySelector('#dados-produto');
    if (areaDados) {
      areaDados.innerHTML = '<h1>Produto não encontrado</h1><p>Verifique o link acessado.</p>';
    }
    return;
  }

  // --- 3) Preencher dados básicos ---
  const elTitulo = document.querySelector('#titulo-produto');
  if (elTitulo) elTitulo.textContent = produto.titulo;

  const elAutor = document.querySelector('#autor-produto');
  if (elAutor) elAutor.textContent = produto.autor || '';

  const elPreco = document.querySelector('#preco-produto');
  if (elPreco) {
    elPreco.textContent = produto.preco ? 'R$ ' + produto.preco.toFixed(2).replace('.', ',') : 'Consultar valor';
  }

  const elImagem = document.querySelector('#imagem-produto');
  if (elImagem) {
    elImagem.src = '../' + produto.imagem;
    elImagem.alt = 'Capa do livro ' + produto.titulo;
  }

  const elDescricao = document.querySelector('#descricao-produto');
  if (elDescricao) elDescricao.textContent = produto.descricaoCurta;

  document.title = produto.titulo + ' | Lumina Livros';

  // --- 4) Preencher Ficha Técnica / Detalhes ---
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
      .filter(([_, valor]) => valor !== undefined && valor !== null)
      .map(([rotulo, valor]) => `<li><strong>${rotulo}:</strong> ${valor}</li>`)
      .join('');
  }

  // --- 4.1) Preencher a tabela da Ficha Técnica (Req 12) ---
  // Título, autor/marca e descrição são iguais para todos os produtos
  preencherCelula('tab-titulo', produto.titulo);
  preencherCelula('tab-autor', produto.autor || produto.marca);
  preencherCelula('tab-descricao', produto.descricaoCurta);

  const precoTexto = produto.preco ? 'R$ ' + produto.preco.toFixed(2).replace('.', ',') : 'Consultar valor';

  // Os demais campos (rótulo + dado) mudam conforme a categoria do produto
  if (produto.categoria === 'Livro') {
    preencherLinha('5a', 'Idioma', produto.idioma);
    preencherLinha('5b', 'Tipo de capa', produto.tipoCapa);
    preencherLinha('6a', 'Editora', produto.editora);
    preencherLinha('6b', 'Edição', produto.edicao);
    preencherLinha('7a', 'Páginas', produto.paginas);
    preencherLinha('7b', 'Dimensões', produto.dimensoes);
    preencherLinha('8a', 'ISBN', produto.isbn);
    preencherLinha('8b', 'Publicação', formatarData(produto.publicacao));
    preencherLinha('9a', 'Preço', precoTexto);
    preencherLinha('9b', 'Gênero', produto.genero);
    preencherLinha('11', 'Parte da série', produto.serie);
  } else {
    preencherLinha('5a', 'Cor da tinta', produto.corTinta);
    preencherLinha('5b', 'Tipo de ponta', produto.tipoPonta);
    preencherLinha('6a', 'Formato do item', produto.formatoItem);
    preencherLinha('6b', 'Tipo de grafite', produto.tipoGrafite);
    preencherLinha('7a', 'Unidade', produto.unidade);
    preencherLinha('7b', 'Dimensões', produto.dimensoes);
    preencherLinha('8a', 'Categoria', produto.categoria);
    preencherLinha('8b', 'Gênero', produto.genero);
    preencherLinha('9a', 'Preço', precoTexto);
    preencherLinha('9b', 'Cor', produto.cor);
    preencherLinha('11', 'Uso recomendado', produto.adequacao);
  }

  // --- 5) Botão Favoritar ---
  const botaoFavoritar = document.querySelector('#botao-favoritar');
  if (botaoFavoritar) {
    botaoFavoritar.addEventListener('click', () => {
      const favoritado = botaoFavoritar.classList.toggle('favoritado');
      botaoFavoritar.textContent = favoritado ? '★ Favoritado' : '☆ Favoritar';
    });
  }

  // --- 6) Botão Carrinho ---
  const botaoCarrinho = document.querySelector('#botao-carrinho');
  if (botaoCarrinho) {
    const textoOriginal = botaoCarrinho.textContent;

    botaoCarrinho.addEventListener('click', () => {
      botaoCarrinho.textContent = '✔ Adicionado ao Carrinho';
      botaoCarrinho.classList.add('adicionado');

      setTimeout(() => {
        botaoCarrinho.textContent = textoOriginal;
        botaoCarrinho.classList.remove('adicionado');
      }, 2000);
    });
  }

  // --- 7) Inserir o Texto Completo da Resenha diretamente na página ---
  const elTextoResenha = document.querySelector('#texto-resenha-completa');
  if (elTextoResenha) {
    if (produto.categoria === 'Papelaria' || !produto.resenhaCompleta) {
      elTextoResenha.innerHTML = '<p>Este produto não possui uma resenha cadastrada.</p>';
    } else {
      elTextoResenha.innerHTML = produto.resenhaCompleta;
    }
  }

});