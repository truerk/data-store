import createStore from './createStore'
import {setTodo} from './store/actions'
import reducer from './store/reducer'

const state = {
    todos: [{
        name: 'firstTodo'
    },
    {
        name: 'secondTodo'
    }]
}

const $input = document.querySelector('input[name="createTodo"]')
const $button = document.querySelector('#createTodo')
const $todos = document.querySelector('#todos')
const store = createStore(state, reducer)


function createTodo(e) {
    const todo = {name}

    todo.name = $input.value
    $input.value = ''

    store.dispatch(setTodo(todo))
}

function updateTodos(todos) {
    $todos.innerHTML = ''

    todos.forEach(todo => {
        const todoTR = document.createElement('tr')

        todoTR.innerHTML = `<td>${todo.name}</td>`
        $todos.appendChild(todoTR)
    })
}

store.subscribe(() => {
    const state = store.getState()

    updateTodos(state.todos)
})

updateTodos(store.getState().todos)

$button.addEventListener('click', (e) => createTodo(e))
