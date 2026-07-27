import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="container text-center py-5">
            <h1>Something went wrong</h1>
            <p className="text-muted">
              This page hit an unexpected error. Try reloading, or head back home.
            </p>
            <button className="btn btn-primary rounded-pill px-4" onClick={() => window.location.assign("/")}>
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
