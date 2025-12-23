import { NavLink, Route, Routes } from "react-router-dom";
import PostManager from "./components/PostManager";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="p-5">
      <nav className="text-center mb-5">
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            `px-5 py-2 mr-2 rounded text-white no-underline inline-block ${
              isActive ? "bg-blue-500" : "bg-gray-500"
            }`
          }
        >
          Posts & Comments
        </NavLink>
        <NavLink
          to="/todos"
          className={({ isActive }) =>
            `px-5 py-2 rounded text-white no-underline inline-block ${
              isActive ? "bg-blue-500" : "bg-gray-500"
            }`
          }
        >
          Todo List
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<PostManager />} />
        <Route path="/posts" element={<PostManager />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </div>
  );
}

export default App;
