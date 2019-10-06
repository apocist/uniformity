import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {Todo, TodoList, TodoRelations} from '../models';
import {TodoListRepository} from './todo-list.repository';

export class TodoRepository extends DefaultCrudRepository<
    Todo,
    typeof Todo.prototype.id,
    TodoRelations
    > {
  public readonly todoList: BelongsToAccessor<
      TodoList,
      typeof Todo.prototype.id
      >;

  constructor(
    @inject('datasources.db') dataSource: juggler.DataSource, // why juggler.DataSource instead of DbDataSource
    @repository.getter('TodoListRepository')
    protected todoListRepositoryGetter: Getter<TodoListRepository>,
  ) {
    super(Todo, dataSource);

    this.todoList = this.createBelongsToAccessorFor(
      'todoList',
      todoListRepositoryGetter,
    );

    this.registerInclusionResolver('todoList', this.todoList.inclusionResolver);
  }
}
