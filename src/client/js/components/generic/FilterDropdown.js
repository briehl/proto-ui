import React, {Component} from 'react';

/**
 * Filter dropdown component
 * props:
 * - txt - prompt for the dropdown options
 * - disabled - bool to disable the dropdown
 * - items - arr of string of dropdown options
 * state:
 * - isOpen
 * - selectedIdx
 * callbacks:
 * - onSelect - called when an item gets selected
 */
export class FilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: props.selectedIdx || 0,
      isOpen: props.isOpen || false,
    };
  }

  // Add a document event handler to close the dropdown on click outside
  componentDidMount() {
    this.docListener = (ev) => this.handleDocumentClick(ev);
    document.addEventListener('click', this.docListener, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.docListener, false);
  }

  // Used in the componentDidMount document click event listener above
  handleDocumentClick(ev) {
    // Check if we are clicking on this dropdown element (this.base)
    const withinDropdown = this.base.contains(ev.target);
    if (!withinDropdown && this.state.isOpen) {
      this.setState({isOpen: false});
    }
  }

  // Handle a click down to open or close the dropdown
  handleMouseDown(ev) {
    // TODO check if this works okay with touch screens
    if (ev.type === 'mousedown' && ev.button !== 0) {
      // No-op if the mouse button was not the main left-click
      return;
    }
    ev.preventDefault();
    if (this.state.disabled) {
      return;
    }
    this.setState({isOpen: !this.state.isOpen});
  }

  // Select an item in the dropdown by value
  // Closes the dropdown
  selectItem(idx) {
    this.setState({
      selectedIdx: idx,
      isOpen: false,
    });
    if (this.props.onSelect) {
      this.props.onSelect(idx, this.props.items[idx]);
    }
  }

  render(props) {
    const {items} = props;
    let dropdownItems = '';
    let selected = null;
    selected = items[this.state.selectedIdx];
    if (this.state.isOpen) {
      dropdownItems = (
        <div
          className='dib bg-light-gray ba b--black-20 shadow-3 br2'
          style={{position: 'absolute', right: '0', top: '80%', zIndex: '1', width: '14rem'}} >
          { items.map((item, idx) => itemView(this, item, idx)) }
        </div>
      );
    }
    const iconClass = 'ml1 fas ' + (this.state.isOpen ? 'fa-caret-up' : 'fa-caret-down');
    return (
      <div className='dib relative'>
        <a className='dim dib pa3 pointer'
          onClick={(ev) => this.handleMouseDown(ev)}>
          { props.txt + ': ' + selected }
          <i className={iconClass}></i>
        </a>
        {dropdownItems} </div>
    );
  }
}

// View for a single dropdown item
function itemView(component, item, idx) {
  let icon;
  if (component.state.selectedIdx === idx) {
    icon = (<i className='fas fa-check mr1 dib' style={{width: '1.5rem'}}></i>);
  } else {
    icon = (<span className='mr1 dib' style={{width: '1.5rem'}}></span>);
  }
  return (
    <a className='db pa2 pointer hover-bg-blue hover-white'
      onClick={() => component.selectItem(idx)}
      key={item}>
      {icon}
      {item}
    </a>
  );
}
