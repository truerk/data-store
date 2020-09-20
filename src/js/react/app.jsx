import React from 'react'
import classes from './index.module.scss'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className={classes.app}>
                app
            </div>
        )
    }
}

export default App