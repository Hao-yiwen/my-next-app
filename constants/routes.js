export const ROUTES = {
  HOME: '/',
  TODOS: '/todos',
  TODO_DETAIL: (id) => `/todo/${id}`,
  API: {
    TODOS: '/api/todos',
    TODO: (id) => `/api/todos/${id}`,
  },
}; 