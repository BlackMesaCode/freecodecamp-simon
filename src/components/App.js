import React from "react";
import Colors from "./Colors";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.colors = ["red", "green", "blue", "yellow"]
        this.maxLevel = 5;
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            selectedColor: "",
            currentLevel: 1,
            correctUserSelections: 0,
            inputEnabled: false,
        }
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
        this.setState(this.getInitialState());
        this.currentSeries = this.generateSeries();
        this.playSeries();
    }


    async chooseColor(color) {
        // if if currentLevel === maxLevel  (maybe in rendered fnction) -> GAME WON

        // if counter === currentLevel -> 

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
            this.playFailSound();
            // reset game if strict mode
            // replay series of current level
        }

    }

    componentDidUpdate() {
        if (this.state.correctUserSelections === this.state.currentLevel) {
            this.setState({
                currentLevel: this.state.currentLevel + 1,
                correctUserSelections: 0,
            }, () => this.playSeries())
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


    async playSeries() {
        this.setState({
            currentColor: "",
            inputEnabled: false
        }, async function() {
            await this.sleep(2000);
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

    playColorSound(color) {
        if (color) {
            let indexOfColor = this.colors.indexOf(color) + 1;
            var audio = new Audio(`../sounds/${indexOfColor}.mp3`);
            audio.play();
        }
    }

    playFailSound() {
        var audio = new Audio(`../sounds/fail.mp3`);
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
            <div>
                <h1>Simon Says</h1>
                <Colors chooseColor={this.chooseColor.bind(this)} selectedColor={this.state.selectedColor} inputEnabled={this.state.inputEnabled}/>
                <button onClick={this.start.bind(this)}>Start</button>
            </div>
        );
    }
}

