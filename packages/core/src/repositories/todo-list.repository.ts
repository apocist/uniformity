import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, juggler, repository} from '@loopback/repository';
import {Todo, TodoList, TodoListRelations} from '../models';
// import {DbDataSource} from '../datasources';
import {TodoRepository} from "./todo.repository";

export class TodoListRepository extends DefaultCrudRepository<
  TodoList,
  typeof TodoList.prototype.id,
  TodoListRelations
> {
  public readonly todos: HasManyRepositoryFactory<
      Todo,
      typeof TodoList.prototype.id
      >;

  constructor(
    //@inject('datasources.db') dataSource: DbDataSource,
    @inject('datasources.db') dataSource: juggler.DataSource, // why juggler.DataSource instead of DbDataSource
    @repository.getter('TodoRepository')
    protected todoRepositoryGetter: Getter<TodoRepository>,
  ) {
    super(TodoList, dataSource);
    this.todos = this.createHasManyRepositoryFactoryFor(
        'todos',
        todoRepositoryGetter,
    );

    // Add this line to register the resolver
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }
}
