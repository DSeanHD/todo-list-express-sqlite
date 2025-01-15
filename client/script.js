const todoInput = document.getElementById("todo-input");
const todoArea = document.getElementById("todo-area");
const addBtn = document.getElementById("add-btn");

const addItem = async () => {
    if (todoInput.value === "") {
        return null;
    }

    await fetch("http://localhost:4000/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ todo_item: todoInput.value })
    });

    location.reload();
}

const editItem = async (id, defaultItem) => {
    let newItem = prompt("Edit Item", defaultItem);

    if (newItem === null || newItem === "") {
        return null;
    }

    await fetch("http://localhost:4000/api", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, newItem })
    });

    location.reload();
}

const deleteItem = async (id) => {
    console.log(id);
    const res = await fetch("http://localhost:4000/api", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    });

    if (res.ok) {
        console.log(`Item with ID ${id} deleted successfully`);
        location.reload();
    } else {
        const errorText = await res.text();
        console.error(`Failed to delete item with ID ${id}: ${errorText}`);
    }
}

const toggleCheckbox = async (id, isChecked) => {
    await fetch("http://localhost:4000/api/toggle", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, isChecked: !isChecked }) // Toggle the current state
    });

    location.reload();
}

const renderList = async () => {
    const res = await fetch("http://localhost:4000/api");
    const data = await res.json();

    data.forEach((item) => {
        todoArea.innerHTML += `
            <div class="todo-item">
                <input 
                    ${item.is_checked === 'true' ? 'checked' : ''} 
                    type="checkbox" 
                    id="${item.id}"
                    onclick="toggleCheckbox(${item.id}, ${item.is_checked})"
                >
                <label style="${item.is_checked === 'true' ? 'text-decoration-line: line-through' : ''}" for="${item.id}">${item.todo_items}</label>
                <button title="Edit" onclick="editItem(${item.id}, '${item.todo_items}')" style="background-color: green; color: white">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button title="Delete" onclick="deleteItem(${item.id})" style="background-color: red; color: white">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <br>
        `;
    })
}

renderList();

addBtn.addEventListener('click', addItem);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        addItem();
    }
})