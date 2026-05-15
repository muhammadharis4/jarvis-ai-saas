/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MessageSquare } from "lucide-react";

import Heading from "./heading";

describe("Heading", () => {
  it("renders title and description", () => {
    render(
      <Heading
        title="Conversation"
        description="Chat with the model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Conversation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Chat with the model")).toBeInTheDocument();
  });
});
