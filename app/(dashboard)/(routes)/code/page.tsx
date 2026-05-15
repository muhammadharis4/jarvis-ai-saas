"use client";

import * as z from "zod";
import axios from "axios";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type OpenAI from "openai";

import BotAvatar from "@/components/bot-avatar";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import Empty from "@/components/empty";
import Markdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

import { formSchema } from "./constants";

type ChatMessage = OpenAI.Chat.ChatCompletionMessageParam;

function messagePlainText(message: ChatMessage): string {
  const c = message.content;
  if (typeof c === "string") return c;
  return "";
}

const CodePage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data as ChatMessage]);

      form.reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error(getApiErrorMessage(error));
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using react hooks."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty
              title="Describe what to build"
              label="Your prompt and the model’s answer appear here in a thread."
              hint="Responses are markdown code blocks — same OpenAI key as Conversation."
            />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${messagePlainText(message).slice(0, 48)}`}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "assistant"
                    ? "bg-white border border-black/10"
                    : "bg-muted",
                )}
              >
                {message.role === "assistant" ? (
                  <>
                    <BotAvatar />
                    <Markdown
                      components={{
                        pre: ({ ...props }) => (
                          <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ ...props }) => (
                          <code className="bg-black/10 rounded-lg p-1" {...props} />
                        ),
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {messagePlainText(message)}
                    </Markdown>
                  </>
                ) : (
                  <>
                    <UserAvatar />
                    <p className="text-sm whitespace-pre-wrap">{messagePlainText(message)}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
