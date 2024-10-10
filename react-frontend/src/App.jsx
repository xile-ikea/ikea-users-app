import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const hostUrl = import.meta.env.PROD
    ? window.location.href
    : "http://localhost:8080/";

  const fetchUsers = async () => {
    const response = await fetch(`${hostUrl}api/users`);
    const usersToJson = await response.json();
    console.log(usersToJson);
    setUsers(usersToJson);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchManagers = async () => {
    const response = await fetch(`${hostUrl}api/managers`);
    const usersToJson = await response.json();
    console.log(usersToJson);
    setManagers(usersToJson);
  };
  useEffect(() => {
    fetchManagers();
  }, []);

  const updateUser = async (e) => {
    const response = await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ isAdmin: e.target.checked }),
    });
    await response.json();
    await fetchUsers();
  };

  const deleteUser = async (e) => {
    await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    await fetchUsers();
  }

  const createUser = async (e) => {
    e.preventDefault()
    const response = await fetch(`${hostUrl}api/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: e.target.name.value, isAdmin: e.target.isAdmin.checked, favourite_beer: e.target.favourite_beer.value }),
    });
    const newUser = await response.json();

    setUsers([...users, newUser]);
  }
  

  return (
    <>
      <h1>Create New Beer-User</h1>
      <form onSubmit={createUser}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="Favourite Beer">Favourite Beer</label>
        <input type="text" name="Favourite_Beer" id="favourite_beer" />
        <label htmlFor="isAdmin">Is Admin</label>
        <input type="checkbox" name="isAdmin"/>
        <input type="submit" />
        <button type="reset">Reset form</button>
      
        
        
      </form>
      <br></br>
      <h1>Beer-Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Is Admin</th>
            <th>Delete</th>
            <th>Update</th>
            <th>Favourite Beer</th>
          </tr>
          </thead>

        
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.name}</p>
                </td>
              <td>
                <input
                  data-id={user.id}
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={updateUser}
                />
              </td>
              
              <td>
                <button data-id={user.id} onClick={deleteUser}>Delete</button>
                <button data-id={user.id} onClick={updateUser}>Update</button>
                
              </td>
            <td><p>{user.favourite_beer}</p></td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
