import React from 'react';
import bleach from 'bleach';

class MarkupTextInline extends React.Component {
    constructor(props) {
        super(props);
        this.whitelist = [
            'a',
            'b',
            'i',
            'img',
            'em',
            'strong',
            'br',
            'ol',
            'ul',
            'li',
            'quote',
            'p',
            'table',
            'carousel',
            'span',
            'math',
            'maction',
            'maligngroup',
            'malignmark',
            'menclose',
            'merror',
            'mfenced',
            'mfrac',
            'mglyph',
            'mi',
            'mlablededtr',
            'mlongdiv',
            'mmultiscripts',
            'mn',
            'mo',
            'mover',
            'mpadded',
            'mphantom',
            'mroot',
            'mrow',
            'ms',
            'mscarries',
            'mscarry',
            'msgroup',
            'msline',
            'mspace',
            'msqrt',
            'msrow',
            'mstack',
            'mstyle',
            'msub',
            'msup',
            'msubsup',
            'mtable',
            'mtd',
            'mtext',
            'mtr',
            'munder',
            'munderover',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'video',
            'source',
            'pre',
            'code',
            'sub',
            'sup',
            'h1',
            'h2',
        ];

        this.options = {
            mode: 'white',
            list: this.whitelist
        };
    }

    render() {
        return(
            <span ref="task" style={this.props.style} className={this.props.classNames} dangerouslySetInnerHTML={{__html: bleach.sanitize(this.props.content, this.options)}}/>
        );
    }
}

export default MarkupTextInline;
