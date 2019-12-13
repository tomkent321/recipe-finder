import { DE } from './base';

export const renderItem = item => {
  const listMarkUp = `<li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;

  DE.shopList.append(listMarkUp);
};

export const deleteItem = id => {
  // console.log('del id: ', id);
  const item = $(`[data-itemId="${id}"]`).remove();
};
