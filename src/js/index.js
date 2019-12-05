import Search from './models/Search';
import Recipe from './models/Recipe';
import { DE, renderSpinner, clearSpinner } from './views/base';
import * as searchView from './views/searchView';

//Global state of app
// -search object
// - Current recipe object
// - Shopping list object
// - Liked recipies

const state = {};

// Search Controller **

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

    await state.search.getResults();
    clearSpinner();
    // 5 render results on UI

    searchView.renderResults(state.search.result);
  }
};

DE.searchForm.submit(e => {
  e.preventDefault();
  ctrlSearch();
});

DE.searchResPages.click(e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    searchView.clearResults();
    const goToPage = parseInt(btn.dataset.goto);
    searchView.renderResults(state.search.result, goToPage);
  }
});

// Recipe Controller ***

// const r = new Recipe(46956);
// r.getRecipe(r);
// console.log('r', r);
const ctrlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    // prepare UI for changes

    // create new recipe object

    state.recipe = new Recipe(id);

    // get recipe data

    await state.recipe.getRecipe();

    // call calcTime and calcServings

    state.recipe.calcTime();
    state.recipe.calcServings();
    // render recipe

    console.log(state);
  }
};

$(window).bind('hashchange', ctrlRecipe);
