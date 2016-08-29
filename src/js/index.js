import React, {Component, PropTypes} from "react";
import ReactDOM from 'react-dom';
import {schema} from './editor-schema';
import PageBrowser from "./PageBrowser";
import Editor from "./Editor";
import update from 'react-addons-update'
import axios from 'axios'

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
      let doc = schema.nodes.doc.create( {id: new Date().getTime()},
        schema.nodes.paragraph.create( {},
          schema.nodes.text.create({}, 'Write here.')
        )
      ).toJSON()
      pages = [doc]
    }
    this.state = {
      pages: pages,
      currentPageIndex: 0,
      selection: undefined
    }
    this.onChange = this.onChange.bind(this)
    this.createNewPage = this.createNewPage.bind(this)
    this.setCurrentDocument = this.setCurrentDocument.bind(this)
  }

  getPages() {
    axios.get('/docs')
      .then((response) => {
        this.setState({
          pages: response.data
        })
      }).catch((error) => {
        console.log(error)
      })
  }

  componentWillMount() {
    this.getPages()
    this.setState({doc: undefined, selection: undefined});
  }

  onChange(doc, selection) {
    let {currentPageIndex} = this.state
    this.setState(update(this.state, {
      pages: {$splice: [[currentPageIndex, 1, doc]]},
    }))
    localStorage.setItem("padContent", JSON.stringify(this.state.pages));
  }

  createNewPage() {
    let doc = schema.nodes.doc.create( {id: new Date().getTime()},
      schema.nodes.paragraph.create( {},
        schema.nodes.text.create({}, 'Write here.')
      )
    ).toJSON()
    let state = update(this.state, {
      pages: {
        $unshift: [doc]
      }
    })

    this.setState(state)
  }

  setCurrentDocument(index) {
    this.setState({currentPageIndex: index})
  }

  render() {
    const {pages, currentPageIndex, selection} = this.state;
    let doc = pages[currentPageIndex];
    return (
      <div>
        <PageBrowser currentPageIndex={currentPageIndex}
                     pages={pages}
                     onClickCreateNew={this.createNewPage}
                     onClickPage={this.setCurrentDocument}
                     currentPageIndex={currentPageIndex} />
        <Editor style={style} onChange={this.onChange} doc={doc} selection={selection}/>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector('.app'))
