import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import EditorToolbar from './EditorToolbar';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TipTapEditor = ({ content, onChange, placeholder = 'Write something amazing...' }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="px-4 py-3 min-h-[300px]">
        <EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
      </div>
    </div>
  );
};

export default TipTapEditor;