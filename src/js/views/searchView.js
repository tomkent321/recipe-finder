import { DE } from './base';

export const getInput = () => DE.searchInput.val();

export const clearInput = () => {
  DE.searchInput.val(' ');
};

export const clearResults = () => {
  DE.searchResList.empty();
};

// const limitRecTitle = (title, limit = 2) => {
//   const truncTitle = title
//     .split(' ')
//     .splice(0, limit)
//     .join(' ');

//   if (truncTitle === title) {
//     return title;
//   }

//   return `${truncTitle}. . .`;
// };

const limitRecTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const recipeHtml = `
  <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li> 
  `;

  DE.searchResList.append(recipeHtml);
};

const renderButtons = page => {};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
};
