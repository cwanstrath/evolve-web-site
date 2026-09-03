
const PRODUCT = {name:"EvolveVision", price:3999.90};
let cart = JSON.parse(localStorage.getItem("evolve_cart") || "[]");

const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $ = s => document.querySelector(s);

function save(){ localStorage.setItem("evolve_cart", JSON.stringify(cart)); renderCart(); }
function add(q=1){
  const item = cart.find(x=>x.name===PRODUCT.name);
  if(item) item.qty += q; else cart.push({...PRODUCT,qty:q});
  save(); openModal("cartModal");
}
function renderCart(){
  const box=$("#cartItems"), count=$("#cartCount"), total=$("#cartTotal");
  const n=cart.reduce((a,b)=>a+b.qty,0), t=cart.reduce((a,b)=>a+b.price*b.qty,0);
  count.textContent=n;
  box.innerHTML = cart.length ? cart.map((x,i)=>`
    <div class="cart-item">
      <div><b>${x.name}</b><br><small>${money(x.price)} × ${x.qty}</small></div>
      <div>
        <button class="btn btn-ghost" onclick="changeQty(${i},-1)">−</button>
        <button class="btn btn-ghost" onclick="changeQty(${i},1)">+</button>
      </div>
    </div>`).join("") : `<p style="color:#9eb0bf">Seu carrinho está vazio.</p>`;
  total.textContent=money(t);
}
function changeQty(i,d){
  cart[i].qty += d;
  if(cart[i].qty<=0) cart.splice(i,1);
  save();
}
function openModal(id){ $("#"+id).classList.add("open"); }
function closeModal(id){ $("#"+id).classList.remove("open"); }
function goCheckout(){
  if(!cart.length){alert("Adicione o EvolveVision ao carrinho primeiro.");return;}
  closeModal("cartModal"); openModal("checkoutModal");
}
function finishOrder(e){
  e.preventDefault();
  const order="EV-"+Math.random().toString(36).slice(2,8).toUpperCase();
  $("#orderNumber").textContent=order;
  $("#checkoutModal").classList.remove("open");
  $("#successModal").classList.add("open");
  cart=[]; save();
}
document.addEventListener("DOMContentLoaded",()=>{
  renderCart();
  $("#buyNow").onclick=()=>add(1);
  $("#openCart").onclick=()=>openModal("cartModal");
  $("#checkoutBtn").onclick=goCheckout;
  $("#checkoutForm").addEventListener("submit",finishOrder);
  document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{
    if(e.target===m)m.classList.remove("open");
  }));
});
