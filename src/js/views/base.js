export const DE = {
  //Dom Elements
  searchForm: $('.search'),
  searchInput: $('.search__field'),
  searchResList: $('.results__list'),
  searchResMain: $('.results'),
  searchResPages: $('.results__pages'),
  recipeMain: $('.recipe')
};

export const DS = {
  spinner: 'loader'
};

export const renderSpinner = parent => {
  const loader = `
   <div class="${DS.spinner}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
   </div>
  `;
  parent.prepend(loader);
};

export const clearSpinner = () => {
  const spinner = $(`.${DS.spinner}`);
  if (spinner) {
    spinner.remove();
  }
};
