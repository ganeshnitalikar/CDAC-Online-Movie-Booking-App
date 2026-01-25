function createResult(error = null, data = null) {
  if (error) {
    return {
      status: "error",
      message: typeof error === "string" ? error : "Something went wrong"
    };
  }

  return {
    status: "success",
    data
  };
}

module.exports = { createResult };
