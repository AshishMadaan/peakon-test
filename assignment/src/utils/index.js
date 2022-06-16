export const debounce = (fn, delay) => {
  let timer;
  return function () {
    const context = this;
    const params = arguments;
    clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(context, params);
    }, delay);
  };
};

export const filter = (searchQuery, list, searchBy = 'name') => {
  searchQuery = searchQuery.toLowerCase();
  let filteredList = searchQuery
    ? list.filter(x => {
        const personalInfo = x['attributes'];
        const concatedName = `${personalInfo.firstName}${personalInfo.lastName}`;

        return (
          personalInfo[searchBy].toLowerCase().includes(searchQuery) ||
          concatedName.toLowerCase().includes(searchQuery)
        );
      })
    : list;
  return filteredList;
};

export const getInitalLetters = string => {
  return string
    .split(' ')
    .map(str => str[0])
    .join('');
};
