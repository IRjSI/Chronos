import axiosClient from "./axiosClient";

export async function getComments(projectId: string) {
    const res = await axiosClient.get(`${import.meta.env.VITE_BACKEND_URL}/projects/comments/${projectId}`);
    return res.data.data;
}

export async function addComment(projectId: string, content: string) {
    const res = await axiosClient.post(`${import.meta.env.VITE_BACKEND_URL}/projects/comments/${projectId}`, {content});
    return res.data.data;
}

export async function editComment(projectId: string, commentId: string, content: string) {
    const res = await axiosClient.patch(`${import.meta.env.VITE_BACKEND_URL}/projects/comments/${projectId}/${commentId}`, content);
    return res.data.data;
}

export async function deleteComment(commentId: string) {
    const res = await axiosClient.delete(`${import.meta.env.VITE_BACKEND_URL}/projects/comments/${commentId}`);
    return res.data.data;
}