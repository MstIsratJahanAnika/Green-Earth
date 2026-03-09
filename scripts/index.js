console.log('hello');

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
        categoriesContainer.appendChild(btn);
    });  //categories property er moddhe ja ase
    // categoriesContainer.innerHTML = `ekhane btn gula ashbe`;
}     

loadCategories();