import React, {Component, PropTypes} from "react";
import ReactDOM from 'react-dom';
import {schema} from 'prosemirror/dist/schema-basic';
import PageBrowser from "./PageBrowser";
import Editor from "./Editor";

var {number, string} = PropTypes;
const style = {
  border: '8px solid pink',
  minHeight: '200px'
};

class App extends Component {
  constructor() {
    super()

    let pages
    if (localStorage.getItem("padContent")) {
      pages = JSON.parse(localStorage.getItem("padContent"))
    } else {
      let node = document.createElement('p')
      node.textContent = 'Here\'s your first page.'
      pages = [schema.parseDOM(node).toJSON()]
    }
    this.state = {
      pages: pages,
      currentPageIndex: 0,
      selection: undefined
    }
    this.onChange = this.onChange.bind(this)
  }

  componentWillMount() {
    this.setState({doc: undefined, selection: undefined});
  }

  onChange(doc, selection) {
    let {pages, currentPageIndex} = this.state
    pages[currentPageIndex] = doc
    this.setState({
      pages: pages,
      selection: selection
    })
    localStorage.setItem("padContent", JSON.stringify([doc]));
  }

  render() {
    const {pages, currentPageIndex, selection} = this.state;
    let doc = pages[currentPageIndex];
    return (
      <div>
        <PageBrowser currentPageIndex={currentPageIndex} pages={pages} />
        <Editor style={style} onChange={this.onChange} doc={doc} selection={selection}/>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector('.app'))
