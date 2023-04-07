import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt from "jwt-decode";
import "./Home.scss";
import { useEffect, useState } from "react";

export default function Home() {
  const [taskText, setTaskText] = useState("");
  const [Task, setTask] = useState([]);

  const [NoTask, setNoTask] = useState(false);
  const [listTodo, setListTodo] = useState([]);
  const [Defaultcheck, setDefaultCheck] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodeToken = jwt(token);
    const user_id = decodeToken["id"];

    if (token == null) {
      navigate("/login");
    } else {
      const Loading = async () => {
        await axios
          .get(`http://localhost:9000/api/todo/${user_id}`)
          .then((response) => {
            if (response.status === 200) {
              setTask(response.data.task);
            }
          })
          .catch(function (error) {
            setTask([]);
          });
      };
      Loading();
      if (Task.length === 0) {
        setNoTask(true);
      }
    }
  }, []);

  function updateTask() {
    const token = localStorage.getItem("token");
    const decodeToken = jwt(token);
    const user_id = decodeToken["id"];
    axios
      .get(`http://localhost:9000/api/todo/${user_id}`)
      .then((response) => {
        if (response.status === 200) {
          setTask(response.data.task);
        }
      })
      .catch(function (error) {
        setTask([]);
      });
  }

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decodeToken = jwt(token);
      const user_id = decodeToken["id"];
      const res = await axios.post(
        `http://localhost:9000/api/todo/${user_id}`,
        {
          task: taskText,
        }
      );
      setListTodo((prev) => [...prev, res.data]);
      setTaskText("");
      updateTask();
    } catch (err) {
      console.log("Erreur dans la requete");
    }
  };

  const updateTodo = async (id, updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:9000/api/todo/${id}`,
        {
          task: updatedTask,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListTodo((prev) =>
        prev.map((todo) => {
          if (todo.id === id) {
            return { ...todo, task: updatedTask };
          } else {
            return todo;
          }
        })
      );
    } catch (err) {
      console.log("Erreur dans la requete");
    }
  };

  const handleUpdate = (id) => {
    const updatedTask = prompt("Entrez la nouvelle tâche");
    if (updatedTask) {
      updateTodo(id, updatedTask);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await axios
        .delete(`http://localhost:9000/api/todo/${id}`)
        .then((response) => {
          if (response.status === 200) {
            updateTask();
          }
        });
    } catch (err) {
      console.log("Erreur dans la requete");
    }
  };

  function checkedstatus(status) {
    if (status === 0) {
      return false;
    } else {
      return true;
    }
  }

  function check(id) {
    axios
      .get(`http://localhost:9000/api/todo/check/${id}`)
      .then((response) => {
        if (response.status === 200) {
          updateTask();
        }
      })
      .catch(function (error) {
        console.log("Erreur dans la requete");
      });
  }

  return (
    <>
      <div className="app-container" id="taskList">
        <h1 className="app-header">TO DO LIST</h1>
        <form className="add-task" onSubmit={(e) => addTodo(e)}>
          <input
            type="text"
            autoComplete="off"
            placeholder="Add New Task"
            v-model="tasks.name"
            className="task-input"
            onChange={(e) => {
              setTaskText(e.target.value);
            }}
            value={taskText}
          />
          <button
            type="submit"
            value=""
            className="submit-task"
            title="Add Task"
          />
        </form>
        <ul className="task-list">
          {Task.map((element) => (
            <li className="task-list-item">
              <label className="task-list-item-label">
                <input
                  type="checkbox"
                  checked={checkedstatus(element.status)}
                  onChange={() => {
                    check(element.id);
                  }}
                />
                <span>{element.task}</span>
              </label>
              <span
                className="update-btn"
                onClick={() => {
                  handleUpdate(element.id);
                }}
                title="Update Task"
              ></span>
              <span
                className="delete-btn"
                onClick={(e) => {
                  deleteTodo(element.id);
                }}
                title="Delete Task"
              ></span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
