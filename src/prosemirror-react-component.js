import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import prosemirror from 'prosemirror'
import {schema} from 'prosemirror/dist/schema-basic';
import {exampleSetup, buildMenuItems} from "prosemirror/dist/example-setup"
import {tooltipMenu, menuBar} from "prosemirror/dist/menu"

var {any, func, bool, string, oneOf} = PropTypes;

export default class ProseMirror extends Component {
  constructor() {
    super()
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  componentWillMount() {
    this.setState({currentIndex: 0});
  }

  _mountEditor() {
    const {doc, options} = this.props;
    this.editorNode = this.refs.editorNode;
    this.editor = new prosemirror.ProseMirror({
        place: this.editorNode,
        schema,
        doc,
        plugins: [exampleSetup.config({menuBar: false, tooltipMenu: false})]
      }
    );

    this.menu = buildMenuItems(schema)

    menuBar.config({float: true, content: this.menu.fullMenu}).attach(this.editor)
    tooltipMenu.config({selectedBlockMenu: true,
                        inlineContent: this.menu.inlineMenu,
                        blockContent: this.menu.blockMenu}).attach(this.editor)

    this.editor.on.change.add(this.onChange);
    this.editor.on.selectionChange.add(this.onSelectionChange);
  }

  componentDidMount() {
    this._mountEditor()
  }

  componentWillReceiveProps(props) {
    const {doc, selection, options} = props;
    if (doc !== this.props.doc || selection !== this.props.selection) {
      console.log('update doc -------------');
      // todo: more conservative update
      this._updateEditor(doc, selection)
    }
    if (options !== this.props.options) {
      console.log('update options =============');
      this._removeProseMirror();
      this._mountEditor()
    }
  }

  componentWillUnmount() {
    this._removeProseMirror();
  }

  _removeProseMirror() {
    Array.prototype.slice.call(this.editorNode.childNodes).map(this.editorNode.removeChild.bind(this.editorNode));
  }

  _updateEditor(doc, selection) {
    this._silent = true;
    this.editor.setDoc(this.editor.schema.nodeFromJSON(doc));
    this.editor.setTextSelection(selection.anchor, selection.head);
    this.editor.flush();
    this._silent = false;
  }

  onChange() {
    console.log('hi')
  }

  onSelectionChange() {
    if (this._silent) return;
    const {onChange} = this.props;
    const {anchor, head} = this.editor.selection;
    if (onChange) onChange(
      this.editor.doc.toJSON(),
      {anchor, head}
    );
  }

  render() {
    var {doc, selection, onChange, options, children} = this.props;
    return (
      <div ref="editorNode"></div>
    );
  }
}

ProseMirror.propTypes = {
  doc: any,
  selection: any,
  onChange: func,
  options: any
};

ProseMirror.defaultProps = {
  options: {}
};