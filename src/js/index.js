import React, {Component, PropTypes} from "react";
import ReactDOM from 'react-dom';
import prosemirror from 'prosemirror'
import {schema} from './editor-schema';
import {exampleSetup, buildMenuItems} from "prosemirror/dist/example-setup"
import {menuBar} from "prosemirror/dist/menu"
import PageBrowser from "./PageBrowser";
import Editor from "./Editor";
import update from 'react-addons-update'
import axios from 'axios'
import collabPlugin from './collab'

var {number, string} = PropTypes;
const style = {
  border: '8px solid pink',
  minHeight: '200px'
};

const nodeToText = (node) => {
  let text = ''

  if (node.content && node.content.childCount) {
     node.content.forEach((_node) => {
       text += " " + nodeToText(_node)
     })
  }
  if (node.text) {
    return node.text
  }
  return text
}

const truncateString = (string, truncateTo) => {
  let newString
  if (string.length > truncateTo) {
    newString = doc.substring(0, truncateTo)
  } else {
    newString = string
  }
  return newString
}

let createNewNote = () => {
  return schema.nodes.doc.create({ id: new Date().getTime() },
    schema.nodes.paragraph.create({},
      schema.nodes.text.create({}, 'Write here.')
    )
  )
}

let notes
if (localStorage.getItem("padContent")) {
  notes = JSON.parse(localStorage.getItem("padContent"))
} else {
  notes = [createNewNote()]
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedNoteIndex: 0
    }
    this.onChange = this.onChange.bind(this)
    this.createNewPage = this.createNewPage.bind(this)
    this.setCurrentDocument = this.setCurrentDocument.bind(this)
  }

  getNotes() {
    axios.get('/docs')
      .then((response) => {
        if (response.status === 200) {
          notes = response.data.map((note) => {
            schema.nodes.doc.create( {id: note.id}, note.content )
          })
        } else {
          console.log('non-200 status from get notes')
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  componentWillMount() {
    // this.getNotes()
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

  componentDidMount() {
    this.editor = window.pm = new prosemirror.ProseMirror({
        place: this.editorNode,
        doc: notes[0],
        schema: schema,
        plugins: [exampleSetup.config({menuBar: false}), collabPlugin]
      }
    );
    this.menu = buildMenuItems(schema)
    menuBar.config({float: true, content: this.menu.fullMenu}).attach(this.editor)
  }

  render() {
    const {currentPageIndex} = this.state;
    const notesTruncated = notes.map((note) => truncateString(nodeToText(note), 300))
    return (
      <div>
        <PageBrowser currentPageIndex={currentPageIndex}
                     notes={notesTruncated}
                     onClickCreateNew={this.createNewPage}
                     onClickNote={this.setCurrentDocument}
                     currentPageIndex={currentPageIndex} />
        <div className="editor"
             ref={(ref) => this.editorNode = ref} />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector('.app'))
