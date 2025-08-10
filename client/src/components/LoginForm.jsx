import React from "react";

export const LoginForm = () => {
  return (
    <form className="container">
      <div className="mb-3 mt-5 row">
        <div className="col-5 offset-4">
          <label for="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input type="email" className="form-control" id="exampleInputEmail1" />
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              aria-describedby="passwordHelp"
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
            <label className="form-check-label" for="exampleCheck1">
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
