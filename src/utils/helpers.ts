const isValidURL = (url: string): boolean => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' // Протокол
    + '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' // Домен
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // или IP-адрес
    + '(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*' // Порт и путь
    + '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' // Параметры запроса
    + '(\\#[-a-zA-Z\\d_]*)?$', 'i'); // Хеш

  return urlPattern.test(url);
};

export default isValidURL;
