import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Header.css';

import { AccountDropdown } from './AccountDropdown';
import { fetchProfileAPI } from '../../utils/userInfo';
import { getUsername } from '../../utils/auth';

interface State {
  avatarOption: string | undefined;
  gravatarDefault: string | undefined;
  env: string | undefined;
  envIcon: string | undefined;
  username: string | null;
  realname: string | null;
  gravatarHash: string;
}

interface Props {
  title: string;
}

export class Header extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      avatarOption: undefined,
      gravatarDefault: undefined,
      env: undefined,
      envIcon: undefined,
      username: null,
      realname: null,
      gravatarHash: '',
    };
    this.getUserID = this.getUserID.bind(this);
    this.setUrl_prefix = this.setUrl_prefix.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    //TODO: AKIYO setUrl_prefix setting the state calling getUserID second time.
    // make change to stop second call
    this.setUrl_prefix();
    this.getUserID();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState === this.state) {
      return;
    }
  }

  getUserID() {
    getUsername(username => {
      if (typeof username === 'string') {
        window._env.username = username;
        this.getUserInfo(window._env.username);
      }
    });
  }

  setUrl_prefix() {
    let prefix: string = '';
    let icon: string = '';
    switch (window._env.url_prefix) {
      case '':
      case 'https://ci.kbase.us':
        prefix = 'CI';
        icon = 'fa fa-2x fa-flask';
        this.setState({ env: prefix, envIcon: icon });
        break;
      case 'https://appdev.kbase.us':
        prefix = 'APPDEV';
        icon = 'fa fa-2x fa-wrench';
        this.setState({ env: prefix, envIcon: icon });
        break;
      default:
        prefix = 'CI';
        icon = 'fa fa-2x fa-flask';
    }
    this.setState({ env: prefix, envIcon: icon });
  }

  async getUserInfo(username: string) {
    const res = await fetchProfileAPI(username);
    if (res) {
      const avatarOption = res.profile.userdata.avatarOption;
      const gravatarHash = res.profile.synced.gravatarHash;
      const gravatarDefault = res.profile.userdata.gravatarDefault;
      const username = res.user.username;
      const realname = res.user.realname;
      this.setState({
        avatarOption,
        gravatarDefault,
        gravatarHash,
        realname,
        username,
      });
    }
  }

  // Set gravatarURL
  gravatarSrc() {
    if (this.state.avatarOption === 'silhoutte' || !this.state.gravatarHash) {
      return window._env.url_prefix + 'static/images/nouserpic.png';
    } else if (this.state.gravatarHash) {
      return (
        'https://www.gravatar.com/avatar/' +
        this.state.gravatarHash +
        '?s=300&amp;r=pg&d=' +
        this.state.gravatarDefault
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1 className="roboto-header">{this.props.title}</h1>
        <div
          className="flex top-0 right-0 absolute h-100"
          style={{ marginRight: '4px' }}
        >
          <div
            className="tc"
            style={{
              border: '1px silver solid',
              padding: '3px',
              margin: '2px',
              height: '58px',
              minWidth: '34px',
              alignSelf: 'center',
              marginRight: '24px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                paddingBottom: '4px',
              }}
            >
              {this.state.env}
            </div>
            <i
              className={this.state.envIcon}
              style={{ color: '#2196F3', fontSize: '28px' }}
            ></i>
          </div>
          <AccountDropdown  username={this.state.username} realname={this.state.realname} gravatarURL={this.gravatarSrc()} />
        </div>
      </div>
    );
  }
}
