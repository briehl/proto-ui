import React, { Component } from 'react';
const timeago = require('timeago.js');

import { NarrativeData } from './NarrativeDetails';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';

import { NarrativeDetails } from './NarrativeDetails';
import { LoadingSpinner } from '../../generic/LoadingSpinner';

interface Props {
  items: Array<NarrativeData>;
  loading: boolean;
  totalItems: number;
  onLoadMore?: () => void;
  onSelectItem?: (idx: number) => void;
  selectedIdx: number;
}

interface State {
  items: Array<NarrativeData>;
  activeIdx: number;
}

export class NarrativeTabPane extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // List of narrative data
      items: props.items || [],
      // Currently active narrative result, selected on the left and shown on the right
      // This is unused if the items array is empty.
      activeIdx: 0,
    };
  }
  componentDidMount() {
    this.setState({ items: this.props.items });
  }
  componentDidUpdate(prevProp: Props) {
    if (prevProp.selectedIdx !== this.props.selectedIdx) {
      this.setState({ activeIdx: this.props.selectedIdx });
    } else if (prevProp.items !== this.props.items) {
      this.setState({ items: this.props.items });
    } else {
      return;
    }
  }
  // Handle click event on the "load more" button
  handleClickLoadMore(ev: React.MouseEvent) {
    if (this.props.onLoadMore) {
      this.props.onLoadMore();
    }
  }

  // Handle click event on an individual item
  handleClickItem(idx: number) {
    if (idx < 0 || idx >= this.props.items.length) {
      throw new Error(`Invalid index for ItemList: ${idx}.
        Max is ${this.props.items.length - 1} and min is 0.`);
    }
    if (this.props.onSelectItem) {
      this.props.onSelectItem(idx);
      this.setState({ activeIdx: idx });
    }
  }

  // view for a single narrative item
  itemView = (item: object, idx: number) => {
    // need to set this to "any" otherwise the item type has to be defined.
    let anyItem: any;
    anyItem = item;
    const status = this.props.selectedIdx === idx ? 'active' : 'inactive';
    let currentActiveIndx = this.state.activeIdx
      ? this.state.activeIdx
      : this.props.selectedIdx;
    const activeClass = currentActiveIndx === idx ? 'bg-white' : 'bg-lightgray';
    const data = anyItem.doc;
    const upa = `${data.access_group}/${data.obj_id}`; //WHAT IS UPA?????
    // Action to select an item to view details
    return (
      <Nav.Item
        role="tab"
        key={upa}
        style={{ borderBottom: '1px solid #dedede' }}
        bsPrefix={activeClass}
      >
        <Nav.Link key={idx} eventKey={idx}>
          <section
            className={
              currentActiveIndx === idx
                ? 'fw7 f3 black-font'
                : 'normal f4 dark-font'
            }
            style={{ padding: '0.3rem 0' }}
          >
            {data.narrative_title || 'Untitled'}
          </section>
          <p className="midgray-font">
            Updated {timeago.format(data.timestamp)} by {data.creator}
          </p>
        </Nav.Link>
      </Nav.Item>
    );
  };

  hasMoreButton() {
    const hasMore = this.props.items.length < this.props.totalItems;
    if (!hasMore) {
      return <span className="black-50 pa3 dib tc">No more results.</span>;
    }
    if (this.props.loading) {
      return <LoadingSpinner loading={true} />;
    }
    return (
      <a
        className="tc pa3 dib pointer blue dim b"
        onClick={(ev: React.MouseEvent) => this.handleClickLoadMore(ev)}
      >
        Load more ({this.props.totalItems - this.props.items.length} remaining)
      </a>
    );
  }

  render() {
    const { items } = this.props;
    if (!items || !items.length) {
      if (this.props.loading) {
        // No results but still loading:
        return (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <Spinner animation="grow" size="sm" />
            <Spinner animation="border" variant="primary" />
            <Spinner animation="grow" variant="primary" />
          </div>
        );
      } else {
        // No results and not loading
        return (
          <div className="w-100 tc black-80">
            <p className="pv5"> No results found. </p>
          </div>
        );
      }
    }
    return (
      <>
        <Tab.Container id="narrative-list-nav" defaultActiveKey={0}>
          <Row>
            <Col sm={5}>
              <Nav
                className="flex-column"
                onSelect={(eventKey: string) => {
                  this.handleClickItem(parseInt(eventKey));
                }}
              >
                {items.map((item, idx) => this.itemView(item, idx))}
              </Nav>
            </Col>
            <Col sm={7}>
              <Tab.Content className="sticky-top">
                <Tab.Pane eventKey={this.state.activeIdx}>
                  <NarrativeDetails
                    activeItem={this.state.items[this.state.activeIdx]}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <div>{this.hasMoreButton()}</div>
      </>
    );
  }
}
