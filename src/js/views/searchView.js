import { DE } from './base';

export const getInput = () => DE.searchInput.val();

const renderRecipe = recipe => {
  const recipeHtml = `
  <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li> 
  `;

  DE.searchResList.append(recipeHtml);
};

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
