const { celebrate, Joi } = require('celebrate');

export const validatePostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Название должно быть не короче 2 символов',
      'string.max': 'Название должно быть не длиннее 30 символов',
    }),
    link: Joi.string().uri().messages({
      'string.uri': 'Не корректная ссылка',
    }),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).messages({
      'string.length': 'Некорректный ID',
    }),
  }),
});
