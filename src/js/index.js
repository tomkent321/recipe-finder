import Search from './models/Search';
import { DE, renderSpinner, clearSpinner } from './views/base';
import * as searchView from './views/searchView';

//Global state of app
// -search object
// - Current recipe object
// - Shopping list object
// - Liked recipies

const state = {};

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

// const ctrlDeleteItem = e => {
//   let itemId, splitID, type, ID;

//   itemId = e.target.parentNode.parentNode.parentNode.parentNode.id

// search.getResults();
