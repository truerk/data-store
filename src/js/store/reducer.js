import { ADD_TODO } from "./types"

const handlerReducer = {
    [ADD_TODO]: (state, action) => {
        return {...state, todos: [...state.todos, action.todo] }
    },
    DEFAULT: state => state
}

function reducer(state, action) {
    const handler = handlerReducer[action.type] || handlerReducer.DEFAULT

    return handler(state, action)
}

export default reducer