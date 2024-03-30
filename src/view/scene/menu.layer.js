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
        // ScrollView container size - adjust as needed
        const scrollViewHeight = 200; // Height of the scrollable area
        const containerHeight = 50 * 5; // Assuming each item is 50px high and we have 5 items for this example

        const scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(width, scrollViewHeight));
        scrollView.setInnerContainerSize(cc.size(width, containerHeight));
        scrollView.x = 0;
        scrollView.y = height * 0.25 - scrollViewHeight; // Positioning the scroll view

        const scrollViewYPosition = (height - scrollViewHeight) / 2; // Adjusted for centering
        scrollView.setPosition(0, scrollViewYPosition);

        // TODO: Generate this list dynamically
        const matches = [
            { id: 1, name: "Match 1" },
            { id: 2, name: "Match 2" },
            { id: 3, name: "Match 3" },
            { id: 4, name: "Match 4" },
            { id: 5, name: "Match 5" },
            // Add more matches as needed
        ];

        matches.forEach((match, index) => {
            const matchLabel = new ccui.Text(match.name, "Arial", 24);
            matchLabel.setColor(cc.color(0, 0, 0));
            matchLabel.setPosition(width / 2, containerHeight - (index * 50 + 25)); // Adjust positioning as needed
            scrollView.addChild(matchLabel);

            // You can also add touch events to each label to handle the join action
        });

        this.addChild(scrollView);
    },

});
