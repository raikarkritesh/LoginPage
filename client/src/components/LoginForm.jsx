import React from "react";

export const LoginForm = ({activeTab}) => {
  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    // Placeholder for submit logic
    const formData = {
      username: form.elements.exampleInputEmail1.value,
      password: form.elements.exampleInputPassword1.value,
      remember: form.elements.exampleCheck1.checked,
    };
    console.log("Submitting:", formData);
  };
  return (
    <form
      className="container needs-validation"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="mb-3 mt-5 row">
        <div className="col-5 offset-4">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            required
          />
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              aria-describedby="passwordHelp"
              required
            />
            <div id="passwordHelp" className="form-text">
              Incorrect password syntax.
            </div>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};
