import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./index.css"; // Tailwind CSS imported here

// Initialize Modal
Modal.setAppElement("#root");

// Fake Data for Initial Tasks
const initialTasks = [
  {
    id: 1,
    title: "Tarea 1",
    description: "Descripción de la tarea 1",
    responsible: ["Usuario 1"]
  },
  {
    id: 2,
    title: "Tarea 2",
    description: "Descripción de la tarea 2",
    responsible: ["Usuario 2", "Usuario 3"]
  }
];
const teamMembers = ["Usuario 1", "Usuario 2", "Usuario 3"];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", responsible: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, taskId: null });
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(
        tasks.filter((task) =>
          task.title.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, tasks]);

  // Open Modal
  const openModal = () => {
    setFormData({ title: "", description: "", responsible: [] });
    setIsEditing(false);
    setModalIsOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Responsible Member
  const addResponsible = (member) => {
    if (!formData.responsible.includes(member)) {
      setFormData((prev) => ({ ...prev, responsible: [...prev.responsible, member] }));
    }
  };

  // Remove Responsible Member
  const removeResponsible = (member) => {
    setFormData((prev) => ({
      ...prev,
      responsible: prev.responsible.filter((res) => res !== member)
    }));
  };

  // Add or Edit Task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId ? { ...task, ...formData } : task
        )
      );
    } else {
      const newTask = {
        id: tasks.length + 1,
        ...formData
      };
      setTasks((prev) => [...prev, newTask]);
    }
    closeModal();
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      responsible: task.responsible
    });
    setEditingTaskId(task.id);
    setIsEditing(true);
    setModalIsOpen(true);
  };

  // Open Confirm Delete Modal
  const openConfirmDeleteModal = (taskId) => {
    setConfirmDeleteModal({ isOpen: true, taskId });
  };

  // Close Confirm Delete Modal
  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModal({ isOpen: false, taskId: null });
  };

  // Delete Task
  const deleteTask = () => {
    setTasks((prev) => prev.filter((task) => task.id !== confirmDeleteModal.taskId));
    closeConfirmDeleteModal();
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchText("");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lista de Tareas</h1>
        <button 
          onClick={openModal} 
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Añadir Tarea
        </button>
      </header>
      <main>
      <div className="flex items-center space-x-2 py-5">
          <input
            type="text"
            placeholder="Buscar por título"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {searchText && (
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-3 py-2 rounded shadow hover:bg-gray-600"
            >
              Quitar Filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div className="bg-white p-4 rounded shadow relative" key={task.id}>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => openEditModal(task)}
                  className="bg-gray-200 p-1 rounded hover:bg-gray-300 flex items-center text-sm"
                >
                  <span className="mr-1">✏️</span> Editar
                </button>
                <button 
                  onClick={() => openConfirmDeleteModal(task.id)}
                  className="bg-red-200 p-1 rounded hover:bg-red-300 flex items-center text-sm"
                >
                  <span className="mr-1">🗑️</span> Borrar
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
              <p className="text-gray-700 mb-2">{task.description || "Sin descripción"}</p>
              <div className="text-sm text-gray-500 mb-4">
                Responsable(s):
                <ul className="list-disc ml-5">
                  {task.responsible.map((res) => (
                    <li key={res}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Añadir o Editar Tarea"
        className="bg-white p-6 rounded shadow max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">{isEditing ? "Editar Tarea" : "Añadir Tarea"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Título</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Descripción</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Responsables</span>
            <div className="space-y-2">
              {formData.responsible.map((res, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">{res}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsible(res)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ))}
              <select
                onChange={(e) => addResponsible(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled selected>
                  Seleccionar responsable
                </option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <div className="flex justify-end space-x-4">
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button 
              type="button" 
              onClick={closeModal} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={confirmDeleteModal.isOpen}
        onRequestClose={closeConfirmDeleteModal}
        contentLabel="Confirmar Borrado"
        className="bg-white p-6 rounded shadow max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">¿Estás seguro de que deseas borrar esta tarea?</h2>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={deleteTask} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Borrar
          </button>
          <button 
            onClick={closeConfirmDeleteModal} 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
