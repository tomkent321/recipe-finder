import { DE } from './base';
import { limitRecTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'img/icons.svg#icon-heart' : 'img/icons.svg#icon-heart-outlined';
  $('.recipe__love use').attr('href', iconString);
};

//jquery version
export const toggleLikeMenu = numLikes => {
  numLikes > 0
    ? DE.likesMenu.css('visibility', 'visible')
    : DE.likesMenu.css('visibility', 'hidden');
};

// non-jquery version
// export const toggleLikeMenu = numLikes => {
//   DE.likesMenuH.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
// };

export const renderLike = like => {
  const likeHtml = `
  <li>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${limitRecTitle(like.title)}</h4>
            <p class="likes__author">${like.author}</p>
        </div>
    </a>
</li>`;

  DE.likesList.append(likeHtml);
};


export const deleteLike = id => {
  const el = $(`.likes__link[href="#${id}"]`).parent();

  if (el) {
    el.remove();
  }
}