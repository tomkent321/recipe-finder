import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { DE, renderSpinner, clearSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

//Global state of app
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipies

///////////// STATE /////////////
const state = {};

//TESTING
window.r = state;

///////////// CONTROL:  search  CALLS searchView methods /////////////
const ctrlSearch = async () => {
  // 1 get query from view

  const query = searchView.getInput();

  if (query) {
    // 2 new search obj added to state
    state.search = new Search(query);

    //3 prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderSpinner(DE.searchResList);
    //4 search for recipies
    try {
      await state.search.getResults();
      clearSpinner();
      // 5 render results on UI

      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something went wrong with the search');
      clearSpinner();
    }
  }
};

///////////// EVENT: submit first search input CALLS ctrlSearch /////////////
DE.searchForm.submit(e => {
  e.preventDefault();
  ctrlSearch();
});

///////////// EVENT: clicking the 'next' or 'previous' button at bottom of results panel /////////
DE.searchResPages.click(e => {
  /* HTML referenced: 
        <button class="btn-inline results__btn--next" data-goto="2">
                <span>Page 2</span>
                <svg class="search__icon">
                      <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>
        </button>  */

  const btn = e.target.closest('.btn-inline'); // closest will take any click including span and svg classes

  if (btn) {
    searchView.clearResults();
    const goToPage = parseInt(btn.dataset.goto);
    searchView.renderResults(state.search.result, goToPage);
  }
});

///////////// CONTROL: recipe /////////////
const ctrlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe();
    renderSpinner(DE.recipeMain);

    // Highight selection

    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    //TESTING
    // window.r = state;
    try {
      // get recipe data and parse Ingredients

      await state.recipe.getRecipe();

      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      clearSpinner();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert('Error processing recipe!');
    }
  }
};

///////////// CONTROL: list /////////////
const ctrlList = () => {
  console.log('fired ctrlList');
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

///////////// EVENT: change or load in the url /////////

['hashchange', 'load'].forEach(event => $(window).bind(event, ctrlRecipe));

///////////// EVENT: increase or decrease servings buttons ///////
$(DE.recipeMain).click(e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // btn-decrease *  selects any child
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    ctrlList();
  }
});
