import { findIndex, forEach } from "lodash";
export const SET_TASKS = (state, data) => {
  state.tasks = data;
};

export const ADD_OR_UPDATE_TASK = (state, data) => {
  const index = findIndex(state.tasks, { id: data.id });
  if (index === -1) {
    state.tasks.push(data);
  } else {
    state.tasks.splice(index, 1, data);
  }
};

export const DELETE_TASKS = (state, data) => {
  forEach(data, (id) => {
    const index = findIndex(state.tasks, { id });
    if (index !== -1) {
      state.tasks.splice(index, 1);
    }
  });
};

export const SET_TASK_COMMENTS = (state, data) => {
  state.taskComments = data;
};

export const ADD_TASK_COMMENT = (state, comment) => {
  state.taskComments.push(comment);
};
export const UPDATE_TASK_COMMENT = (state, comment) => {
  const index = findIndex(state.taskComments, { id: comment.id });
  if (index !== -1) {
    state.taskComments.splice(index, 1, comment);
  } else {
    state.taskComments.push(comment);
  }
};

export const DELETE_TASK_COMMENTS = (state, ids) => {
  forEach(ids, (id) => {
    const index = findIndex(state.taskComments, { id });
    if (index !== -1) {
      state.taskComments.splice(index, 1);
    }
  });
};
