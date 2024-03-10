const { celebrate, Joi } = require('celebrate');

export const validateGetUser = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).messages({
      'string.length': 'Некорректный ID',
    }),
  }),
});

export const validatePatchUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя должно быть не короче 2 символов',
      'string.max': 'Имя должно быть не длиннее 30 символов',
    }),
    about: Joi.string().min(2).max(200).messages({
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не длиннее 200 символов',
    }),
  }),
});

export const validatePatchAvatar = celebrate({
  body: Joi.string().uri().messages({
    'string.uri': 'Не корректная ссылка',
  }),
});
