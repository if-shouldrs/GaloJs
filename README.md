
# GaloJs

GaloJs is a modern implementation of the classic game Tic Tac Toe, built using Cocos2d v3.17.2. It features a client-server architecture where the game client is developed with Cocos2d and communicates with a REST API server.

## Features

- Classic Tic Tac Toe gameplay.
- Cross-platform support for web and Windows.
- Modern JavaScript integration with Cocos2d.
- Client-server architecture for easy game state management and updates.

## Prerequisites

Before installing GaloJs, ensure you have the following installed:

- Git
- Python 2.7 or later
- Node.js
- CMake

## Installing Cocos2d

GaloJs requires Cocos2d v3.17.2. Follow these steps to install Cocos2d:

```bash
git clone https://github.com/cocos2d/cocos2d-x.git
cd cocos2d-x
git checkout v3
python download-deps.py
git config --global url.https://github.com/.insteadOf git://github.com/
git submodule update --init
python setup.py
```

## Installing GaloJs

After setting up Cocos2d, you can install GaloJs by following these steps:

```bash
git clone https://github.com/if-shouldrs/GaloJs
cd GaloJs
npm install
```

## Building and Running

To build and launch GaloJs, use one of the following commands:

- **Web Version**
  - Build and Launch: `npm run build`
  - Publish: `npm run release` - artifacts in `/cocos/publish/html5`

- **Windows Version**
  - Build and Launch: `npm run win32`
  - Publish: `npm run win32-build` - artifacts in `cocos/build/bin/GaloJs/Release`

## Project Structure

- **src/**: Contains the modern JavaScript code for the game logic and UI.
- **cocos/src/**: Contains the transpiled JavaScript code compatible with Cocos2d for multi-platform support.

## License

GaloJs is licensed under the GNU General Public License v3.0 or later (GPL-3.0-or-later). See the LICENSE file in the project repository for the full license text.
