const MainMenuLayer = cc.Layer.extend({
    startGameCallback: null,

    // Adjusted to accept a callback function as an argument
    ctor(callback) {
        this._super();
        this.startGameCallback = callback; // Store the passed callback function
        this.init();
    },

    init() {
        const { width, height } = cc.winSize;
        this.createMenu(width, height);
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(backgroundColor, -1);
    },

    createMenu(width, height) {
        this.setBackgroundColour();

        const startGameLabel = new cc.LabelTTF("Start Game", "Arial", 38);
        startGameLabel.setFontFillColor(cc.color(0, 0, 0));
        const startGameItem = new cc.MenuItemLabel(startGameLabel, this.startGameCallback);

        const menu = new cc.Menu(startGameItem);
        menu.x = width / 2;
        menu.y = height / 2;
        this.addChild(menu, 1);
    },
});
