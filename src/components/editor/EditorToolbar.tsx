import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Code, List, ListOrdered, 
  Quote, Heading1, Heading2, Heading3, Link, Image, Undo, Redo
} from 'lucide-react';
import { useState } from 'react';

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap p-2 gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-md ${editor.isActive('code') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Code size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-md ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-md ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-md ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Heading3 size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-md ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Quote size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-1.5 rounded-md ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Link size={18} />
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className={`p-1.5 rounded-md hover:bg-gray-100`}
        >
          <Image size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          <Redo size={18} />
        </button>
      </div>

      {showLinkInput && (
        <form onSubmit={handleLinkSubmit} className="flex p-2 border-t border-gray-200">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-grow p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="px-3 py-1 ml-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      )}

      {showImageInput && (
        <form onSubmit={handleImageSubmit} className="flex p-2 border-t border-gray-200">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-grow p-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImageInput(false);
              setImageUrl('');
            }}
            className="px-3 py-1 ml-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditorToolbar;