import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button >
    );
}

function HistoryItem(props) {
    return (
        props.selected ?
            (
                <li>
                    <button onClick={props.onClick}><b>
                        {props.desc}
                    </b></button>
                </li>
            ) : (
                <li>
                    <button onClick={props.onClick}>{props.desc}</button>
                </li>
            )
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {
                    [0, 1, 2].map((row) => (
                        <div className='board-row'>
                            {
                                [0, 1, 2].map((column) => this.renderSquare(row * 3 + column))
                            }
                        </div>
                    ))
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                step: -1,
            }],
            stepNumber: 0,
            xIsNext: true,
            ascHistory: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                step: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    switchAsc() {
        this.setState({
            ascHistory: !this.state.ascHistory,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (move) {
                const x = step.step % 3,
                    y = Math.floor(step.step / 3);
                desc = `Move #${move}: (${x}, ${y})`;
            } else {
                desc = 'Game Start';
            }
            return (
                <HistoryItem
                    key={move}
                    selected={move === this.state.stepNumber}
                    onClick={() => this.jumpTo(move)}
                    desc={desc}
                />
            );
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.switchAsc()}>{this.state.ascHistory ? '升序' : '降序'}</button></div>
                    <ol>{this.state.ascHistory ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}