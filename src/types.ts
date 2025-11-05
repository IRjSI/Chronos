import type { Key } from "react";

export interface IState {
  _id: number;
  label: string;
  value: string | number;
}

export interface ITask {
  _id: Key;
  title: string;
  status?: string;
  description?: string;
  dueDate: string;
  projectId?: {
    title: string
  }
}

export interface IProject {
  _id: Key;
  title: string;
  description?: string;
  progress: number;
  startDate: string;
  endDate: string;
}

export interface IComment {
  _id: Key;
  content: string;
}