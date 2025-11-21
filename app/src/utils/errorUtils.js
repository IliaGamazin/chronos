export const formatErrorMessage = error => {
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    return 'An unexpected error occurred. Please try again later.';
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return data?.message || 'Invalid request. Please check your input.';
    case 401:
      return data?.message || 'Unauthorized. Please log in again.';
    case 403:
      return data?.message || 'Access forbidden.';
    case 404:
      return data?.message || 'Resource not found.';
    case 409:
      return data?.message || 'Conflict. Resource already exists.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      break;
  }

  if (data?.message) {
    const message = data.message;

    if (message.includes('duplicate key')) {
      return 'This record already exists.';
    }
    if (message.includes('foreign key constraint')) {
      return 'Cannot perform this action due to related records.';
    }
    if (message.includes('validation')) {
      return 'Validation error. Please check your input.';
    }

    if (message.length > 150) {
      return message.substring(0, 150) + '...';
    }

    return message;
  }

  return 'An error occurred. Please try again.';
};
