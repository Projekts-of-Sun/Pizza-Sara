// ============================================
// SCRIPT.JS - Pizza Sara
// ============================================

// ============================================
// 1. GLOBALE VARIABLEN
// ============================================

const loginBtn = document.getElementById('loginBtn');
const loginBox = document.getElementById('loginBox');
const loginForm = document.getElementById('loginForm');
const homeBtn = document.getElementById('home_page');
const homePagePassVergessen = document.getElementById('home_page_pass_vergessen');
const registerForm = document.getElementById('registerForm');
const passwordResetForm = document.getElementById('passwordResetForm');

// ============================================
// 2. SMOOTH SCROLLING FÜR NAVIGATION
// ============================================

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// 3. INTERSECTION OBSERVER (KARTEN-ANIMATION)
// ============================================

function initCardAnimation() {
  const cards = document.querySelectorAll('.card');

  if (cards.length === 0) return;

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

initCardAnimation();

// ============================================
// 4. HERO-VIDEO PLAY / PAUSE
// ============================================

function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  video.play().catch(() => console.log('Autoplay blockiert'));

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos < 100) {
      try { video.currentTime = 0; } catch (e) {}
      video.play().catch(() => {});
    } else {
      if (!video.paused) video.pause();
    }
  });
}

initHeroVideo();

// ============================================
// 5. LOGIN BOX
// ============================================

function openLoginBox() {
  if (loginBox) {
    loginBox.style.display = 'block';
    loginBox.setAttribute('aria-hidden', 'false');
    document.getElementById('username')?.focus();
  }
}

function closeLoginBox() {
  if (loginBox) {
    loginBox.style.display = 'none';
    loginBox.setAttribute('aria-hidden', 'true');
  }
}

if (loginBtn) {
  loginBtn.addEventListener('click', openLoginBox);
}

// Globale Funktion für HTML onclick
window.schliessen = closeLoginBox;

// ============================================
// 6. LOGIN FORM
// ============================================

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';

    if (!username || !password) {
      alert('❌ Benutzername und Passwort erforderlich');
      return;
    }

    if (password.length < 6) {
      alert('❌ Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    console.log('Login Versuch:', { username, password });
    alert('✅ Anmeldung erfolgreich!');
    
    loginForm.reset();
    closeLoginBox();
  });
}

// ============================================
// 7. HOME BUTTON (HAUPTSEITE & PASSWORT SEITE)
// ============================================

if (homeBtn) {
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });
}

// Home Button auf Passwort-Vergessen Seite
if (homePagePassVergessen) {
  homePagePassVergessen.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
  });
}

// ============================================
// 8. REGISTRIERUNGS-FORMULAR
// ============================================

function initRegisterForm() {
  if (!registerForm) return;

  const inputs = registerForm.querySelectorAll('input, textarea');
  
  inputs.forEach(field => {
    field.addEventListener('focus', function() {
      this.classList.add('focused');
    });
    field.addEventListener('blur', function() {
      this.classList.remove('focused');
    });
  });

  const passbtn = document.getElementById('pass-bottun');
  if (passbtn) {
    passbtn.addEventListener('click', (e) => {
      e.preventDefault();
      const password1 = document.getElementById('password1');
      if (password1) {
        password1.type = password1.type === 'password' ? 'text' : 'password';
        passbtn.textContent = password1.type === 'password' ? '👁' : '🙈';
      }
    });
  }

  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
      geschlecht: document.querySelector('input[name="geschlecht"]:checked')?.value,
      vorname: document.getElementById('vorname')?.value.trim() || '',
      nachname: document.getElementById('nachname')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      password: document.getElementById('password1')?.value || '',
      passwordConfirm: document.getElementById('password2')?.value || '',
      telefon: document.getElementById('telefon')?.value.trim() || '',
      klingel: document.getElementById('klingel')?.value.trim() || '',
      strasse: document.getElementById('strasse')?.value.trim() || '',
      hausnr: document.getElementById('hausnr')?.value.trim() || '',
      plz: document.getElementById('plz')?.value.trim() || '',
      ort: document.getElementById('ort')?.value.trim() || '',
    };

    const errors = validateRegistration(formData);
    if (errors.length > 0) {
      alert('❌ Fehler:\n\n' + errors.join('\n'));
      return;
    }

    console.log('Registrierungsdaten bereit für Server:', formData);
    alert('✅ Registrierung erfolgreich!');
    registerForm.reset();
  });
}

initRegisterForm();

