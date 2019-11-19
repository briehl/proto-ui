import React, { Component } from 'react';
import { render } from 'react-dom';
// Imports for page-specific components
// path: /dashboard
import { Dashboard } from './components/dashboard/index';
// path: /object_relations
import { ObjectRelations } from './components/object_relations/index';
// path: /catalog
import { AppCatalog } from './components/catalog/index';

// Utils
import { getUsername } from './utils/auth';

// Get a pathname for the page without the global prefix for routing purposes.
// Eg. given a prefix of '/x/y' and a pathname of '/x/y/a/b', we want to get '/a/b'
let PATHNAME = document.location.pathname
  .replace(new RegExp('^' + window._env.url_prefix), '') // Remove global url prefix
  .replace(/\/$/, ''); // Remove trailing slash
if (PATHNAME[0] !== '/') {
  PATHNAME = '/' + PATHNAME;
}

const CONTAINER = document.getElementById('react-root');

// Underline the current item in the top-nav. Plain JS. Uses tachyons classes.
document.querySelectorAll('[data-hl-nav]').forEach(node => {
  let HTMLEle: HTMLElement = node as HTMLElement;
  if (PATHNAME === node.getAttribute('data-hl-nav')) {
    // to add style, it has to be HTMLElement and not node or Element
    HTMLEle.style.backgroundColor = '#e4e3e4';
  }
});

// Set the signed-in username in the global env
getUsername((username: string | null) => {
  if (username) {
    window._env.username = username;
  }
});

interface Props {
  root: typeof Dashboard | typeof ObjectRelations;
}
interface State {}
// Global page wrapper
class Page extends Component<Props, State> {
  render() {
    return <this.props.root />;
  }
}

// Render the page component based on pathname
if (CONTAINER) {
  // Simple routing by looking at pathname
  const routes: {
    [key: string]: { [key: string]: typeof Dashboard | typeof ObjectRelations };
  } = {
    '/dashboard': {
      component: Dashboard,
    },
    '/iframe/dashboard': {
      component: Dashboard,
    },
    '/iframe/object_relations': {
      component: ObjectRelations,
    },
    '/catalog': {
      component: AppCatalog,
    },
  };

  if (PATHNAME in routes) {
    const topComponent = routes[PATHNAME].component;
    render(<Page root={topComponent} />, CONTAINER);
  } else {
    console.error(
      `Unable to find a React component for this page. Path: ${PATHNAME}. Routes: ${Object.keys(
        routes
      )}`
    ); // eslint-disable-line
  }
}
