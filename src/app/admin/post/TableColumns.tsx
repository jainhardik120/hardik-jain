"use client";

import { Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Post>[] = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
  },
  {
    id: "edit",
    header: "Edit",
    cell: (context) => {
      const postId = context.row.original.id;
      return (
        <button onClick={() => (window.location.href = `/post/${postId}`)}>
          Edit
        </button>
      );
    },
  },
  {
    id: "delete",
    header: "Delete",
    cell: (context) => {
      const postId = context.row.original.id;
      return (
        <button
          onClick={async () => {
            const response = await fetch(`/api/posts/${postId}`, {
              method: "DELETE",
            });
            if (response.ok) {
              window.location.reload();
            }
          }}
        >
          Delete
        </button>
      );
    },
  },
];
