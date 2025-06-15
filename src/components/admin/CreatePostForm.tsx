
import { usePostForm } from "@/hooks/usePostForm";
import { PostForm } from "./PostForm";

interface CreatePostFormProps {
  onSubmit: (post: any) => void;
  onCancel: () => void;
}

export const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
  const formState = usePostForm({ onSubmit });

  return (
    <PostForm
      {...formState}
      onCancel={onCancel}
    />
  );
};
