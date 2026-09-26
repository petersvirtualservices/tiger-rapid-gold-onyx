import { createFileRoute } from "@tanstack/react-router";
import { MoveApp } from "@/components/move-app";

export const Route = createFileRoute("/")({ component: MoveApp });
