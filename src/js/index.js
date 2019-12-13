import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { DE, renderSpinner, clearSpinner } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert('Error processing recipe!');
    }
  }
};

///////////// CONTROL: list /////////////
const ctrlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

///////////// CONTROL: likes /////////////

/// test

const ctrlLike = () => {
  // Create a new likes list if there is none yet
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // user has not liked current recipe
  if (!state.likes.isLiked(currentId)) {
    // add to like list
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // toggle liked button
    likesView.toggleLikeBtn(true);

    // add to the UI list
    likesView.renderLike(newLike);

    //user has liked recipe
  } else {
    // remove from state.likes
    state.likes.deleteLike(currentId);

    // toggle liked button
    likesView.toggleLikeBtn(false);

    //remove like from like list
    likesView.deleteLike(currentId);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

///////////// EVENT: window load, read likes from local Storage /////////

$(window).on('load', () => {
  state.likes = new Likes();

  //Restore likes
  state.likes.readStorage();

  //Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});



///////////// EVENT: delete and update shopping list items /////////
$(DE.shopList).click(e => {
  //note: the html label for a dataset will be changed to all lowercase no matter how it is written in the code
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id);

    // delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseInt(e.target.value, 10);
    if (val > 0) {
      state.list.updateCount(id, val);
    } else {
      state.list.updateCount(id, 0);
    }
  }
});

///////////// EVENT: change or load in the url /////////
['hashchange', 'load'].forEach(event => $(window).bind(event, ctrlRecipe));

///////////// EVENT: main receipe events: increase or decrease servings buttons, add to shopping list button, add to likes button ///////
$(DE.recipeMain).click(e => {
  // btn-decrease *  selects any child
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    //add ingredients to shopping list
    ctrlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // likes controller
    ctrlLike();
  }
});
