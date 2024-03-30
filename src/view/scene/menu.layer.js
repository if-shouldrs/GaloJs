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
        const scrollViewHeight = 200;
        const containerHeight = 60 * 5;

        const scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(width, scrollViewHeight));
        scrollView.setInnerContainerSize(cc.size(width, containerHeight));
        scrollView.setPosition(0, (height - scrollViewHeight) / 2);

        this.setupMatchButtons(scrollView, width, containerHeight);

        this.addChild(scrollView);
    },

    setupMatchButtons(scrollView, width, containerHeight) {
        const matches = this.getMatchData();
        matches.forEach((match, index) => {
            const button = this.createMatchButton(match, index, width, containerHeight);
            scrollView.addChild(button);
            this.addEventListenersToButton(button, match.id);
        });
    },

    getMatchData() {
        return [
            { id: 1, name: "Match 1" },
            { id: 2, name: "Match 2" },
            { id: 3, name: "Match 3" },
            { id: 4, name: "Match 4" },
            { id: 5, name: "Match 5" },
        ];
    },

    createMatchButton(match, index, width, containerHeight) {
        const buttonHeight = 50;
        const buttonWidth = width * 0.8;
        const buttonY = containerHeight - (index * 60 + 30);
        const button = new cc.LayerColor(cc.color(0, 255, 0), buttonWidth, buttonHeight);
        button.setPosition(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2);
        this.addLabelToButton(button, match.name, buttonWidth, buttonHeight);
        return button;
    },

    addLabelToButton(button, label, width, height) {
        const matchLabel = new cc.LabelTTF(label, "Arial", 24);
        matchLabel.setFontFillColor(cc.color(0, 0, 0));
        matchLabel.setPosition(width / 2, height / 2);
        button.addChild(matchLabel);
    },

    addEventListenersToButton(button, matchId) {
        const threshold = 10;
        let initialTouchPos = null;
        let isScrolling = false;

        const listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event) {
                initialTouchPos = touch.getLocation();
                isScrolling = false;
                return true;
            },
            onTouchMoved: function(touch, event) {
                if (cc.pDistance(initialTouchPos, touch.getLocation()) > threshold) {
                    isScrolling = true;
                }
                return true;
            },
            onTouchEnded: function(touch, event) {
                if (!isScrolling && cc.pDistance(initialTouchPos, touch.getLocation()) < threshold) {
                    this.joinGame(matchId);
                }
                return false;
            }.bind(this)
        });

        cc.eventManager.addListener(listener, button);
    },

});
