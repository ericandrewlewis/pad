import React, {Component} from "react"

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
    let className = 'page-list-item' + (this.props.selected ? ' selected' : '')
    return (<div onClick={this.props.onClick} className={className}>{doc}</div>)
  }
}

export default class PageBrowser extends Component {
  constructor() {
    super()
  }

  render() {
    let {pages, currentPageIndex} = this.props
    let pageListItems = pages.map((page, index) => {
      let selected = currentPageIndex === index
      return <PageListItem selected={selected} onClick={this.props.onClickPage.bind(this, index)} key={index} doc={page} />
    })
    return (<div className="page-browser">
      <h2>Notes<button onClick={this.props.onClickCreateNew} style={{marginLeft: '10px'}}>Create a note</button></h2>
      {pageListItems}
    </div>)
  }
}