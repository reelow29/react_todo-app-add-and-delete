import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterOption } from '../App';
import classNames from 'classnames';

interface TodoFooterProps {
  todos: Todo[];
  onFilter: (option: FilterOption) => void;
  onDeleteCompletedTodo: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  onFilter,
  onDeleteCompletedTodo,
}) => {
  const [option, setOption] = useState<FilterOption>(FilterOption.All);
  const countActiveTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed);

  const handleFilterSelect =
    (filter: FilterOption) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setOption(filter);
    };

  const deleteCompleted = () => {
    onDeleteCompletedTodo();
  };

  useEffect(() => {
    onFilter(option);
  }, [option, onFilter]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodo} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOption).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: option === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={handleFilterSelect(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
