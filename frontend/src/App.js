import { useEffect, useState } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [popupActive, setPopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const getTodos = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error(err))
  }

  const completeTodo = async (id) => {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/api/todo/complete/${id}`,
      {
        method: 'PUT',
      }
    ).then((res) => res.json())

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.completed = data.completed
        }
        return todo
      })
    )
  }

  const deleteTodo = async (id) => {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/api/todo/delete/${id}`,
      {
        method: 'DELETE',
      }
    ).then((res) => res.json())
    setTodos((todos) => todos.filter((todo) => todo._id !== data._id))
  }

  const addTodo = async () => {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/todo/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json())

    setTodos([...todos, data])
    setPopupActive(false)
    setNewTodo('')
  }

  useEffect(() => {
    getTodos()
  }, [])

  return (
    <div className="App">
      <h1>Welcome Milad</h1>
      <h4>Your tasks</h4>

      {todos.length === 0 && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'absolute', top: '50%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
                fontSize: '30px',
              }}
            >
              😐{' '}
            </div>
            <div style={{ fontSize: '20px' }}>You have no tasks</div>
          </div>
        </div>
      )}
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={'todo ' + (todo.completed ? 'is-complete' : '')}
            key={todo._id}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>

            <div
              className={
                !todo.completed ? 'complete-todo' : 'undo-complete-todo'
              }
              onClick={() => completeTodo(todo._id)}
            >
              {!todo.completed ? <span>&#10004;</span> : <span>&#8211;</span>}
            </div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default App
