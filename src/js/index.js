import Search from './models/Search';
import Recipe from './models/Recipe';
import { DE, renderSpinner, clearSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

//Global state of app
// -search object
// - Current recipe object
// - Shopping list object
// - Liked recipies

const state = {};
console.log('state: ', state);
// Search Controller **

const ctrlSearch = async () => {
  // 1 get query from view

  const query = searchView.getInput();
  // Testing:
  // const query = 'pizza';

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

DE.searchForm.submit(e => {
  e.preventDefault();

  ctrlSearch();
});

//TESTING
// $(window).bind('load', ctrlSearch);

DE.searchResPages.click(e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    searchView.clearResults();
    const goToPage = parseInt(btn.dataset.goto);
    searchView.renderResults(state.search.result, goToPage);
  }
});

// Recipe Controller ***

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
    // window.r = state.recipe;
    try {
      // get recipe data and parse Ingredients

      await state.recipe.getRecipe();

      // recipeView.renderRecipe();
      state.recipe.parseIngredients();

      // call calcTime and calcServings

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

// $(window).bind('hashchange', ctrlRecipe);
// $(window).bind('load', ctrlRecipe);

['hashchange', 'load'].forEach(event => $(window).bind(event, ctrlRecipe));

// handle recipe servings buttons
// btn-decrease *  selects any child

$(DE.recipeMain).click(e => {
  console.log('fired handler, e: ', e.target);
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {

    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
    }
    
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
  }
  console.log(state.recipe);
});
