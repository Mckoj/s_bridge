import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Strikethrough,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

// ─── Font options ───────────────────────────────────────────
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier", value: "Courier New, monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
];

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#0f172a" },
  { label: "Gray", value: "#64748b" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#10b981" },
  { label: "Red", value: "#ef4444" },
  { label: "Yellow", value: "#f59e0b" },
  { label: "Purple", value: "#8b5cf6" },
];

// ─── Toolbar Button ──────────────────────────────────────────
function ToolbarButton({
  onClick,
  active,
  title,
  children,
  dark,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
        active
          ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
          : dark
          ? "text-slate-400 hover:bg-slate-700/60 hover:text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Divider ───────────────────────────────────────────────
function Divider({ dark }: { dark: boolean }) {
  return (
    <div className={`w-px h-5 mx-0.5 self-center ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
  );
}

// ─── Toolbar ────────────────────────────────────────────────
function EditorToolbar({ editor, dark }: { editor: Editor; dark: boolean }) {
  const toolbarBg = dark
    ? "bg-slate-900/80 border-slate-700"
    : "bg-slate-50 border-slate-200";

  return (
    <div
      className={`flex flex-wrap items-center gap-0.5 px-3 py-2 border-b rounded-t-xl ${toolbarBg}`}
    >
      {/* Font Family */}
      <div className="flex items-center gap-1 mr-1">
        <Type size={13} className={dark ? "text-slate-400" : "text-slate-500"} />
        <select
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editor.chain().focus().setFontFamily(val).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className={`text-[11px] rounded-lg px-1.5 py-1 border outline-none cursor-pointer ${
            dark
              ? "bg-slate-800 border-slate-700 text-slate-300"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <Divider dark={dark} />

      {/* Text Color */}
      <div className="flex items-center gap-1">
        <label
          title="Text color"
          className="relative cursor-pointer"
        >
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-7 h-7 cursor-pointer"
            onInput={(e) => {
              editor.chain().focus().setColor((e.target as HTMLInputElement).value).run();
            }}
            title="Pick text color"
          />
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-lg border text-[11px] font-bold transition-colors ${
              dark
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            A
          </span>
        </label>
        <select
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editor.chain().focus().setColor(val).run();
            } else {
              editor.chain().focus().unsetColor().run();
            }
          }}
          className={`text-[11px] rounded-lg px-1.5 py-1 border outline-none cursor-pointer ${
            dark
              ? "bg-slate-800 border-slate-700 text-slate-300"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          {TEXT_COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <Divider dark={dark} />

      {/* Bold / Italic / Underline / Strikethrough */}
      <ToolbarButton
        dark={dark}
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} />
      </ToolbarButton>

      <Divider dark={dark} />

      {/* Alignment */}
      <ToolbarButton
        dark={dark}
        title="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={14} />
      </ToolbarButton>

      <Divider dark={dark} />

      {/* Lists */}
      <ToolbarButton
        dark={dark}
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Numbered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={14} />
      </ToolbarButton>

      <Divider dark={dark} />

      {/* Undo / Redo */}
      <ToolbarButton
        dark={dark}
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo size={14} />
      </ToolbarButton>
      <ToolbarButton
        dark={dark}
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo size={14} />
      </ToolbarButton>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  dark?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 200,
  dark: darkProp,
}: RichTextEditorProps) {
  const { theme } = useDashboard();
  const dark = darkProp !== undefined ? darkProp : theme === "dark";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: { HTMLAttributes: { class: "font-bold" } },
        italic: { HTMLAttributes: { class: "italic" } },
      }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none outline-none focus:outline-none leading-relaxed`,
        style: `min-height: ${minHeight}px; padding: 12px 16px;`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const editorContainerCls = dark
    ? "bg-slate-950/70 border-slate-700 text-white focus-within:border-blue-500"
    : "bg-white border-slate-200 text-slate-900 focus-within:border-blue-500";

  return (
    <>
      <style>{`
        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: ${dark ? "#475569" : "#94a3b8"};
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor .ProseMirror {
          outline: none;
        }
        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.25rem;
        }
        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
        }
        .tiptap-editor .ProseMirror p {
          margin: 0.25em 0;
        }
        .tiptap-editor .ProseMirror strong {
          font-weight: 700;
        }
        .tiptap-editor .ProseMirror em {
          font-style: italic;
        }
        .tiptap-editor .ProseMirror s {
          text-decoration: line-through;
        }
        .tiptap-editor .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
      <div
        className={`tiptap-editor rounded-xl border overflow-hidden transition-all ${editorContainerCls}`}
      >
        <EditorToolbar editor={editor} dark={dark} />
        <EditorContent
          editor={editor}
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
