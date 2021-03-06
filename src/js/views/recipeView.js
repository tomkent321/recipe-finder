import { DE } from './base';
import { Fraction } from 'fractional'; //imported from NPM
import Likes from '../models/Likes';

export const clearRecipe = () => {
  DE.recipeMain.empty();
};

const formatCount = num => {
  num = Math.round(num * 10) / 10;
  if (num < 1) {
    return `${new Fraction(num).numerator}/${new Fraction(num).denominator}`;
  } else if (num - parseInt(num) > 0) {
    let decNum = num - parseInt(num);
    return `${parseInt(num)} ${new Fraction(decNum).numerator}/${new Fraction(decNum).denominator}`;
  }

  return num;
};

const createIngredient = ingredient => `
    <li class="recipe__item">
          <svg class="recipe__icon">
              <use href="img/icons.svg#icon-check"></use>
          </svg>
          <div class="recipe__count">${formatCount(ingredient.count)}</div>
          <div class="recipe__ingredient">
              <span class="recipe__unit">${ingredient.unit}</span>
              ${ingredient.ingredient}
          </div>
      </li>`;

export const renderRecipe = (recipe, isLiked) => {
  const recipeMarkUp = `
      <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
          <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-stopwatch"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
          <span class="recipe__info-text"> minutes</span>
      </div>
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-man"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
          <span class="recipe__info-text"></span>

          <div class="recipe__info-buttons">
              <button class="btn-tiny btn-decrease">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-minus"></use>
                  </svg>
              </button>
              <button class="btn-tiny btn-increase">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-plus"></use>
                  </svg>
              </button>
          </div>

      </div>
      <button class="recipe__love">
          <svg class="header__likes">
              <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
          </svg>
      </button>
    </div>



    <div class="recipe__ingredients">
      <ul class="recipe__ingredient-list">

      ${recipe.ingredients.map(el => createIngredient(el)).join('')}
          
      </ul>

      <button class="btn-small recipe__btn recipe__btn--add">
          <svg class="search__icon">
              <use href="img/icons.svg#icon-shopping-cart"></use>
          </svg>
          <span>Add to shopping list</span>
      </button>
    </div>

    <div class="recipe__directions">
      <h2 class="heading-2">How to cook it</h2>
      <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__by">${
            recipe.author
          }</span>. Please check out directions at their website.
      </p>
      <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
          <span>Directions</span>
          <svg class="search__icon">
              <use href="img/icons.svg#icon-triangle-right"></use>
          </svg>

      </a>
    </div>
  `;
  DE.recipeMain.append(recipeMarkUp);
};

export const updateServingsIngredients = recipe => {
  // update servings
  $('.recipe__info-data--people').text(recipe.servings);

  // update ingredients
  const countElements = Array.from($('.recipe__count'));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