function validateRegistration(data) {
  const errors = [];

  if (!data.geschlecht) errors.push('• Geschlecht erforderlich');
  if (!data.vorname) errors.push('• Vorname erforderlich');
  if (!data.nachname) errors.push('• Nachname erforderlich');
  
  if (!data.email) {
    errors.push('• E-Mail erforderlich');
  } else if (!isValidEmail(data.email)) {
    errors.push('• E-Mail ungültig');
  }

  if (!data.password) {
    errors.push('• Passwort erforderlich');
  } else if (data.password.length < 8) {
    errors.push('• Passwort mindestens 8 Zeichen');
  }

  if (data.password !== data.passwordConfirm) {
    errors.push('• Passwörter stimmen nicht überein');
  }

  return errors;
}

// ============================================
// 9. PASSWORT VERGESSEN
// ============================================

function initPasswordReset() {
  if (!passwordResetForm) return;

  const emailInput = document.getElementById('email-vergessen');
  const emailError = document.getElementById('emailError');
  const successMessage = document.getElementById('successMessage');

  if (!emailInput) return;

  // --- Form Submit ---
  passwordResetForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    
    if (!email) {
      showEmailError(emailInput, emailError, 'Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }

    if (!isValidEmail(email)) {
      showEmailError(emailInput, emailError, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    // Erfolgreich
    clearEmailError(emailInput, emailError);
    
    if (successMessage) {
      successMessage.classList.add('show');
    }
    
    console.log('Passwort-Reset angefordert für:', email);
    
    // TODO: Server anfragen
    
    // Form zurücksetzen nach kurzer Verzögerung
    setTimeout(() => {
      passwordResetForm.reset();
      if (successMessage) {
        successMessage.classList.remove('show');
      }
    }, 3000);
  });

  // --- Real-time Validierung ---
  emailInput.addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
      showEmailError(emailInput, emailError, 'Ungültiges Email-Format');
    } else {
      clearEmailError(emailInput, emailError);
    }
  });

  emailInput.addEventListener('input', function() {
    clearEmailError(emailInput, emailError);
  });
}

initPasswordReset();

// ============================================
// 10. HELPER-FUNKTIONEN
// ============================================

/**
 * Validiert eine E-Mail-Adresse
 * @param {string} email - Die zu validierende E-Mail
 * @returns {boolean} - True wenn gültig
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Zeigt einen Error beim Passwort-Reset an
 */
function showEmailError(input, errorElement, message) {
  if (input) {
    input.style.borderColor = '#e74c3c';
    input.classList.add('error');
  }
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

/**
 * Löscht den Error beim Passwort-Reset
 */
function clearEmailError(input, errorElement) {
  if (input) {
    input.style.borderColor = '';
    input.classList.remove('error');
  }
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Zeigt eine Success-Message
 */
function showSuccessMessage(element) {
  if (element) {
    element.classList.add('show');
  }
}

// ============================================
// 11. BACK TO LOGIN
// ============================================

function initBackToLogin() {
  const backToLoginLink = document.getElementById('backToLogin');
  
  if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginBox();
    });
  }
}

initBackToLogin();

// ============================================
// 12. REGISTER BUTTON
// ============================================

function initRegisterButton() {
  const registerBtn = document.getElementById('btn_register');
  
  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
}

initRegisterButton();

// ============================================
// 13. ALLGEMEINE INPUT-VALIDIERUNG
// ============================================

function initGeneralInputValidation() {
  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !isValidEmail(this.value)) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });

    input.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });
}

initGeneralInputValidation();

// ============================================
// 14. GLOBALE FUNKTIONEN FÜR HTML
// ============================================

window.isValidEmail = isValidEmail;
window.openLoginBox = openLoginBox;
window.closeLoginBox = closeLoginBox;

// ============================================
// 15. INITIALIZATION
// ============================================

console.log('✅ Pizza Sara - JavaScript erfolgreich geladen');


// ============================================
/* ===== ORDER FLOW  ===== */
// ============================================

