import { useEffect, useState, useRef } from 'react';
import ListComponent from './ListComponent';
import useOutsideClick from '../hooks/useOutsideClick';
import { fetchURI } from '../constants';
import { filter, debounce } from '../utils';
import '../styles.scss';

const LiveSearch = ({ placeholder, debounceDelay }) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestionList, setSuggestionList] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  //Setting the default value, if no value passed form the parent component
  const placeholderText = placeholder || 'Type to find Manager';
  const debounceDelayTime = debounceDelay || 300;

  //As we don't have to make an api calls for reach keypress because as per the given api the data is available on the mount itself,
  //so I've not created a hook for this simple case as of now.
  //I could also create a useFetch hook for this purpose.
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(fetchURI);
      const resJson = await res.json();
      if (!dropdownRef.current) return null;
      setSuggestionList(resJson.data);
    };

    fetchData();

    return () => (dropdownRef.current = false);
  }, []);

  //custom hook to detect if the user has clicked outside the scope of the component
  useOutsideClick(dropdownRef, () => {
    setVisible(false);
  });

  //Set the filtered suggestions based on user types in the input
  const handleChange = e => {
    setQuery(e.target.value);
    setFilteredSuggestions(filter(e.target.value, suggestionList));
    if (!visible) {
      setVisible(true);
    }
  };

  //Callback to trigger when any list item is selected
  const selectItem = name => {
    setQuery(name);
    setVisible(false);
  };

  // Handling of keyPress events of selecting the list item with scroll position
  const handleKeyDown = e => {
    const keyNames = {
      ENTER: 13,
      UP: 38,
      DOWN: 40,
    };

    const dropdownList = optionsRef.current;
    const activeListItem = dropdownList.querySelector('.active');

    let heightOfListItem, top, dropdownHeight;
    if (dropdownList && activeListItem) {
      heightOfListItem = activeListItem.getBoundingClientRect().height; //Height of single list item which is 60px
      top = dropdownList.scrollTop; //Current top of scroll window
      dropdownHeight = dropdownList.scrollHeight; //Full height of dropdownlist
    }

    // User pressed the enter key, reset the index
    if (e.keyCode === keyNames.ENTER) {
      setActiveSuggestion(0);
      setVisible(false);
      setQuery(filteredSuggestions[activeSuggestion].attributes['name']);
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === keyNames.UP) {
      if (activeSuggestion === 0) {
        return;
      }

      if (top !== 0) {
        dropdownList.scrollTop = top - heightOfListItem;
      } else {
        dropdownList.scrollTop = 0;
      }
      setActiveSuggestion(activeSuggestion => activeSuggestion - 1);
    }

    // User pressed the down arrow, increment the index
    else if (e.keyCode === keyNames.DOWN) {
      const nextHeight = top + heightOfListItem; //Next scrollTop height
      const maxHeight = dropdownHeight - heightOfListItem; //Maximum scrollTop height
      if (activeSuggestion + 1 === filteredSuggestions.length) {
        return;
      }

      if (nextHeight <= maxHeight) {
        dropdownList.scrollTop = top + heightOfListItem;
      } else {
        dropdownList.scrollTop = 0;
      }

      setActiveSuggestion(activeSuggestion => activeSuggestion + 1);
    }
  };

  return (
    <div className='container'>
      <div className='dropdown' ref={dropdownRef}>
        <input
          className='dropdown-input'
          type='text'
          placeholder={placeholderText}
          value={query}
          onClick={() => setVisible(true)}
          onChange={e => debounce(handleChange(e), debounceDelayTime)}
          onKeyDown={e => handleKeyDown(e)}
          role='combobox'
          aria-controls='listItems'
          aria-describedby='listItems'
          aria-expanded={visible ? 'true' : 'false'}
          onFocus={() => query && setVisible(true)}
        />
        <div className={`arrow  ${visible ? 'open' : ''}`} />
        <ul
          id='listItems'
          className={`options ${visible ? 'open' : ''}`}
          ref={optionsRef}
        >
          <ListComponent
            suggestions={!query ? suggestionList : filteredSuggestions}
            activeIndex={activeSuggestion}
            selectItemCB={selectItem}
            visible={visible}
          />
        </ul>
      </div>
    </div>
  );
};

export default LiveSearch;
