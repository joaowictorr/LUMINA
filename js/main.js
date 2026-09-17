/* ==========================================================================
   LUMINA LIVROS — main.js
   Scripts globais. Responsável: Leonardo (Req 17 - JavaScript puro,
   sem frameworks/bibliotecas externas).
   ========================================================================== */

// Exemplo de estrutura para carregar produtos.json (usar em catalogo.html
// e em paginas-produtos/produto.html).
//
// async function carregarProdutos() {
//   try {
//     const resposta = await fetch('../produtos.json');
//     const produtos = await resposta.json();
//     return produtos;
//   } catch (erro) {
//     console.error('Erro ao carregar produtos:', erro);
//     return [];
//   }
// }

document.addEventListener('DOMContentLoaded', () => {
  // Ponto de entrada geral. Cada página pode chamar suas próprias funções
  // aqui (ex: renderizar catálogo, montar produto.html via ?id=, etc).
  console.log('Lumina Livros — main.js carregado.');
});
