import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import * as ErrorModule from './components/Error';
import { Todo } from './types/Todo';

// Enum for filter options
export enum FilterOption {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.All,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodoList)
      .catch(() => setErrorMessage(ErrorModule.ErrorMessage.Get))
      .finally(() => setIsLoading(false));
  }, []);

  const handleHideError = () => {
    setErrorMessage('');
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleAddNewTodo = (newTodo: Todo) => {
    setTodoList(prevTodos => [...prevTodos, newTodo]);
  };

  const markAllTodoCompleted = () => {
    const isCompleted = todoList.every(todo => todo.completed);

    const updatedTodo = todoList.map(todo => ({
      ...todo,
      completed: !isCompleted,
    }));

    setTodoList(updatedTodo);
  };

  const handleChangeToggle = (id: number) => {
    setTodoList(prevTodo =>
      prevTodo.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodoList(prevTodo => prevTodo.filter(todo => todo.id !== id));
  };

  const handleDeleteCompletedTodos = () => {
    setTodoList(todoList.filter(todo => !todo.completed));
  };

  const handleFilterTodo = (option: FilterOption) => {
    setFilterOption(option);
  };

  // Визначення відфільтрованих завдань
  const filteredTodos = todoList.filter(todo => {
    switch (filterOption) {
      case FilterOption.Active:
        return !todo.completed;
      case FilterOption.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todo-app">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          onError={handleError}
          onAddTodo={handleAddNewTodo}
          onCompleted={markAllTodoCompleted}
        />
        {!isLoading && (
          <TodoList
            todos={filteredTodos}
            isLoading={isLoading}
            onToggle={handleChangeToggle}
            onDelete={handleDeleteTodo}
            onError={handleError}
          />
        )}
        {todoList.length !== 0 && (
          <TodoFooter
            todos={todoList}
            onFilter={handleFilterTodo}
            onDeleteCompletedTodo={handleDeleteCompletedTodos}
          />
        )}
      </div>
      <ErrorModule.Error
        errorMessage={errorMessage}
        onClose={handleHideError}
      />
    </div>
  );
};
