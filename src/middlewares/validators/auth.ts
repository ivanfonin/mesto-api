const { celebrate, Joi } = require('celebrate');

export const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Email обязателен',
      'string.email': 'Не корректный Email',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль обязателен',
      'string.min': 'Пароль не может быть короче 8 символов',
    }),
  }),
});

export const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'any.required': 'Email обязателен',
      'string.email': 'Не корректный Email',
    }),
    password: Joi.string().required().min(8).messages({
      'any.required': 'Пароль обязателен',
      'string.min': 'Пароль не может быть короче 8 символов',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя должно быть не короче 2 символов',
      'string.max': 'Имя должно быть не длиннее 30 символов',
    }),
    about: Joi.string().min(2).max(200).messages({
      'string.min': 'Текст должен быть не короче 2 символов',
      'string.max': 'Текст должен быть не длиннее 200 символов',
    }),
    avatar: Joi.string().uri().messages({
      'string.uri': 'Не корректная ссылка',
    }),
  }),
});
