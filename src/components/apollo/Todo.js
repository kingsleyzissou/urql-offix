import React, { useContext } from 'react';
import { AutoForm, TextField, SubmitField, ErrorsField, HiddenField } from 'uniforms-antd';
import { useQuery } from '@apollo/client';

import { OfflineContext } from '../../config/client.apollo';
import { schema } from '../../schema';
import { FIND_TODOS, CREATE_TODO } from '../../gql/queries';
import { TodoList } from './TodoList';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { getOptimisticResponse } from '../../utils/CreateOptimisticResponse';
import { createTodoUpdateQuery } from '../../utils/mutationOptions';

export function Todo() {

  const { scheduler } = useContext(OfflineContext);
  const { data, error, loading } = useQuery(FIND_TODOS);

  const handleSubmit = (model) => {
    scheduler.execute({
      query: CREATE_TODO,
      variables: model,
      updateQueries: [{ query: FIND_TODOS }],
      optimisticResponse: getOptimisticResponse(model, CREATE_TODO),
      update: createTodoUpdateQuery
    }).subscribe(
      (res) => model.title = '',
      (err) => console.log(err)
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div style={{ width: '40%' }}>
      <h1>Todo List</h1>
      <AutoForm schema={schema} onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
        <ErrorsField />
        <TextField name="title" />
        <HiddenField name="completed" value={false} />
        <SubmitField style={{ float: 'right' }}>Add</SubmitField>
      </AutoForm>
      <br />
      <br />
      <TodoList todos={data.findTodos.items} />
    </div>
  );
};