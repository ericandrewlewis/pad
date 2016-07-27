const {Schema, Block, Text, Attribute, } = require("prosemirror/dist/model")
const {Paragraph, BlockQuote, OrderedList, BulletList, HorizontalRule, Heading,
CodeBlock, ListItem, Image, HardBreak, EmMark, StrongMark, LinkMark, CodeMark} = require("prosemirror/dist/schema-basic")

// !! This module defines a number of basic node and mark types, and a
// schema that combines them.

// ;; A default top-level document node type.
class Doc extends Block {
  get attrs() { return {id: new Attribute()}}
}
exports.Doc = Doc

// :: Schema
// A basic document schema.
const schema = new Schema({
  nodes: {
    doc: {type: Doc, content: "block+"},

    paragraph: {type: Paragraph, content: "inline<_>*", group: "block"},
    blockquote: {type: BlockQuote, content: "block+", group: "block"},
    ordered_list: {type: OrderedList, content: "list_item+", group: "block"},
    bullet_list: {type: BulletList, content: "list_item+", group: "block"},
    horizontal_rule: {type: HorizontalRule, group: "block"},
    heading: {type: Heading, content: "inline<_>*", group: "block"},
    code_block: {type: CodeBlock, content: "text*", group: "block"},

    list_item: {type: ListItem, content: "paragraph block*"},

    text: {type: Text, group: "inline"},
    image: {type: Image, group: "inline"},
    hard_break: {type: HardBreak, group: "inline"}
  },

  marks: {
    em: EmMark,
    strong: StrongMark,
    link: LinkMark,
    code: CodeMark
  }
})
exports.schema = schema