const HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function() {
        this._super();

        const { width, height } = cc.winSize;

        // Default parameter for greeting text
        this.createHelloLabel(width, height);

        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: width / 2,
            y: height / 2
        });
        this.addChild(this.sprite, 0);

        return true;
    },
    
    createHelloLabel: function(width, height, text = `Hello World`) {
        const helloLabel = new cc.LabelTTF(text, "Arial", 38);
        helloLabel.x = width / 2;
        helloLabel.y = height / 2 + 200;
        this.addChild(helloLabel, 5);

        const logText = () => console.log(`Label created with text: ${text}`);
        logText();
    }
});

const HelloWorldScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        const layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
