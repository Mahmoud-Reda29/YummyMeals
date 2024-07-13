// <----------- SideNavBar ----------------------->
function openSideNav() {
    $(".side-nav").animate({
        left: 0
    }, 500)
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
        $(".side-nav-links li").eq(i).animate({
            top: 5
        }, (i + 5) * 100)
    }
}
function closeSideNav() {
    let boxWidth = $(".side-nav .nav-tab").outerWidth()
    $(".side-nav").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");

    $(".side-nav-links li").animate({
        top: 100
    }, 500)
}

$(".side-nav i.open-close-icon").click(() => {
    if ($(".side-nav").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})
$(document).ready(() => {
    closeSideNav()
    fetchMeals("").then(() => {
        $('#randomMeals').removeClass('d-none').fadeIn(2000);
    });
})
// <----------- End SideNavBar ----------------------->
// <----------- Navigation buttons ----------------------->
$('.searchbtn').click(function () {
    navigateTo('.search');
})
$('.catbtn').click(function () {
    navigateTo('.categories');
    displayCategories()
})
$('.areabtn').click(function () {
    navigateTo('.areas');
    displayAreas();
})
$('.ingredientbtn').click(function () {
    navigateTo('.ingredients');
    displayIngredients();
})
$('.contactbtn').click(function () {
    navigateTo('.contactUs');
})
function navigateTo(section) {
    closeSideNav();
    $('.randomMeals, .singleMeal, .contactUs, .areas, .categories, .ingredients, .search').hide(500, function () {
        $(section).removeClass('d-none').fadeIn(2000);
    });
}
// <----------- End Navigation buttons ----------------------->
// <----------- Fetch Meals for HomePage ----------------------->
async function fetchMeals(term) {
    let mealBox = ``;
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json();
    // console.log(response.meals);
    let arr = response.meals;
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            mealBox += `<div class="col-md-3">
            <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
              <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="" />
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <p>${arr[i].strMeal}</p>
              </div>
            </div>
          </div>`;
        }
    }
    document.getElementById('mealsBox').innerHTML = mealBox;
    // document.getElementById('searchBody').innerHTML = mealBox;
}
// <----------- Fetch meal details by ID -----------------------> 
async function fetchMealDetails(mealId) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    response = await response.json();
    let data = response.meals;
    displaySingleMeal(data[0]);
}
// <----------- Display single meal details -----------------------> 
function displaySingleMeal(singleMeal) {
    let ingredients = ``;
    let tags = ``;
    for (let i = 1; i <= 20; i++) {
        if (singleMeal[`strIngredient${i}`]) {
            ingredients += `<li class="ingredient p-2 rounded-2">${singleMeal[`strMeasure${i}`]} ${singleMeal[`strIngredient${i}`]}</li>`;
        }
    }
    let tagstext = singleMeal.strTags?.split(",") || [];
    for (let i = 0; i < tagstext.length; i++) {
        tags += `<li class="tag p-2 rounded-2">${tagstext[i]}</li>`;
    }
    let mealBox = `
    <div class="col-md-4">
            <img src="${singleMeal.strMealThumb}" class="img-fluid w-100 rounded-2 mb-2" alt="" />
            <h1>${singleMeal.strMeal}</h1>
          </div>
          <div class="col-md-8 px-3">
            <h2>Instructions</h2>
            <p>${singleMeal.strInstructions}</p>
            <h3>Area : ${singleMeal.strArea}</h3>
            <h3>Category : ${singleMeal.strCategory}</h3>
            <h3>Recipes :</h3>
            <div class="ingredients d-flex flex-wrap g-2 mt-3">
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
              </ul>
            </div>
            <h3>Tags :</h3>
            <div class="tags d-flex flex-wrap g-2 mt-3">
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
              </ul>
            </div>
            <div class="mealBtns">
              <a target="_blank" href="${singleMeal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="https://www.youtube.com/watch?v=${singleMeal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
          </div>
    `;
    document.getElementById('singleMeal').innerHTML = mealBox;
    navigateTo('.singleMeal')
}
// <----------- Get all Categories -----------------------> 
async function displayCategories() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    console.log(response.categories);
    let arr = response.categories;
    let catBox = ``;
    for (let i = 0; i < arr.length; i++) {
        catBox += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="category position-relative overflow-hidden rounded-2">
              <img src="${arr[i].strCategoryThumb}" class="img-fluid w-100" alt="" />
              <div class="cat-layer text-center position-absolute d-flex flex-column justify-content-center align-items-center text-center text-black p-2">
                <h4>${arr[i].strCategory}</h4>
                <p>
                ${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}
                </p>
              </div>
            </div>
          </div>
        `;
    }
    document.getElementById('catBody').innerHTML = catBox;
}
// <----------- Get Category Meals -----------------------> 
async function getCategoryMeals(category) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();
    let arr = response.meals;
    let catMeal = ``;

    let limit = Math.min(arr.length, 20);
    for (let i = 0; i < limit; i++) {
        catMeal += `
        <div class="col-md-3">
            <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
              <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="" />
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <p>${arr[i].strMeal}</p>
              </div>
            </div>
          </div>
        `;
    }
    document.getElementById('catBody').innerHTML = catMeal;
}
// <----------- Get All Areas ----------------------->
async function displayAreas() {
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    let arr = respone.meals
    let areaBox = ``
    for (let i = 0; i < arr.length; i++) {
        areaBox += `
        <div class="col-md-3">
            <div class="area" onclick="getAreaMeals('${arr[i].strArea}')" rounded-2 text-center text-white">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3>${arr[i].strArea}</h3>
            </div>
          </div>
        `
    }
    document.getElementById('areaBody').innerHTML = areaBox
}
// <----------- Get All AreaMeals ----------------------->
async function getAreaMeals(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    let arr = response.meals
    let areaMeal = ``
    let limit = Math.min(arr.length, 20);
    for (let i = 0; i < limit; i++) {
        areaMeal += `
        <div class="col-md-3">
            <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
              <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="" />
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <p>${arr[i].strMeal}</p>
              </div>
            </div>
          </div>
        `
    }
    document.getElementById('areaBody').innerHTML = areaMeal
}
// <----------- Get All Ingredients ----------------------->
async function displayIngredients() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    response = await response.json()
    let arr = response.meals
    let ingredientBox = ``
    for (let i = 0; i < arr.length; i++) {
        let description = arr[i].strDescription ? arr[i].strDescription.split(" ").slice(0, 20).join(" ") : "No description available";
        ingredientBox += `
        <div class="col-md-3">
            <div onclick="getIngredientMeal('${arr[i].strIngredient}')" class="rounded-2 text-center text-white ing-item">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${arr[i].strIngredient}</h3>
              <p>
              ${description}
              </p>
            </div>
          </div>
        `
    }
    document.getElementById('ingredientBody').innerHTML = ingredientBox
}
// <----------- Get Ingredients Meals ----------------------->
async function getIngredientMeal(ingredient) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    response = await response.json()
    let arr = response.meals
    let ingredientMealBox = ``
    let limit = Math.min(arr.length, 20);
    for (let i = 0; i < limit; i++) {
        ingredientMealBox += `
        <div class="col-md-3">
            <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
              <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="" />
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <p>${arr[i].strMeal}</p>
              </div>
            </div>
          </div>
        `
    }
    document.getElementById('ingredientBody').innerHTML = ingredientMealBox;
}
// <----------- Search Meals By Term ----------------------->
async function SearchMealsbyTerm(term) {
    let mealBox = ``;
    if (term.trim() === "") {
        document.getElementById('searchBody').innerHTML = `<p class="text-center text-bg-danger">Please Type any Term to Search</p>`;
        return;
    }
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    let data = await response.json();
    let arr = data.meals;

    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            mealBox += `
                <div class="col-md-3 mb-4">
                    <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
                        <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="${arr[i].strMeal}" />
                        <div class="meal-layer position-absolute d-flex align-items-center justify-content-center text-white p-2 bg-dark">
                            <p class="m-0">${arr[i].strMeal}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        mealBox = `<p class="text-center text-bg-danger">Please Type any Term to Search</p>`;
    }
    document.getElementById('searchBody').innerHTML = mealBox;
}
// <----------- Search Meals By First Letter ----------------------->
async function SearchMealsbyFletter(letter) {
    let mealBox = ``;
    if (letter.trim() === "") {
        document.getElementById('searchBody').innerHTML = `<p class="text-center text-bg-danger">Please Type any letter to Search</p>`;
        return;
    }

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await response.json();
    let arr = data.meals;

    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            mealBox += `
                <div class="col-md-3 mb-4">
                    <div onclick="fetchMealDetails(${arr[i].idMeal})" class="meal position-relative overflow-hidden rounded-2">
                        <img src="${arr[i].strMealThumb}" class="img-fluid w-100" alt="${arr[i].strMeal}" />
                        <div class="search-layer position-absolute d-flex align-items-center justify-content-center text-white p-2 bg-dark">
                            <p class="m-0">${arr[i].strMeal}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        mealBox = `<p class="text-center text-bg-danger">No meals found for the entered letter</p>`;
    }

    document.getElementById('searchBody').innerHTML = mealBox;
}
// <----------- Methods to ensure that twoInputs is not activated Together ----------------------->
function disableTermInput(value) {
    let termInput = document.getElementById('searchByName');
    termInput.disabled = value.trim() !== "";
    if (!termInput.disabled) {
        termInput.value = "";
    }
}
function disableLetterInput(value) {
    let letterInput = document.getElementById('searchByLetter');
    letterInput.disabled = value.trim() !== "";
    if (!letterInput.disabled) {
        letterInput.value = "";
    }
}

// <----------- Regex and Form Inputs Validation ----------------------->

let submitBtn = document.getElementById('submitBtn');
let nameInput = document.getElementById('nameInput');
let emailInput = document.getElementById('emailInput');
let phoneInput = document.getElementById('phoneInput');
let ageInput = document.getElementById('ageInput');
let passwordInput = document.getElementById('passwordInput');
let repasswordInput = document.getElementById('repasswordInput');

let nameFocused = false;
let emailFocused = false;
let phoneFocused = false;
let ageFocused = false;
let passwordFocused = false;
let repasswordFocused = false;

nameInput.addEventListener("focus", function () { nameFocused = true });
emailInput.addEventListener("focus", function () { emailFocused = true });
phoneInput.addEventListener("focus", function () { phoneFocused = true });
ageInput.addEventListener("focus", function () { ageFocused = true });
passwordInput.addEventListener("focus", function () { passwordFocused = true });
repasswordInput.addEventListener("focus", function () { repasswordFocused = true });

function nameValidation(name) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
}

function emailValidation(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function phoneValidation(number) {
    const regex = /^\d{11}$/; 
    return regex.test(number);
}

function ageValidation(age) {
    const regex = /^(1[5-9]|[2-5][0-9]|60)$/;
    return regex.test(age);
}

function passwordValidation(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    return regex.test(password);
}

function repasswordValidation(password, repassword) {
    return password === repassword;
}

function validateInputs() {
    if (nameFocused) {
        if (nameValidation(nameInput.value)) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        }
    }
    if (emailFocused) {
        if (emailValidation(emailInput.value)) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }
    if (phoneFocused) {
        if (phoneValidation(phoneInput.value)) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }
    if (ageFocused) {
        if (ageValidation(ageInput.value)) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }
    if (passwordFocused) {
        if (passwordValidation(passwordInput.value)) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (repasswordFocused) {
        if (repasswordValidation(passwordInput.value, repasswordInput.value)) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (nameValidation(nameInput.value) && emailValidation(emailInput.value) && phoneValidation(phoneInput.value) && ageValidation(ageInput.value) && passwordValidation(passwordInput.value) && repasswordValidation(passwordInput.value, repasswordInput.value)) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
}

nameInput.addEventListener('input', validateInputs);
emailInput.addEventListener('input', validateInputs);
phoneInput.addEventListener('input', validateInputs);
ageInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);
repasswordInput.addEventListener('input', validateInputs);
