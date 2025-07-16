// Dados dos livros com capítulos
const livros = [
  {
    id: 1,
    titulo: "Inteligência Emocional",
    imagem: "assets/images/inteligencia-emocional.jpg",
    totalCapitulos: 20,
    conteudo: Array.from({ length: 20 }, (_, i) => `Capítulo ${i + 1}: Conteúdo detalhado do capítulo ${i + 1} de Inteligência Emocional.`)
  },
  {
    id: 2,
    titulo: "As 48 Leis do Poder",
    imagem: "assets/images/48-leis-do-poder.jpg",
    totalCapitulos: 25,
    conteudo: Array.from({ length: 25 }, (_, i) => `Capítulo ${i + 1}: Conteúdo detalhado do capítulo ${i + 1} de As 48 Leis do Poder.`)
  },
  {
    id: 3,
    titulo: "Finanças Pessoais",
    imagem: "assets/images/financas-pessoais.jpg",
    totalCapitulos: 15,
    conteudo: Array.from({ length: 15 }, (_, i) => `Capítulo ${i + 1}: Conteúdo detalhado do capítulo ${i + 1} de Finanças Pessoais.`)
  }
];

// Constantes
const CAPITULOS_GRATIS = 10;

// Estado do usuário (simulação)
let usuario = null;

// Elementos DOM
const loginSection = document.getElementById('login-section');
const booksSection = document.getElementById('books-section');
const booksContainer = document.getElementById('books-container');
const userInfoSection = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userStatusSpan = document.getElementById('user-status');
const affiliateLinkAnchor = document.getElementById('affiliate-link');
const btnLogout = document.getElementById('btnLogout');
const loginForm = document.getElementById('login-form');

// Função para renderizar livros
function renderizarLivros() {
  booksContainer.innerHTML = livros.map(livro => `
    <div class="book-card" data-id="${livro.id}">
      <h3>${livro.titulo}</h3>
      <img src="${livro.imagem}" alt="${livro.titulo}" />
      <button class="btn-open-book">Abrir Livro</button>
      <div class="book-content hidden"></div>
    </div>
  `).join('');

  // Adiciona evento para abrir livro
  document.querySelectorAll('.btn-open-book').forEach(btn => {
    btn.addEventListener('click', abrirLivro);
  });
}

// Função para abrir livro e mostrar capítulos conforme plano
function abrirLivro(event) {
  const card = event.target.closest('.book-card');
  const livroId = parseInt(card.dataset.id);
  const livro = livros.find(l => l.id === livroId);
  const contentDiv = card.querySelector('.book-content');

  const maxCapitulos = usuario.isPremium ? livro.totalCapitulos : CAPITULOS_GRATIS;

  let conteudoHTML = '';
  for (let i = 0; i < maxCapitulos; i++) {
    conteudoHTML += `<p>${livro.conteudo[i]}</p>`;
  }

  if (!usuario.isPremium && livro.totalCapitulos > CAPITULOS_GRATIS) {
    conteudoHTML += `
      <p><strong>Você leu os ${CAPITULOS_GRATIS} capítulos grátis.</strong></p>
      <button class="btn btn-buy-premium">Comprar Plano Premium</button>
    `;
  }

  contentDiv.innerHTML = conteudoHTML;
  contentDiv.classList.remove('hidden');

  // Evento para comprar premium
  const btnBuy = contentDiv.querySelector('.btn-buy-premium');
  if (btnBuy) {
    btnBuy.addEventListener('click', () => {
      alert('Redirecionando para a página de compra do Plano Premium...');
      // Aqui você pode redirecionar para a página real de compra
    });
  }
}

// Função para atualizar a interface após login
function atualizarInterface() {
  if (!usuario) {
    loginSection.classList.remove('hidden');
    booksSection.classList.add('hidden');
    userInfoSection.classList.add('hidden');
    btnLogout.classList.add('hidden');
    return;
  }

  loginSection.classList.add('hidden');
  booksSection.classList.remove('hidden');
  userInfoSection.classList.remove('hidden');
  btnLogout.classList.remove('hidden');

  userNameSpan.textContent = usuario.nome;
  userStatusSpan.textContent = usuario.isPremium ? '(Premium)' : '(Básico)';
  affiliateLinkAnchor.textContent = usuario.isAffiliate ? usuario.linkAfiliado : 'Você não é afiliado';
  affiliateLinkAnchor.href = usuario.isAffiliate ? usuario.linkAfiliado : '#';

  renderizarLivros();
}

// Evento de login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('username').value.trim();
  const plano = document.getElementById('plan').value;
  const isAffiliate = document.getElementById('isAffiliate').checked;

  if (!nome) {
    alert('Por favor, informe seu nome de usuário.');
    return;
  }

  usuario = {
    nome,
    isPremium: plano === 'premium',
    isAffiliate,
    linkAfiliado: isAffiliate ? `https://guiadebolso.com/ref/${nome.toLowerCase().replace(/\s+/g, '')}` : null
  };

  atualizarInterface();
});

// Evento logout
btnLogout.addEventListener('click', () => {
  usuario = null;
  atualizarInterface();
});

// Inicializa interface
atualizarInterface();