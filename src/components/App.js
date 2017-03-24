import React from "react";
import Colors from "./Colors";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.colors = ["red", "green", "blue", "yellow"]
        this.maxLevel = 20;
        this.state = {
            selectedColor: "",
            currentLevel: 1,
            correctUserSelections: 0,
            inputEnabled: false,
            strictMode: true,
            phase: "setup"
        };
        this.currentSeries = this.generateSeries();
    }

    generateSeries() {
        let series = [];
        for (let i = 1; i <= this.maxLevel; i++) {
            let randomIndex = this.getRandomInt(0,3);
            series.push(this.colors[randomIndex]);
        }
        return series;
    }

    start() {
        this.setState({
            selectedColor: "",
            currentLevel: 1,
            correctUserSelections: 0,
            inputEnabled: false,
            phase: "playing"
        });
        this.currentSeries = this.generateSeries();
        this.playSeries(500);

    }


    async chooseColor(color) {
        if (this.currentSeries[this.state.correctUserSelections] === color) {
            this.setState({
                inputEnabled: false,
            }, async () => {
                await this.selectColor(color, 200, 0);
                this.setState((prevState, props) => {
                    return {
                        correctUserSelections: prevState.correctUserSelections + 1,
                        inputEnabled: true
                    }
                });
            })

        } else {
            if (this.state.strictMode) {
                this.playLostSound();
                this.setState({
                    phase: "lost"
                });
            } else {
                this.playWrongSound();
                this.playSeries(2000);
            }
        }

    }

    componentDidUpdate() {
        if (this.state.phase !== "won" && this.state.phase !== "lost") {
            if (this.state.correctUserSelections === this.state.currentLevel) {
                if (this.state.currentLevel === this.maxLevel) { // game won
                    this.playWonSound();
                    this.setState({
                        phase: "won",
                    });
                }
                else {  // go to next level
                    this.setState({
                        currentLevel: this.state.currentLevel + 1,
                        correctUserSelections: 0,
                    }, () => this.playSeries(1500))
                }
            }
        }
    }


    async selectColor(color, colorDuration, noColorDuration) {
        return new Promise(async (resolve) => {
            this.playColorSound(color);
            this.setState({
                selectedColor: color,
            }, async () => {
                await this.sleep(colorDuration);
                this.setState({
                    selectedColor: "",
                }, async () => {
                    await this.sleep(noColorDuration);
                    resolve();
                });
            });
        });
    }


    async playSeries(initialDelay) {
        this.setState({
            currentColor: "",
            inputEnabled: false
        }, async function() {
            await this.sleep(initialDelay);
            for(let i=0; i < this.state.currentLevel; i++) {
                let currentColor = this.currentSeries[i];
                await this.selectColor(currentColor, 800, 200);
            }
            
            this.setState(() => {
                return {
                    currentColor: "",
                    inputEnabled: true
                }
            })
        });
    }

    changeStrictMode(event) {
        this.setState({
            strictMode: event.target.checked
        });
    }

    playColorSound(color) {
        if (color) {
            let indexOfColor = this.colors.indexOf(color) + 1;
            var audio = new Audio(`http://usr.antares.uberspace.de/freecodecamp-simon/${indexOfColor}.mp3`);
            audio.play();
        }
    }

    playLostSound() {
        var audio = new Audio("http://usr.antares.uberspace.de/freecodecamp-simon/lost.mp3");
        audio.play();
    }

    playWonSound() {
        var audio = new Audio("http://usr.antares.uberspace.de/freecodecamp-simon/won.mp3");
        audio.play();
    }

    playWrongSound() {
        var audio = new Audio("http://usr.antares.uberspace.de/freecodecamp-simon/wrong.mp3");
        audio.play();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() {
        return (
            <div id="simon">
                <h1>Simon Says</h1>
                

                {this.state.phase === "playing" && 
                    <div>
                        <Colors chooseColor={this.chooseColor.bind(this)} selectedColor={this.state.selectedColor} inputEnabled={this.state.inputEnabled}/>
                        <div id="level-info">Level: <span id="current-level">{this.state.currentLevel} / {this.maxLevel}</span></div>
                    </div>
                }
                {this.state.phase === "lost" && 
                    <div id="lost">
                        Wrong answer :(  Keep trying!
                    </div>
                }
                {this.state.phase === "won" && 
                    <div id="won">
                        Ladies and gentlemen - We have a winner!
                    </div>
                }
                {(this.state.phase === "setup" || this.state.phase === "won" || this.state.phase === "lost") && 
                    <div id="setup">
                        <div id="strict-mode">
                            <label id="strict-mode-label" htmlFor="strict-mode-checkbox">
                                <input type="checkbox" id="strict-mode-checkbox" onChange={this.changeStrictMode.bind(this)} checked={this.state.strictMode ? "checked": ""}/>Strict?
                            </label>
                        </div>
                        <div id="play-button" onClick={this.start.bind(this)}>
                            <span><i className="fa fa-play-circle-o"></i>Play</span>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

