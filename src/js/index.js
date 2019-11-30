import Search from './models/Search';
import { DE } from './views/base';
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
    //4 search for recipies

    await state.search.getResults();

    // 5 render results on UI

    searchView.renderResults(state.search.result);
  }
};

DE.searchForm.submit(e => {
  e.preventDefault();
  ctrlSearch();
});

// search.getResults();
