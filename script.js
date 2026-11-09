// BRASA NOBRE — personalize o telefone abaixo com DDI + DDD + número, somente números.
const WHATSAPP_NUMBER = "5582999999999"; // TROQUE pelo WhatsApp real do restaurante.

const cart = [];
const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("cart-overlay");
const itemsEl = document.getElementById("cart-items");

function openCart(){drawer.classList.add("open");overlay.classList.add("open")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("open")}
document.getElementById("cart-fab").addEventListener("click",openCart);
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

function renderCart(){
  document.getElementById("cart-count").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cart-total").textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
  if(!cart.length){itemsEl.innerHTML='<p class="empty-cart">Sua sacola está vazia. Adicione algo delicioso do nosso menu.</p>';return}
  itemsEl.innerHTML=cart.map((item,index)=>`<div class="cart-row"><div><strong>${item.name}</strong><small>${item.qty} × ${money(item.price)}</small></div><div><strong>${money(item.price*item.qty)}</strong> <button class="remove-item" data-remove="${index}" aria-label="Remover">×</button></div></div>`).join("");
  itemsEl.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart.splice(Number(btn.dataset.remove),1);renderCart()}));
}
document.querySelectorAll(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.name,price=Number(btn.dataset.price);
  const existing=cart.find(item=>item.name===name);
  if(existing)existing.qty++;else cart.push({name,price,qty:1});
  renderCart();btn.textContent="✓";setTimeout(()=>btn.textContent="+",800);
}));
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){alert("Adicione pelo menos um item ao pedido.");return}
  const lines=cart.map(item=>`${item.qty}x ${item.name} — ${money(item.price*item.qty)}`);
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const message=`Olá! Gostaria de fazer este pedido na Brasa Nobre:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`;
  if(WHATSAPP_NUMBER==="5582999999999"){alert("Antes de usar os pedidos, abra script.js e substitua WHATSAPP_NUMBER pelo WhatsApp do restaurante.");return}
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
});

// Filtros do cardápio
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  document.querySelectorAll(".product").forEach(product=>{
    product.style.display=button.dataset.filter==="todos"||product.dataset.category===button.dataset.filter?"":"none";
  });
}));

// Animação de entrada ao rolar a página
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>observer.observe(element));

// Menu mobile
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
toggle.addEventListener("click",()=>nav.classList.toggle("mobile-open"));
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>nav.classList.remove("mobile-open")));
renderCart();
