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
        const scrollViewHeight = 200; // Height of the scrollable area
        const containerHeight = 60 * 5; // Adjusted height for button spacing

        const scrollView = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(width, scrollViewHeight));
        scrollView.setInnerContainerSize(cc.size(width, containerHeight));
        scrollView.setPosition(0, (height - scrollViewHeight) / 2);

        const buttons = []; // To keep track of buttons and their match IDs

        const matches = [
            { id: 1, name: "Match 1" },
            { id: 2, name: "Match 2" },
            { id: 3, name: "Match 3" },
            { id: 4, name: "Match 4" },
            { id: 5, name: "Match 5" },
        ];

        matches.forEach((match, index) => {
            const buttonHeight = 50;
            const buttonWidth = width * 0.8;
            const buttonY = containerHeight - (index * 60 + 30);
            const buttonX = width / 2 - buttonWidth / 2;

            const button = new cc.LayerColor(cc.color(0, 255, 0), buttonWidth, buttonHeight);
            button.setPosition(buttonX, buttonY - buttonHeight / 2);

            const matchLabel = new cc.LabelTTF(match.name, "Arial", 24);
            matchLabel.setFontFillColor(cc.color(0, 0, 0));
            matchLabel.setPosition(buttonWidth / 2, buttonHeight / 2);

            button.addChild(matchLabel);
            scrollView.addChild(button);

            // Store button with its match ID for touch detection
            buttons.push({ button, matchId: match.id });
        });

        this.addChild(scrollView);

        // Add a single touch listener for the entire scrollView
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(_touch, _event) {
                return true; // to indicate that we want to process the touch
            },
            onTouchEnded: (touch, _event) => {
                const location = touch.getLocation();

                // Check each button for a touch
                for (let i = 0; i < buttons.length; i++) {
                    const { button, matchId } = buttons[i];
                    const buttonWorldPosition = button.getParent().convertToWorldSpace(button.getPosition());
                    const buttonRect = cc.rect(buttonWorldPosition.x - button.width / 2, buttonWorldPosition.y - button.height / 2, button.width, button.height);

                    if (cc.rectContainsPoint(buttonRect, location)) {
                        this.joinGame(matchId);
                        break; // Found the button, no need to check others
                    }
                }
            }, // Ensure 'this' context is preserved
        }, this);
    }

});
