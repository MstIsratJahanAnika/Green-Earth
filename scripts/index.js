const categoriesContainer = document.getElementById("Categories-container");

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
                            />
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">${tree.name}</h2>
                            <p class="line-clamp-2">${tree.description}
                            </p>

                            <!-- badge -->
                            <div class="badge badge-soft text-[#15803D] border-none rounded-[400px] bg-[#DCFCE7]">${tree.category}</div>
                            <div class="flex justify-between items-center">
                                <button class="btn bg-[#15803D] text-white rounded-[999px]">Buy Now</button>
                                <h2>${tree.price}</h2>
                            </div>
                        </div>
        `;
        allTreesContainer.appendChild(treeCard);
    });
}

loadTrees();
loadCategories();