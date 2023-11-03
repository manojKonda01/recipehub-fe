// Get the full URL
const currentURL = window.location.href;

// Get the query parameters from the URL
const urlSearchParams = new URLSearchParams(window.location.search);
searchQuery = urlSearchParams.get('query');
const fixedSearchQuery = searchQuery;
pageType = urlSearchParams.get('type');
value = urlSearchParams.get('value');

const quick = '30';

const searchRecipes = document.querySelector('.search-container');
const categoryHeading = document.querySelector('.recipes h1');
if (pageType === 'search') {
  // Show Search Input for pageType = 'search' parameter
  searchRecipes.style.display = 'flex';
  categoryHeading.innerText = 'Search Results';
}
else if(pageType === 'time'){
    searchRecipes.style.display = 'none';
    categoryHeading.innerHTML = 'Quick + Easy Recipes';
}
else {
  searchRecipes.style.display = 'none';
  categoryHeading.innerText =
    value.length > 0
      ? formatRecipeName(value)
      : 'All ' + formatRecipeName(pageType) + 's';
}

searchQuery = searchQuery === null ? '' : searchQuery;
const limit = 24;
let currentPage = 1;

window.onload = function () {
  loadFiltersDOM();
  let request = '';
  if (pageType === 'search' || pageType === 'all') {
    if (searchQuery === '') {
      request = generateDefaultRequest();
    }
  } else {
    request =
      value.length > 0
        ? `&${pageType}=${value}`
        : `&${pageType}=${filters[pageType].join(`&${pageType}=`)}`;
  }
  loadRecipes(searchQuery, request, 1);
};

const generateDefaultRequest = () => {
  let requestData = '';
  requestData += '&dishType=' + filters['dishType'].join('&dishType=');
  requestData += '&cuisineType=' + filters['cuisineType'].join('&cuisineType=');
  // requestData += '&diet='+filters['diet'].join('&diet=');
  //   requestData += '&health=' + filters['health'].join('&health=');
  requestData += '&mealType=' + filters['mealType'].join('&mealType=');
  return requestData;
};
// Load Filter By Js
const loadFiltersDOM = () => {
  const filterList = document.getElementById('filter_list');
  const showList_limit = 5;
  let innerHTML = '';
  for (const category in filters) {
    if (formatRecipeName2(category) !== pageType) {
      let eachFilterList = '';
      filters[category].forEach((option) => {
        eachFilterList += `<li class="recipe-cat-list-item">
                    <label for="${option}">
                        <input type="checkbox" name="${category}" id="${category}_${option}" data-value="${option}">${capitalizeAndReplaceHyphens(
          option
        )}
                    </label>
                </li>`;
      });
      let seeMore_list = '';
      if (filters[category].length > showList_limit) {
        seeMore_list = `<li class="recipe-cat-list-item see_more display-block" data-category="${category}">
                    View More
                </li>`;
      }
      innerHTML += `
            <li class="list-item">
                <div class="filter-category">
                    <div class="filter-cat-head">
                        <i class="fa-solid fa-plus"></i>
                        <p class="display-inline">${formatRecipeName(
                          category
                        )}</p>
                    </div>
                    <div class="filter-cat-body">
                        <ul class="recipe-cat-list" data-category="${category}">
                            ${eachFilterList}
                            ${seeMore_list}
                        </ul>
                    </div>
                </div>
            </li>`;
    }
  }
  filterList.innerHTML = innerHTML;

  const seeMore_link = document.getElementsByClassName('see_more');
  for (let i = 0; i < seeMore_link.length; i++) {
    seeMore_link[i].addEventListener('click', function (event) {
      const filter_ul = seeMore_link[i].closest('.recipe-cat-list');
      const list = filter_ul.querySelectorAll('li');
      if (seeMore_link[i].innerText === 'View More') {
        list.forEach((item, index) => {
          if (index >= 5 && index <= list.length) {
            item.style.display = 'block';
          }
        });
        seeMore_link[i].innerText = 'View Less';
      } else {
        list.forEach((item, index) => {
          if (index >= 5 && index <= list.length) {
            item.style.display = 'none';
          }
        });
        seeMore_link[i].innerText = 'View More';
      }
      const cursorX = event.clientX;
      const cursorY = event.clientY;

      // Calculate the scroll position to bring the target div to the cursor's position
      const targetX = seeMore_link[i].getBoundingClientRect().left;
      const targetY = seeMore_link[i].getBoundingClientRect().top;

      const scrollX = window.scrollX + targetX - cursorX;
      const scrollY = window.scrollY + targetY - cursorY;

      // Scroll to the calculated position
      window.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: 'smooth',
      });
    });
  }

  // Toggle Filter
  const filter_toggle = document.getElementById('toggleHead');
  filter_toggle.addEventListener('click', function () {
    document.getElementById('toggleBody').classList.toggle('hidden');
  });

  // Toggle Each Category
  const category_filter = document.querySelectorAll('.filter-category p');
  for (let i = 0; i < category_filter.length; i++) {
    category_filter[i].addEventListener('click', function () {
      const parent = category_filter[i].closest('.filter-category');
      const toggleSubMenu = parent.querySelector('.filter-cat-body');
      const icon = parent.querySelector('i');
      if (icon.classList.contains('fa-plus')) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
      toggleSubMenu.classList.toggle('hide-sublist');
    });
  }

  // Detect when Filters are changes and create Query to fetch according to selected filters
  const recipeFilters = document.querySelectorAll(
    '.recipe-cat-list-item input'
  );
  for (let i = 0; i < recipeFilters.length; i++) {
    recipeFilters[i].addEventListener('change', function () {
      let filterString = '';
      for (let i = 0; i < recipeFilters.length; i++) {
        if (recipeFilters[i].checked) {
          filterString += `&${formatRecipeName2(
            recipeFilters[i].getAttribute('name')
          )}=${recipeFilters[i].getAttribute('data-value')}`;
        }
      }
      if (pageType === 'search' || pageType === 'all') {
        if (searchQuery === '' && filterString === '') {
          filterString = generateDefaultRequest();
        }
      } else {
        const addRequest =
          value.length > 0
            ? `&${pageType}=${value}`
            : `&${pageType}=${filters[pageType].join(`&${pageType}=`)}`;
        filterString += addRequest;
      }
      loadRecipes(searchQuery, filterString, 1);
    });
  }
};

// fetch search results from API and show in id="search_recipes"
const loadRecipes = async (searchQuery, request, page) => {
  apiUrl = `https://api.edamam.com/search?&q=${searchQuery}&app_id=${edamamID}&app_key=${edamamKey}`;
  const recipeSection = document.getElementById('search_recipes');
  recipeSection.style.display = 'none';
  displayLoading();
  const startIndex = (page - 1) * limit;
  const searchResults = await fetchReturnDataJson(
    apiUrl,
    request + `&from=${startIndex}&to=${startIndex + limit}`
  );
  let appenHtml = '';
  for (let i = 0; i < searchResults.hits.length; i++) {
    appenHtml += createRecipeCard(searchResults.hits[i].recipe);
  }
  hideLoading();
  recipeSection.style.display = 'flex';
  recipeSection.innerHTML = appenHtml;
};

// In Page Search
function searchHandleKeyPress(event) {
  if (event.key === 'Enter') {
    searchHandleSubmit();
  }
}
function searchHandleSubmit(event) {
  const searchMoreInput = document.getElementById('search_more_input').value;
  if(searchMoreInput.length > 0){
    searchQuery =  searchMoreInput;
  }
  else{
    searchQuery = fixedSearchQuery;
  }
  loadRecipes(searchQuery, '', 1);
}
