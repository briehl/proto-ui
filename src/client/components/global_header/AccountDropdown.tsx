import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { fetchProfileAPI } from '../../utils/userInfo';
import { getUsername } from '../../utils/auth';

interface State {
  dropdownHidden: boolean;
}

interface Props {
  username: string | null;
  realname: string | null;
  gravatarURL: string;
}

export class AccountDropdown extends Component<Props, State> {
  bodyCloseHandler: (ev: MouseEvent) => void = () => {};

  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownHidden: true,
    };
  }

  componentDidMount() {
    this.bodyCloseHandler = (ev) => {
      const elm = document.querySelector('.account-dropdown');
      const target = ev.target;
      if (!elm || !target) {
        return;
      }
      if (!elm.contains(ev.target as Node)) {
        this.setState({ dropdownHidden: true });
      }
    }
    document.body.addEventListener('click', this.bodyCloseHandler);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.bodyCloseHandler);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState === this.state) {
      return;
    }
  }

  toggleDropdown() {
    this.setState({ dropdownHidden: !this.state.dropdownHidden });
  }

  render() {
    return (
      <div className='account-dropdown'>
        <button
          className="profile-dropdown flex pointer"
          onClick={event => this.toggleDropdown()}
        >
          <img
            style={{ maxWidth: '40px' }}
            alt="avatar"
            src={this.props.gravatarURL}
          />
          <i
            className="fa fa-caret-down"
            style={{ marginLeft: '5px', marginTop: '14px', fontSize: '13px' }}
          ></i>
        </button>
        <ul
          className="dropdown-menu tc right-0"
          style={{ left: 'auto' }}
          role="menu"
          hidden={this.state.dropdownHidden}
        >
          <li>
            <div className="dib">
              <div className='black'>{this.props.realname}</div>
              <div className='black i'>{this.props.username}</div>
            </div>
          </li>
          <hr className="hr-global-header" />
          <li>
            <a>
              <div className="dib" style={{ width: '34px' }}>
                <i
                  className="fa fa-sign-out"
                  style={{ fontSize: '150%', marginRight: '10px' }}
                ></i>
              </div>
              <span className='black'>Sign Out</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
