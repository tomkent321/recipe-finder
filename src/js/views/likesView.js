import { DE } from './base';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked
    ? "img/icons.svg#icon-heart"
    : "img/icons.svg#icon-heart-outlined";
  $('.recipe__love use').attr('href', iconString);
};
