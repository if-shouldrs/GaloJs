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

            // Use a closure to capture the match ID and initial touch position
            (function(matchId){
                let initialTouchPos = null;

                button.onTouchBegan = function(touch, event) {
                    initialTouchPos = touch.getLocation();
                    return true; // to indicate that we want to process the touch
                };

                button.onTouchEnded = function(touch, event) {
                    const finalTouchPos = touch.getLocation();

                    // Check if the touch moved more than a threshold amount
                    if (initialTouchPos && cc.pDistance(initialTouchPos, finalTouchPos) < threshold) {
                        // The touch did not move much, assume it was a tap
                        this.joinGame(matchId);
                    }
                    initialTouchPos = null; // Reset the initial touch position
                }.bind(this); // Make sure to bind 'this' to refer to the layer instance
            }).call(this, match.id); // Immediately invoke the function passing the match ID

            scrollView.addChild(button);
            // Store button with its match ID for touch detection
            buttons.push({ button, matchId: match.id });
        });

        this.addChild(scrollView);

        // A threshold for how much a touch can move before it's considered a scroll
        const threshold = 10;

        // Make sure to add the touch event listener to each button
        buttons.forEach(({ button, matchId }) => {
            let initialTouchPos = null;
            let isScrolling = false;

            const listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false, // Start with false to allow for scrolling
                onTouchBegan: function(touch, event) {
                    initialTouchPos = touch.getLocation();
                    isScrolling = false; // Reset the scrolling flag
                    return true;
                },
                onTouchMoved: function(touch, event) {
                    // If the user moves their finger, check if it's a scroll
                    if (cc.pDistance(initialTouchPos, touch.getLocation()) > threshold) {
                        isScrolling = true;
                    }
                    return true;
                },
                onTouchEnded: function(touch, event) {
                    if (!isScrolling) {
                        // Call the joinGame only if it was not a scroll
                        this.joinGame(matchId);
                    }
                    return false; // Do not swallow the touch, allow for propagation
                }.bind(this)
            });

            cc.eventManager.addListener(listener, button);
        });


    },

});
