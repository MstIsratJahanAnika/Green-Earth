const categoriesContainer = document.getElementById("Categories-container");

let cart = []; //empty array to store of 'add to cart'

async function loadCategories(){
    // fetch("https://openapi.programming-hero.com/api/categories")
    //     .then(res => res.json()).then(data => console.log(data))
    //     .catch(e => console.log(e));

    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    console.log(data); //full object ->json
    data.categories.forEach(category => {
        console.log(category);
        
        const btn = document.createElement("button");
        btn.className = "btn bg-[#DCFCE7] w-full";
        btn.textContent = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn);

        categoriesContainer.appendChild(btn);
    });  //categories property er moddhe ja ase
    // categoriesContainer.innerHTML = `ekhane btn gula ashbe`;
}     

const selectCategory = async (categoryID, btn) =>{
    // console.log(categoryID, btn);
    showLoading();

    const allBtns = document.querySelectorAll("#Categories-container button, #allTreesBtn");
    // console.log(allBtns);

    // all buttons reset kore
    allBtns.forEach(btn => {
        btn.style.backgroundColor = "#DCFCE7";
        btn.style.color = "#1F2937"
    });

    // clicked button highlight kore
    btn.style.backgroundColor = "#15803D";
    btn.style.color = "white";

    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryID}`);
    const data = await res.json();
    console.log(data);
    displayAllTrees(data.plants);

    hideLoading();
}


allTreesBtn.addEventListener("click", () => {
    const allBtns = document.querySelectorAll("#Categories-container button, #allTreesBtn");
    // console.log(allBtns);

    // all buttons reset kore
    allBtns.forEach(btn => {
        btn.style.backgroundColor = "#DCFCE7";
        btn.style.color = "#1F2937"
    });

    // clicked button highlight kore
    allTreesBtn.style.backgroundColor = "#15803D";
    allTreesBtn.style.color = "white";

    loadTrees();
})
const allTreesContainer = document.getElementById("trees-container");

const loadingSpinner = document.getElementById("loading-spinner");

const showLoading = () =>{
    loadingSpinner.classList.remove("hidden");
    loadingSpinner.classList.add("flex");
    allTreesContainer.innerHTML = "";
}

const hideLoading = () =>{
    loadingSpinner.classList.add("hidden");
}

async function loadTrees() {

    showLoading();
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const treesData = await res.json();

    hideLoading();
    displayAllTrees(treesData.plants);
}

function displayAllTrees(trees){
    console.log(trees);
    trees.forEach((tree) => {
        console.log(tree);
        const treeCard = document.createElement("div");
        treeCard.className ="card bg-white shadow-sm";
        treeCard.innerHTML = ` 
                        <figure>
                            <img src="${tree.image}"
                                alt="${tree.name}" 
                                title = "${tree.name}"
                                class = "h-50 w-full object-cover"
                                onclick ="openCardModal(${tree.id})"
                            />
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title cursor-pointer hover:text-[#15803D]" onclick ="openCardModal(${tree.id})">${tree.name}</h2>
                            <p class="line-clamp-2">${tree.description}
                            </p>

                            <!-- badge -->
                            <div class ="flex justify-between items-center">
                                <div class="badge badge-soft text-[#15803D] border-none rounded-[400px] bg-[#DCFCE7]">${tree.category}</div>
                                <h2 class = "font-semibold ${tree.price < 500 ? "text-[#cb0502]" : "text-[#15803D]"}">$${tree.price}</h2>
                            </div>

                            <div class="flex justify-center items-center">
                                <button class="btn bg-[#15803D] text-white rounded-[999px] w-full" onclick ="addToCart(${tree.id}, '${tree.name}', ${tree.price})">Add to Cart</button>
                            </div>
                        </div>
        `;
        allTreesContainer.appendChild(treeCard);
    });
}

const cartItemsContainer = document.getElementById("cart-items");

function addToCart(id, name, price){
    // cartContainer.innerHTML = "";
    const existingItem = cart.find(item => item.id === id); //single element khuje ber kore ana
        if(existingItem){
            existingItem.quantity += 1;
        }
        else{
            cart.push({id, name, price, quantity:1});
        }

    updateCart();
}

const emptyCart = document.getElementById("empty-cart");

const totalPrice = document.getElementById("total-price");

let total = 0;
function updateCart(){
    cartItemsContainer.innerHTML = "";

    if(cart.length === 0){
        emptyCart.classList.remove("hidden");
        totalPrice.textContent = `$${0}`;
        return; //nicher kaj er dorkar nei
    }
    emptyCart.classList.add("hidden");

    console.log(cart);

    // ekhane call-back function use kora hoyeche
    cart.forEach(item =>{
        total = total + (item.price * item.quantity);
        const cartItem = document.createElement("div");
        cartItem.innerHTML =   `
                    <div class="card card-body shadow-sm bg-slate-100">
                        <div class="flex justify-between items-center">                           
                            <div><h3>${item.name}</h3>
                                <p>$${item.price} x ${item.quantity}</p>
                            </div>
                            <button class="btn btn-ghost text-[#1F2937]/30" onclick="removeFromCart(${item.id})">✕</button>
                        </div>
                        <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>
                    </div>
        `
        cartItemsContainer.appendChild(cartItem);
    });
    totalPrice.innerText = `$${total}`;
}

function removeFromCart(treeId){
        const updatedCartElements = cart.filter(item => item.id !== treeId);

        cart = updatedCartElements;
        updateCart();
    }
// modal related
const cardDetailModal = document.getElementById("card_detail_modal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");

async function openCardModal(treeId){
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
    const data = await res.json();

    const plantDetail = data.plants;
    console.log(data);
    modalTitle.textContent = plantDetail.name;
    modalImage.src = plantDetail.image;
    modalDescription.textContent = plantDetail.description;
    modalCategory.textContent = plantDetail.category;
    modalPrice.textContent = plantDetail.price;
    cardDetailModal.showModal();
}

loadTrees();
loadCategories();