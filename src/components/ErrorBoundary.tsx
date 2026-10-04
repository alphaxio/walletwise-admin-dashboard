"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorFallback from "./ErrorFallback";

type Props = { children: ReactNode; resetKey?: unknown; compact?: boolean };

export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to render dashboard content", error, info.componentStack);
  }

  componentDidUpdate(previous: Props) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.compact) return <span role="alert" title="This value could not be displayed">Unavailable</span>;
    return <ErrorFallback reset={() => this.setState({ failed: false })} />;
  }
}
