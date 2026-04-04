import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReportVideoButton } from "@/components/ui/report-video";

// Mock the server action
vi.mock("@/app/videos/[slug]/report-action", () => ({
  reportVideo: vi.fn().mockResolvedValue({ success: true }),
}));

describe("ReportVideoButton", () => {
  it("renders the report link", () => {
    render(<ReportVideoButton videoId="test-id" />);
    expect(screen.getByText("Report this video")).toBeInTheDocument();
  });

  it("shows reason dropdown when clicked", () => {
    render(<ReportVideoButton videoId="test-id" />);
    fireEvent.click(screen.getByText("Report this video"));

    expect(screen.getByText("Select reason")).toBeInTheDocument();
    expect(screen.getByText("Inappropriate content")).toBeInTheDocument();
    expect(screen.getByText("Copyright violation")).toBeInTheDocument();
    expect(screen.getByText("Spam or misleading")).toBeInTheDocument();
    expect(screen.getByText("Broken or wrong video")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("shows submit and cancel buttons when expanded", () => {
    render(<ReportVideoButton videoId="test-id" />);
    fireEvent.click(screen.getByText("Report this video"));

    expect(screen.getByText("Submit Report")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("hides form when cancel is clicked", () => {
    render(<ReportVideoButton videoId="test-id" />);
    fireEvent.click(screen.getByText("Report this video"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText("Report this video")).toBeInTheDocument();
    expect(screen.queryByText("Submit Report")).not.toBeInTheDocument();
  });

  it("has 5 report reason options", () => {
    render(<ReportVideoButton videoId="test-id" />);
    fireEvent.click(screen.getByText("Report this video"));

    const select = screen.getByRole("combobox");
    const options = select.querySelectorAll("option");
    // 1 placeholder + 5 reasons = 6 options
    expect(options.length).toBe(6);
  });
});
