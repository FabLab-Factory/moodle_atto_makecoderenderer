YUI.add('moodle-atto_makecoderenderer-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_makecoderenderer
 * @copyright  2020 Zimcke Van de Staey <zimcke@fablabfactory.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_makecoderenderer-button
 */

/**
 * Atto makecoderenderer plugin.
 *
 * @namespace M.atto_makecoderenderer
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var CSS = {
        RESPONSIVE: 'img-responsive',
        INPUTSUBMIT: 'atto_makecoderenderer_submit',
        CLOSE: 'atto_makecoderenderer_close',
        CODESNIPPETAREA: 'atto_makecoderenderer_codesnippet_text_area',
        CODESNIPPETPUB: 'atto_makecoderenderer_codesnippet_pub',
        CODESNIPPET: 'atto_makecoderenderer_codesnippet',
        MAKECODERENDERER: 'atto_makecoderenderer_plugin'
    },

    SELECTORS = {
        CODESNIPPETAREA: '#' + CSS.CODESNIPPETAREA,
        CODESNIPPETPUB: '#' + CSS.CODESNIPPETPUB,
        CODESNIPPET: '.' + CSS.CODESNIPPET,
        MAKECODERENDERER: '#' + CSS.MAKECODERENDERER
    },

    COMPONENTNAME = 'atto_makecoderenderer',
  
    /**
     * The form template for the MakeCode codesnippet dialogue
     */
    TEMPLATE = '' +
        '<form class="atto_attoform">' +
        '<div class="container mt-3">' +

        '<div class="row">' +
        '<div class="col-12 form-group">' +
        '<b><label for="{{CSS.CODESNIPPETPUB}}">{{get_string "help_codesnippet_pub" component}}</label></b><br>' +
        '<label>{{get_string "example_codesnippet_pub" component}}</label>' +
        '<textarea class="form-control" id="{{CSS.CODESNIPPETPUB}}" rows="1"></textarea>' +
        '</div>' +
        '</div>' +

        '<div class="row">' +
        '<div class="col-12 form-group">' +
        '<b><label for="{{CSS.CODESNIPPETAREA}}">{{get_string "help_codesnippet" component}}</label></b><br>' +
        '<label>{{get_string "example_codesnippet" component}}</label>' +
        '<textarea class="form-control" id="{{CSS.CODESNIPPETAREA}}" rows="10"></textarea>' +
        '</div>' +
        '</div>' +

        '<div class="row">' +
        '<div class="col-12 mdl-align">' +
        '<button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">' + '' +
        '{{get_string "insert" component}}</button>' +

        '<button class="btn btn-secondary {{CSS.CLOSE}}" type="button">' + '' +
        '{{get_string "close" component}}</button>' +
        '</div>' +
        '</div>' +

        '</div>' +
        '</form>',

    /**
     * All templates for content generation
     */
    CODESNIPPETTEMPLATE = '' +
        '<pre class="{{CSS.CODESNIPPET}}" data-pub="{{pub}}">'+
        '{{code}}' +
        '</pre><p><br></p>',

    MAKECODERENDERERTEMPLATE = '' +
        '<div id="{{CSS.MAKECODERENDERER}}">' +
        '<script>'+
        'var makeCodeRenderPre = makeCodeRenderPre || (function() {' +
            'var pendingPres = [];' +

            'function injectRenderer() {' +
                'var f = document.getElementById("makecoderenderer");' +
                'if (f) {' +
                '    return;' +
                '}' +
                'var f = document.createElement("iframe");' +
                'f.id = "makecoderenderer";' +
                'f.style.position = "absolute";' +
                'f.style.left = 0;' +
                'f.style.bottom = 0;' +
                'f.style.width = "1px";' +
                'f.style.height = "1px";'+
                'f.src = "https://makecode.microbit.org/--docs?render=1";' +
                'document.body.appendChild(f);' +
            '}' +

            'function renderPre(pre) {' +
                'if (!pre.id) pre.id = Math.random();' +
                'var f = document.getElementById("makecoderenderer");' +
                'if (!f || !!pendingPres) {' +
                '    pendingPres.push(pre);' +
                '    injectRenderer();' +
                '} else {' +
                '    if (pre.getAttribute("data-pub") != "") {' +
                '        f.contentWindow.postMessage({' +
                '            type: "renderblocks",' +
                '            id: pre.id,' +
                '            code: "",' +
                '            options: {' +
                '                packageId: pre.getAttribute("data-pub")' +
                '            }' +
                '        }, "https://makecode.microbit.org/");' +
                '    } else {' +
                '        f.contentWindow.postMessage({' +
                '            type: "renderblocks",' + 
                '            id: pre.id,' +
                '            code: pre.innerText,' +
                '            options: {}' +
                '        }, "https://makecode.microbit.org/");' +
                '    }' +
                '}' +
            '}' +

            'window.addEventListener("message", function(ev) {' +
            '    var msg = ev.data;' +
            '    if (msg.source != "makecode") return;' +

            '    console.log(msg.type);' +
            '    switch (msg.type) {' +
            '        case "renderready":' +        				
            '            var pres = pendingPres;' +
            '            pendingPres = undefined;' +
            '            pres.forEach(function(pre) {' +
            '                renderPre(pre);' +
            '            });' +
            '            break;' +
            '        case "renderblocks":' +
            '            var svg = msg.svg;' +
            '            var id = msg.id;' +
            '            var img = document.createElement("img");' +
            '            img.src = msg.uri;' +
            '            img.width = msg.width;' +
            '            img.height = msg.height;' +
            '            var code = document.getElementById(id);' +
            '            code.parentElement.insertBefore(img, code);' +
            '            code.parentElement.removeChild(code);' +
            '            break;' +
            '    }' +
            '}, false);' +

            'return renderPre;' +
        '})();' +

        'function renderSnippets() {' +
            'let pres = document.getElementsByTagName("pre");' +
            'Array.prototype.forEach.call(pres, function(pre) {' +
            '    makeCodeRenderPre(pre);' +
            '})' +
        '}' +

        'renderSnippets();' +
        '</script>' +
        '</div>';

Y.namespace('M.atto_makecoderenderer').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
    * A reference to the current selection at the time that the dialogue
    * was opened.
    *
    * @property _currentSelection
    * @type Range
    * @private
    */
    _currentSelection: null,

    /**
    * A reference to the currently open form.
    *
    * @param _attoform
    * @type Node
    * @private
    */
    _attoform: null,

    initializer: function () {

        this.addButton({
            icon: M.util.image_url("ed/" + 'makecode', "atto_makecoderenderer"),
            callback: this._displayDialogue,
            tags: SELECTORS.CODESNIPPET, 
            tagMatchRequiresAll: false
        });
        this.editor.delegate('dblclick', this._displayDialogue, SELECTORS.CODESNIPPET, this); 
        this.editor.delegate('click', this._handleClick, SELECTORS.CODESNIPPET, this);

        // e.preventDefault needed to stop the default event from clobbering the desired behaviour in some browsers.
        this.editor.on('dragover', function (e) {
            e.preventDefault();
        }, this);
        this.editor.on('dragenter', function (e) {
            e.preventDefault();
        }, this);
    },

    /**
    * Handle a click on a codesnippet.
    *
    * @method _handleClick
    * @param {EventFacade} e
    * @private
    */
    _handleClick: function (e) {
        var codesnippet = e.target;

        var selection = this.get('host').getSelectionFromNode(codesnippet);
        if (this.get('host').getSelection() !== selection) {
            this.get('host').setSelection(selection);
        }
    },

    /**
    * Display the codesnippet editing tool.
    *
    * @method _displayDialogue
    * @private
    */
    _displayDialogue: function () {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('title', COMPONENTNAME),
            width: 'auto',
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.CODESNIPPET
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent())
            .show();
    },

    /**
    * Return the dialogue content for the tool, attaching any required
    * events.
    *
    * @method _getDialogueContent
    * @return {Node} The content to place in the dialogue.
    * @private
    */
    _getDialogueContent: function () {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                component: COMPONENTNAME
            }));

        this._attoform = content;

        this._setCodesnippet();
        this._attoform.one('.' + CSS.INPUTSUBMIT).on('click', this._insertData, this);
        this._attoform.one('.' + CSS.CLOSE).on('click', this._closeDialogue, this);

        return content;
    },
  

    /**
     * Parse and insert the data of the dialogue form into the editor at the suitable location (as a child of fablib_contentwrapper)
     * 
     * @param {Event} e 
     * @private
     */
    _insertData: function (e) {
        var makecoderenderer = '',
            html = '',
            host = this.get('host');

        e.preventDefault();

        // Check if there are any accessibility issues.
        if (this._updateWarning()) {
            return;
        }

        // Focus on the editor in preparation for inserting the image.
        host.focus();
        host.setSelection(this._currentSelection);

        var html = this._getCodeSnippet();

        var makecoderenderertemplate = Y.Handlebars.compile(MAKECODERENDERERTEMPLATE);
        makecoderenderer = makecoderenderertemplate({
            CSS: CSS
        });

        var renderer = this.editor.one(SELECTORS.MAKECODERENDERER);
        if(renderer == null){
            this.editor.append(makecoderenderer);
        }

        this.get('host').insertContentAtFocusPoint(html);
        this.markUpdated();
    },

    /**
     * Close the dialogue 
     * 
     * @param {Event} e 
     */
    _closeDialogue: function(e) {
        this.getDialogue({
            focusAfterHide: null
        }).hide();
    },

    _setCodesnippet: function() {

        var codesnippets = this.get('host').getSelectedNodes();
        if (codesnippets) {
            codesnippets = codesnippets.filter('pre');
        }

        if (codesnippets && codesnippets.size()) {
            var codesnippet = codesnippets.item(0);
            console.log(codesnippet);

            var code = codesnippet.get('innerHTML');
            var pub = codesnippet.getAttribute('data-pub');
        
            if(pub && pub!=''){
                this._attoform.one(SELECTORS.CODESNIPPETPUB).set('value', pub);
            }
            if(code && code!=''){
                this._attoform.one(SELECTORS.CODESNIPPETAREA).set('value', code);
            }
        }
    },

    _getCodeSnippet: function() {
        var html = '';
        var pub = this._attoform.one(SELECTORS.CODESNIPPETPUB).get('value');
        var code = this._attoform.one(SELECTORS.CODESNIPPETAREA).get('value');

        if(pub !== '' && code !== ''){
            var codesnippettemplate = Y. Handlebars.compile(CODESNIPPETTEMPLATE);
            var codesnippet = codesnippettemplate({
                pub: pub,
                code: code,
                CSS: CSS
            });
            html = html + codesnippet;   
        } else if(pub !== ''){
            var codesnippettemplate = Y. Handlebars.compile(CODESNIPPETTEMPLATE);
            var codesnippet = codesnippettemplate({
                pub: pub,
                code: pub,
                CSS: CSS
            });
            html = html + codesnippet;   
        }
        return html;
    },

    /**
    * Update the alt text warning live.
    *
    * @method _updateWarning
    * @return {boolean} whether a warning should be displayed.
    * @private
    */
    _updateWarning: function () {
        return false;
    }
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
