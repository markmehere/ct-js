type-editor.panel.view.flexrow
    .type-editor-Properties
        .tall.flexfix.panel.pad
            .flexfix-header
                texture-input.wide(
                    large="yup" showempty="da"
                    val="{type.texture}"
                    onselected="{applyTexture}"
                )
                b {voc.name}
                input.wide(type="text" onchange="{wire('this.type.name')}" value="{type.name}")
                .anErrorNotice(if="{nameTaken}" ref="errorNotice") {vocGlob.nametaken}
                br
            .flexfix-body
                b {voc.depth}
                input.wide(type="number" onchange="{wire('this.type.depth')}" value="{type.depth}")
                br
                label.block.checkbox
                    input(type="checkbox" checked="{type.extends.visible === void 0 ? true : type.extends.visible}" onchange="{wire('this.type.extends.visible')}")
                    span {voc.visible}
                extensions-editor(type="type" entity="{type.extends}" wide="yep" compact="probably")
                label.block.checkbox(if="{global.currentProject.libs.traviso || type.extends.tilemapEvents}")
                    input(type="checkbox" checked="{type.extends.tilemapEvents}" onchange="{toggleTilemapEvents}")
                    span {voc.tilemapEvents}
                br
                br
                docs-shortcut(path="/ct.types.html" button="true" wide="true" title="{voc.learnAboutTypes}")
            .flexfix-footer
                button#typedone.wide(onclick="{typeSave}" title="Shift+Control+S" data-hotkey="Control+S")
                    svg.feather
                        use(xlink:href="data/icons.svg#check")
                    span {voc.done}
    .type-editor-aCodeEditor
        .tabwrap.tall(style="position: relative")
            ul.tabs.nav.nogrow.noshrink
                li(onclick="{changeTab('typeoncreate')}" class="{active: tab === 'typeoncreate'}" title="{voc.create} (Control+Q)" data-hotkey="Control+q" if="{!type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#sun")
                    span {voc.create}
                li(onclick="{changeTab('typeonstep')}" class="{active: tab === 'typeonstep'}" title="{voc.step} (Control+W)" data-hotkey="Control+w" if="{!type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#skip-forward")
                    span {voc.step}
                li(onclick="{changeTab('typeondraw')}" class="{active: tab === 'typeondraw'}" title="{voc.draw} (Control+E)" data-hotkey="Control+e" if="{!type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#edit-2")
                    span {voc.draw}
                li(onclick="{changeTab('typeondestroy')}" class="{active: tab === 'typeondestroy'}" title="{voc.destroy} (Control+R)" data-hotkey="Control+r" if="{!type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#trash")
                    span {voc.destroy}
                li(onclick="{changeTab('typeonapproach')}" class="{active: tab === 'typeonapproach'}" title="{voc.approach}" if="{type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#space-shooter")
                    span {voc.approach}
                li(onclick="{changeTab('typeonstopnear')}" class="{active: tab === 'typeonstopnear'}" title="{voc.stopnear}" if="{type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#ui")
                    span {voc.stopnear}
                li(onclick="{changeTab('typeoncollect')}" class="{active: tab === 'typeoncollect'}" title="{voc.collect}" if="{type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#space-shooter")
                    span {voc.collect}
                li(onclick="{changeTab('typeonreach')}" class="{active: tab === 'typeonreach'}" title="{voc.reach}" if="{type.extends.tilemapEvents}")
                    svg.feather
                        use(xlink:href="data/icons.svg#ui")
                    span {voc.reach}
            div
                #typeoncreate.tabbed(show="{tab === 'typeoncreate' && !type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeoncreate")
                #typeonstep.tabbed(show="{tab === 'typeonstep' && !type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeonstep")
                #typeondraw.tabbed(show="{tab === 'typeondraw' && !type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeondraw")
                #typeondestroy.tabbed(show="{tab === 'typeondestroy' && !type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeondestroy")
                #typeonapproach.tabbed(show="{tab === 'typeonapproach' && type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeonapproach")
                #typeonstopnear.tabbed(show="{tab === 'typeonstopnear' && type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeonstopnear")
                #typeoncollect.tabbed(show="{tab === 'typeoncollect' && type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeoncollect")
                #typeonreach.tabbed(show="{tab === 'typeonreach' && type.extends.tilemapEvents}")
                    .aCodeEditor(ref="typeonreach")
    script.
        const glob = require('./data/node_requires/glob');
        this.glob = glob;
        this.namespace = 'typeview';
        this.mixin(window.riotVoc);
        this.mixin(window.riotWired);

        this.getTypeTextureRevision = type => glob.texturemap[type.texture].g.lastmod;

        this.type = this.opts.type;
        this.tab = this.type.extends.tilemapEvents ? 'typeonapproach' : 'typeoncreate';

        const tabToEditor = tab => {
            tab = tab || this.tab;
            if (tab === 'typeonstep') {
                return this.typeonstep;
            } else if (tab === 'typeondraw') {
                return this.typeondraw;
            } else if (tab === 'typeondestroy') {
                return this.typeondestroy;
            } else if (tab === 'typeoncreate') {
                return this.typeoncreate;
            } else if (tab === 'typeonapproach') {
                return this.typeonapproach;
            } else if (tab === 'typeonstopnear') {
                return this.typeonstopnear;
            } else if (tab === 'typeoncollect') {
                return this.typeoncollect;
            } else if (tab === 'typeonreach') {
                return this.typeonreach;
            }
            return null;
        };

        this.changeTab = tab => () => {
            this.tab = tab;
            const editor = tabToEditor(tab);
            setTimeout(() => {
                editor.layout();
                editor.focus();
            }, 0);
        };

        this.toggleTilemapEvents = () => {
            console.log('change');
            if (this.type.extends.tilemapEvents)  {
                this.type.extends.tilemapEvents = false;
                this.changeTab('typeoncreate')();
            }
            else {
                this.type.extends.tilemapEvents = true;
                this.changeTab('typeonapproach')();
            }
        };

        const updateEditorSize = () => {
            if (tabToEditor()) {
                tabToEditor().layout();
            }
        };
        const updateEditorSizeDeferred = function () {
            setTimeout(updateEditorSize, 0);
        };
        window.signals.on('typesFocus', this.focusEditor);
        window.signals.on('typesFocus', updateEditorSizeDeferred);
        window.addEventListener('resize', updateEditorSize);
        this.on('unmount', () => {
            window.signals.off('typesFocus', this.focusEditor);
            window.signals.off('typesFocus', updateEditorSizeDeferred);
            window.removeEventListener('resize', updateEditorSize);
        });

        this.on('mount', () => {
            var editorOptions = {
                language: 'typescript',
                lockWrapper: true
            };
            setTimeout(() => {
                const allEvents = [
                    'oncreate',
                    'onstep',
                    'ondraw',
                    'ondestroy',
                    'onapproach',
                    'onstopnear',
                    'oncollect',
                    'onreach'
                ];
                const allFnNames = [
                    'onCreate',
                    'onStep',
                    'onDraw',
                    'onDestroy',
                    'onApproach',
                    'onStopNear',
                    'onCollect',
                    'onReach'
                ];

                for (let i = 0; i < allEvents.length; i++) {
                    const firstLine = i < 4 ? 'function ' + allFnNames[i] + '(this: Copy) {' :
                        'function ' + allFnNames[i] + '(this: ObjectView, finishApproach: FinishApproachCallback) {';
                    this['type' + allEvents[i]] = window.setupCodeEditor(
                        this.refs['type' + allEvents[i]],
                        Object.assign({}, editorOptions, {
                            value: this.type[allEvents[i]],
                            wrapper: [firstLine, '}']
                        })
                    );
                    this['type' + allEvents[i]].onDidChangeModelContent(() => {
                        this.type[allEvents[i]] = this['type' + allEvents[i]].getPureValue();
                    });
                }
                this.typeoncreate.focus();
            }, 0);
        });
        this.on('update', () => {
            if (global.currentProject.types.find(type =>
                this.type.name === type.name && this.type !== type)) {
                this.nameTaken = true;
            } else {
                this.nameTaken = false;
            }
        });
        this.on('unmount', () => {
            // Manually destroy code editors, to free memory
            this.typeoncreate.dispose();
            this.typeonstep.dispose();
            this.typeondraw.dispose();
            this.typeondestroy.dispose();
            this.typeonapproach.dispose();
            this.typeonstopnear.dispose();
            this.typeoncollect.dispose();
            this.typeonreach.dispose();
        });

        this.changeSprite = () => {
            this.selectingTexture = true;
        };
        this.applyTexture = texture => {
            if (texture === -1) {
                this.type.texture = -1;
            } else {
                this.type.texture = texture.uid;
                if (!this.type.lastmod && this.type.name === 'NewType') {
                    this.type.name = texture.name;
                }
            }
            this.selectingTexture = false;
            this.parent.fillTypeMap();
            this.update();
        };
        this.cancelTexture = () => {
            this.selectingTexture = false;
            this.update();
        };
        this.typeSave = () => {
            if (this.nameTaken) {
                // animate the error notice
                require('./data/node_requires/jellify')(this.refs.errorNotice);
                if (localStorage.disableSounds !== 'on') {
                    soundbox.play('Failure');
                }
                return false;
            }
            glob.modified = true;
            this.type.lastmod = Number(new Date());
            this.parent.editingType = false;
            this.parent.fillTypeMap();
            this.parent.update();
            window.signals.trigger('typesChanged');
            return true;
        };
