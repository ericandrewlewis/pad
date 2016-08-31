import React, {Component} from "react"

class NoteListItem extends Component {
  render () {
    let note = this.props.children
    let className = 'note-list-item' + (this.props.selected ? ' selected' : '')
    return (<div onClick={this.props.onClick} className={className}>{note}</div>)
  }
}

export default class NoteBrowser extends Component {
  constructor() {
    super()
  }

  render() {
    let {notes, currentNoteIndex} = this.props
    let noteListItems = notes.map((noteText, index) => {
      let selected = currentNoteIndex === index
      return <NoteListItem selected={selected} onClick={this.props.onClickNote.bind(this, index)} key={index}>{noteText}</NoteListItem>
    })
    return (<div className="note-browser">
      <h2>Notes<button onClick={this.props.onClickCreateNew} style={{marginLeft: '10px'}}>Create a note</button></h2>
      {noteListItems}
    </div>)
  }
}
