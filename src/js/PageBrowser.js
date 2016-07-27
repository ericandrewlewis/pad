import React, {Component} from "react";
import {node} from "prosemirror/dist/model/to_dom"
import {schema} from 'prosemirror/dist/schema-basic'
import {nodeToDOM} from "prosemirror/dist/model/to_dom"

let nodeToText = (node) => {
  let content = ''
  if (node.content && node.content.length) {
     node.content.forEach((_node) => {
       content += " " + nodeToText(_node)
     })
  }
  if (node.text) {
    return node.text
  }
  return content
}
class PageListItem extends Component {
  render () {
    let {doc} = this.props
    doc = nodeToText(doc)
    if (doc.length > 300) {
      doc = doc.substring(0, 100)
    }
    return (<div className="page-list-item">{doc}</div>)
  }
}

export default class PageBrowser extends Component {
  constructor() {
    super()
  }

  render() {
    let {pages, currentPageIndex} = this.props
    let pageListItems = pages.map((page, index) => {
      return <PageListItem key={index} doc={page} />
    })
    return (<div className="page-browser">
      <h2>Pages</h2>
      {pageListItems}
    </div>)
  }
}