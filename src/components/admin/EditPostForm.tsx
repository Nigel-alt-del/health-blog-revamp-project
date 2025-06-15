
import { usePostForm } from "@/hooks/usePostForm";
import { PostForm } from "./PostForm";
import { type BlogPost } from "@/types/blog";

interface EditPostFormProps {
  post: BlogPost;
  onSubmit: (updatedPost: any) => void;
  onCancel: () => void;
}

export const EditPostForm = ({ post, onSubmit, onCancel }: EditPostFormProps) => {
  const formState = usePostForm({ initialPost: post, onSubmit });

  return (
    <PostForm
      {...formState}
      onCancel={onCancel}
    />
  );
};
