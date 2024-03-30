const { COLORS } = GAME_CONSTANTS;

const MainMenuLayer = cc.Layer.extend({
    startGame: null,
    joinGame: null,
    getMatches: null,

    ctor(startGame, joinGame, getMatches) {
        this._super();
        this.startGame = startGame;
        this.joinGame = joinGame;
        this.getMatches = getMatches;
        this.init();
    },

    init() {
        const { width, height } = cc.winSize;
        this.createMenu(width, height);
        // Creates match list after fetching data
        this.getMatchData(matchData => this.createMatchList(matchData.matches, width, height));
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(COLORS.BACKGROUND);
        this.addChild(backgroundColor, -1);
    },

    createMenu(width, height) {
        this.setBackgroundColour();

        const startGameLabel = new cc.LabelTTF("Start Game", "Arial", 38);
        startGameLabel.setFontFillColor(COLORS.TEXT);
        const startGameItem = new cc.MenuItemLabel(startGameLabel, this.startGame);

        const menu = new cc.Menu(startGameItem);
        menu.x = width / 2;
        menu.y = height * 0.75;
        this.addChild(menu, 1);
    },

    createMatchList(matchIds, width, height) {
        const scrollViewHeight = 200;
        const containerHeight = 60 * matchIds.length;

        const scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(width, scrollViewHeight));
        scrollView.setInnerContainerSize(cc.size(width, containerHeight));
        scrollView.setPosition(0, (height - scrollViewHeight) / 2);

        this.setupMatchButtons(matchIds, scrollView, width, containerHeight);

        this.addChild(scrollView);
    },

    setupMatchButtons(matchIds, scrollView, width, containerHeight) {
        matchIds.forEach((match, index) => {
            const matchLabel = "Match " + match.match_id;
            const button = this.createMatchButton({ name: matchLabel }, index, width, containerHeight);
            scrollView.addChild(button);
            this.addEventListenersToButton(button, match.match_id);
        });
    },

    getMatchData(createMatchList) {
        return this.getMatches(createMatchList);
    },

    createMatchButton(match, index, width, containerHeight) {
        const buttonHeight = 50;
        const buttonWidth = width * 0.8;
        const buttonY = containerHeight - (index * 60 + 30);
        const button = new cc.LayerColor(COLORS.GREEN, buttonWidth, buttonHeight);
        button.setPosition(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2);
        this.addLabelToButton(button, match.name, buttonWidth, buttonHeight);
        return button;
    },

    addLabelToButton(button, label, width, height) {
        const matchLabel = new cc.LabelTTF(label, "Arial", 24);
        matchLabel.setFontFillColor(COLORS.TEXT);
        matchLabel.setPosition(width / 2, height / 2);
        button.addChild(matchLabel);
    },

    addEventListenersToButton(button, matchId) {
        const threshold = 10;

        const listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, _event) {
                // Convert touch location to the node (button) space
                let locationInNode = button.convertToNodeSpace(touch.getLocation());
                let size = button.getContentSize();
                let rect = cc.rect(0, 0, size.width, size.height);

                // Check if the touch is within the button bounds
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    button.initialTouchPos = touch.getLocation();
                    button.isScrolling = false;
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, _event) {
                if (button.initialTouchPos && cc.pDistance(button.initialTouchPos, touch.getLocation()) > threshold) {
                    button.isScrolling = true;
                }
            },
            onTouchEnded: function(touch, _event) {
                if (!button.isScrolling && button.initialTouchPos && cc.pDistance(button.initialTouchPos, touch.getLocation()) < threshold) {
                    this.joinGame(matchId);
                }
                button.initialTouchPos = null;
            }.bind(this),
        });

        cc.eventManager.addListener(listener, button);
    }

});