(function(){
  // Utilities
  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  // Modal elements
  const orderModal = document.getElementById('orderModal');
  const omPanel = orderModal && orderModal.querySelector('.order-modal-panel');
  const omProductInfo = document.getElementById('om-product-info');
  const omTitle = document.getElementById('om-title');
  const omQty = document.getElementById('om-qty');
  const omExtras = document.getElementById('om-extras');
  const omDrink = document.getElementById('om-drink');

  // Steps
  function showStep(n){
    const steps = qsa('.order-steps .step');
    steps.forEach((el,i)=> {
      if ((i+1) === n) { el.hidden = false; } else { el.hidden = true; }
    });
    orderModal.querySelector('.order-steps').dataset.step = n;
    orderModal.setAttribute('aria-hidden','false');
  }

  // Cart persistence
  const CART_KEY = 'pizza_sara_cart_v1';
  function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }catch(e){ return []; } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function parsePrice(priceText){
    if (!priceText) return 0;
    // "8,90 €" -> 8.9
    const num = priceText.replace(/[^\d,.-]/g,'').replace(',', '.');
    return parseFloat(num) || 0;
  }

  function getProductFromCard(btn){
    // find closest .card and extract name & price
    const card = btn.closest('.card');
    if (!card) return {name: 'Artikel', price: 0};
    const name = (card.querySelector('h3')?.textContent || '').trim();
    const priceText = (card.querySelector('span')?.textContent || '').trim();
    const price = parsePrice(priceText);
    return { name, price, priceText };
  }

  // Render cart in modal
  function renderCart(){
    const list = document.getElementById('om-cart-list');
    const cart = loadCart();
    if (!list) return;
    if (cart.length === 0){
      list.innerHTML = '<p>Warenkorb ist leer.</p>';
      return;
    }
    list.innerHTML = '';
    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'om-cart-item';
      div.innerHTML = `
        <div class="ci-left">
          <strong>${item.name}</strong>
          <div class="muted">${(item.extras && item.extras.length) ? 'Extras: '+item.extras.join(', ') : ''}${item.drink? ' • Getränk: '+item.drink : ''}</div>
        </div>
        <div class="ci-actions">
          <div>${(item.unitPrice||0).toFixed(2).replace('.',',')} €</div>
          <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="ci-qty">
          <button data-remove="${idx}" class="btn small">Entfernen</button>
        </div>
      `;
      list.appendChild(div);
    });

    // totals
    const total = cart.reduce((s,i)=> s + (i.unitPrice * i.qty), 0);
    const totalDiv = document.createElement('div');
    totalDiv.style.marginTop='10px';
    totalDiv.innerHTML = `<strong>Zwischensumme: ${total.toFixed(2).replace('.',',')} €</strong>`;
    list.appendChild(totalDiv);
  }

  // Add item to cart
  function addToCart(item){
    const cart = loadCart();
    // Try merging identical item (same name, same extras and drink)
    const foundIdx = cart.findIndex(ci => ci.name === item.name && JSON.stringify(ci.extras||[])===JSON.stringify(item.extras||[]) && (ci.drink||'') === (item.drink||''));
    if (foundIdx > -1){
      cart[foundIdx].qty += item.qty;
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }

  // Event listeners for cart edits (delegation)
  document.addEventListener('input', function(e){
    if (e.target.matches('.ci-qty')){
      const idx = Number(e.target.dataset.idx);
      let val = parseInt(e.target.value) || 1;
      if (val < 1) val = 1;
      const cart = loadCart();
      if (cart[idx]) { cart[idx].qty = val; saveCart(cart); renderCart(); }
    }
  });

  document.addEventListener('click', function(e){
    if (e.target.matches('[data-remove]')){
      const idx = Number(e.target.getAttribute('data-remove'));
      const cart = loadCart(); cart.splice(idx,1); saveCart(cart); renderCart();
    }
  });

  // Open modal with optional product
  function openOrderModal(product){
    if (!orderModal) return;
    orderModal.setAttribute('aria-hidden','false');
    orderModal.style.display = 'block';
    if (product){
      omTitle.textContent = 'Jetzt Bestellen: ' + product.name;
      omProductInfo.textContent = product.priceText ? product.priceText : (product.price ? product.price.toFixed(2).replace('.',',')+' €' : '');
      // reset options
      omQty.value = 1;
      qsa('#om-extras input').forEach(cb => cb.checked = false);
      omDrink.value = '';
      showStep(1);
    } else {
      showStep(2);
      renderCart();
    }
  }

  function closeOrderModal(){
    if (!orderModal) return;
    orderModal.setAttribute('aria-hidden','true');
    orderModal.style.display = 'none';
  }

  // Close by backdrop or close button
  document.addEventListener('click', function(e){
    if (e.target.matches('[data-close]') || e.target.closest('.order-close')){
      closeOrderModal();
    }
  });

  // Hook all "Jetzt Bestellen" buttons
  function hookOrderButtons(){
    // support existing HTML: either buttons with onclick="bestellen()" or id btn_bestellen or class .btn-bestellen
    const nodes = new Set();
    qsa('button[onclick="bestellen()"]').forEach(n=>nodes.add(n));
    qsa('#btn_bestellen').forEach(n=>nodes.add(n));
    qsa('.btn-bestellen').forEach(n=>nodes.add(n));
    // Also: any button with innerText "Jetzt Bestellen !" (robust)
    qsa('button').forEach(b=>{
      if (b.textContent && b.textContent.trim().toLowerCase().includes('jetzt bestellen')) nodes.add(b);
    });
    nodes.forEach(btn=>{
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const product = getProductFromCard(btn);
        openOrderModal(product);
      });
    });
  }

  // STEP actions
  // Add to cart & continue shopping
  const omAddContinue = document.getElementById('om-add-continue');
  if (omAddContinue) omAddContinue.addEventListener('click', function(){
    const product = extractCurrentSelection();
    addToCart(product);
    alert('In den Warenkorb gelegt');
    closeOrderModal();
  });

  // Add to cart & go to checkout
  const omToCheckout = document.getElementById('om-to-checkout');
  if (omToCheckout) omToCheckout.addEventListener('click', function(){
    const product = extractCurrentSelection();
    addToCart(product);
    showStep(2);
    renderCart();
  });

  // Back / Next in steps
  qs('#om-back-to-products')?.addEventListener('click', ()=> { showStep(1); });
  qs('#om-to-step3')?.addEventListener('click', ()=> { showStep(3); });

  qs('#om-back-to-cart')?.addEventListener('click', ()=> { showStep(2); });
  qs('#om-to-payment')?.addEventListener('click', ()=> {
    // basic validation: cart not empty
    if (loadCart().length === 0){ alert('Der Warenkorb ist leer.'); showStep(1); return; }
    // render summary
    const summary = document.getElementById('om-summary');
    const cart = loadCart();
    const total = cart.reduce((s,i)=> s + i.unitPrice * i.qty, 0);
    const deliveryType = qs('input[name="om-delivery"]:checked')?.value || 'lieferung';
    const date = qs('#om-date')?.value || '';
    const time = qs('#om-time')?.value || '';
    summary.innerHTML = `
      <div><strong>Artikel:</strong></div>
      ${cart.map(i=> `<div>${i.qty}× ${i.name} ${(i.extras?.length)?'('+i.extras.join(', ')+')':''} ${(i.drink)?'• '+i.drink:''} — ${(i.unitPrice*i.qty).toFixed(2).replace('.',',')} €</div>`).join('')}
      <div style="margin-top:8px"><strong>Lieferart:</strong> ${deliveryType}</div>
      <div><strong>Datum / Zeit:</strong> ${date} ${time}</div>
      <div style="margin-top:8px"><strong>Gesamt:</strong> ${total.toFixed(2).replace('.',',')} €</div>
    `;
    showStep(4);
  });

  qs('#om-back-to-customer')?.addEventListener('click', ()=> { showStep(3); });

  // Login / Guest toggles
  qs('#om-toggle-login')?.addEventListener('click', ()=> {
    qs('#om-login-form').hidden = false;
    qs('#om-guest-form').hidden = true;
  });
  qs('#om-toggle-guest')?.addEventListener('click', ()=> {
    qs('#om-login-form').hidden = true;
    qs('#om-guest-form').hidden = false;
  });

  // Place order (mock)
  qs('#om-place-order')?.addEventListener('click', ()=> {
    // Minimal checks
    const cart = loadCart();
    if (cart.length === 0){ alert('Warenkorb leer'); showStep(1); return; }
    // In real app: send to server here
    // For demo: clear cart and show success
    localStorage.removeItem(CART_KEY);
    alert('✅ Bestellung aufgegeben! Danke.');
    closeOrderModal();
  });

  // Extract current selection (step1)
  function extractCurrentSelection(){
    const title = (omTitle?.textContent || 'Artikel').replace(/^Jetzt Bestellen:\s*/,'');
    const unitPrice = (() => {
      // if product price shown in product info, try parse
      const txt = (omProductInfo?.textContent || '').trim();
      return parsePrice(txt) || 0;
    })();
    const extras = qsa('#om-extras input:checked').map(cb => cb.value);
    const extrasPrice = qsa('#om-extras input:checked').reduce((s,cb)=> s + parseFloat(cb.dataset.price||0), 0);
    const drinkEl = qs('#om-drink');
    const drink = drinkEl?.selectedOptions?.[0]?.value || '';
    const drinkPrice = parseFloat(drinkEl?.selectedOptions?.[0]?.dataset?.price || 0);
    const qty = Math.max(1, parseInt(omQty?.value || 1));
    const unit = unitPrice + extrasPrice + (drink ? drinkPrice : 0);
    return {
      name: title,
      qty,
      extras,
      drink: drink || '',
      unitPrice: Math.round(unit*100)/100
    };
  }

  // On load: hook buttons and set date default
  document.addEventListener('DOMContentLoaded', function(){
    hookOrderButtons();
    // attach also to a global function bestellen if code calls that
    window.bestellen = function(){ openOrderModal(); };
    // default date to today
    const dateEl = qs('#om-date');
    if (dateEl){
      const d = new Date(); d.setDate(d.getDate()+0);
      dateEl.value = d.toISOString().slice(0,10);
    }
  });
})();