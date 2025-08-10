import React from "react";

export const LoginForm = ({activeTab}) => {
  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const payload = {
      name: form.elements.exampleInputEmail1.value,
      password: form.elements.exampleInputPassword1.value,
      remember: form.elements.exampleCheck1.checked,
    };
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        // Store tokens in localStorage
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        console.log("Login successful:", data);
        alert("Login successful!");
      } else {
        console.error("Login failed:", data);
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
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
            type="text"
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
