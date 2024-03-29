const GameLayer = cc.Layer.extend({
    controller: null,

    ctor(controller) {
        this._super();
        this.controller = controller;
        this.init();
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(backgroundColor, -1);
    },

    init() {
        this.setBackgroundColour();
    },

    setupTouchHandling() {
        // TODO: Implement touch handling
    },

});
