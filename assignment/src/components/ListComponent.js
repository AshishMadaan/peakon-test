import { getInitalLetters } from '../utils';

const ListComponent = ({ suggestions, activeIndex, selectItemCB, visible }) => {
  const listItem =
    visible && suggestions.length
      ? suggestions.map(({ attributes: { name } }, index) => {
          const listClass = index === activeIndex ? 'option active' : 'option';
          return (
            <li
              className={listClass}
              key={name}
              onClick={() => selectItemCB(name)}
              {...(index === activeIndex ? { 'aria-live': 'polite' } : {})}
            >
              <span className='initials'>{getInitalLetters(name)}</span>
              {name}
            </li>
          );
        })
      : visible && <li className='option no-match'>No Match Found!!</li>;

  return <>{listItem}</>;
};

export default ListComponent;
