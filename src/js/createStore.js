function createStore(initialState, reducer) {
    let state = reducer(initialState, {})
    const subscribers = []

    return {
        dispatch(action) {
            state = reducer(state, action)
            subscribers.forEach(sub => sub())
        },
        subscribe(callback) {
            subscribers.push(callback)
        },
        getState() {
            return state
        }
    }
}

export default createStore