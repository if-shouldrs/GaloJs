const MainMenuLayer = cc.Layer.extend({
    startGame: null,
    joinGame: null,

    ctor(startGame, joinGame) {
        this._super();
        this.startGame = startGame;
        this.joinGame = joinGame;
        this.init();
    },

    init() {
        const { width, height } = cc.winSize;
        this.createMenu(width, height);
        this.createMatchList(width, height);
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(backgroundColor, -1);
    },

    createMenu(width, height) {
        this.setBackgroundColour();

        const startGameLabel = new cc.LabelTTF("Start Game", "Arial", 38);
        startGameLabel.setFontFillColor(cc.color(0, 0, 0));
        const startGameItem = new cc.MenuItemLabel(startGameLabel, this.startGame);

        const menu = new cc.Menu(startGameItem);
        menu.x = width / 2;
        menu.y = height * 0.75;
        this.addChild(menu, 1);
    },

    createMatchList(width, height) {
        // TODO: Generate this list dynamically
        const matches = [
            { id: 1, name: "Match 1" },
            { id: 2, name: "Match 2" },
            { id: 3, name: "Match 3" },
            // Add more matches as needed
        ];

        matches.forEach((match, index) => {
            const matchLabel = new cc.LabelTTF(match.name, "Arial", 24);
            matchLabel.setFontFillColor(cc.color(0, 0, 0));
            const matchItem = new cc.MenuItemLabel(matchLabel, () => this.joinGame(match.id));

            const menu = new cc.Menu(matchItem);
            menu.x = width / 2;
            // Dynamically position each match item below the Start Game button
            menu.y = height * 0.6 - (index * 50); // Adjust spacing as needed
            this.addChild(menu, 1);
        });
    },

});
