import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Fib() {
    // Stateful values
    const [seenIndexes, setSeenIndexes] = useState([])
    const [values, setValues] = useState({})
    const [index, setIndex] = useState(0)

    // Side effects
    useEffect(() => {
        async function fetchValues() {
            const values = await axios.get('/api/values/current')
            setValues(values.data)
        }
        fetchValues()
    }, [])

    useEffect(() => {
        async function fetchIndexes() {
            const seenIndexes = await axios.get('/api/values/all')
            setSeenIndexes(seenIndexes.data)
        }
        fetchIndexes()
    }, [])

    // Utility functions
    function renderSeenIndexes() {
        return seenIndexes.map(({ number }) => number ).join(', ')
    }

    function renderValues() {
        const entries = []

        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]} 
                </div>
            )
        }
        return entries
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        await axios.post('/api/values', {
            index
        })
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index</label>
                <input 
                    type="number"
                    value={index}
                    onChange={event => setIndex(event.target.value)}
                />
                <button>Submit</button>
            </form>

            <h3>Indexes I've seen:</h3>
            {renderSeenIndexes()}

            <h3>Calculated values:</h3>
            {renderValues()}
        </div>
    )
}

// class Fib extends Component {
//     state = {
//         seenIndexes: [],
//         values: {},
//         index: ''
//     }

//     async fetchValues() {
//         const values = await axios.get('/api/values/current')
//         this.setState({
//             values: values.data
//         })
//     }

//     async fetchIndexes() {
//         const seenIndexes = await axios.get('/api/values/all')
//         this.setState({
//             seenIndexes: seenIndexes.data
//         })
//     }

//     renderSeenIndexes() {
//         return this.state.seenIndexes.map(({ number }) => {
//             number
//         }).join(', ')
//     }

//     renderValues() {
//         const entries = []

//         for (let key in this.state.values) {
//             entries.push(
//                 <div key={key}>
//                     For index {key} I calculated {this.state.values[key]} 
//                 </div>
//             )
//         }
//         return this.state.values
//     }

//     handleSubmit = async (event) => {
//         event.preventDefault()

//         await axios.post('/api/values', {
//             index: this.state.index
//         })
//     }

//     componentDidMount() {
//         this.fetchValues();
//         this.fetchIndexes()
//     }

//     render() {
//         return(
//             <div>
//                 <form onSubmit={this.handleSubmit}>
//                     <label>Enter your index</label>
//                     <input 
//                         type="number"
//                         value={this.state.index}
//                         onChange={event => this.setState({ index: event.target.value })}
//                     />
//                     <button>Submit</button>
//                 </form>

//                 <h3>Indexes I've seen:</h3>
//                 {this.renderSeenIndexes()}

//                 <h3>Calculated values:</h3>
//                 {this.renderValues()}
//             </div>
//         )
//     }
// }

export default Fib
