import PropTypes from "prop-types";

export const taskProps = {
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    due_date: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    assigned_to: PropTypes.string,
    created_by: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
};
export const projectProps = {
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    created_by: PropTypes.string,
    tasks: PropTypes.arrayOf(taskProps),
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
};
export const teamProps = {
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    managers: PropTypes.arrayOf(PropTypes.string),
    members: PropTypes.arrayOf(PropTypes.string),
    created_at: PropTypes.string,
  }),
};
